/**
 * GetwayROM File Explorer - Advanced Search Engine
 * Uses exact substring matching first, then Fuse.js for fuzzy fallback.
 * Prioritizes exact matches so "moto g05" won't return "moto g04".
 */
(function () {
  'use strict';

  var fuseInstance = null;

  /**
   * Initialize Fuse.js with the given files array.
   */
  function init(files) {
    if (typeof Fuse === 'undefined') {
      return;
    }
    fuseInstance = new Fuse(files, {
      keys: [
        { name: 'name', weight: 0.7 },
        { name: 'brand', weight: 0.2 },
        { name: 'extension', weight: 0.1 }
      ],
      threshold: 0.2,
      distance: 80,
      minMatchCharLength: 2,
      includeScore: true,
      includeMatches: true,
      useExtendedSearch: true,
      // Position matters: matches near the start of a filename are more relevant
      // (e.g. "Moto G05" at the start is a stronger match than buried in the middle)
      ignoreLocation: false
    });
  }

  /**
   * Parse advanced operators from a query string.
   * Supported: brand:Value, ext:Value, type:Value
   * Returns { brand, ext, type, text }
   */
  function parseQuery(query) {
    var result = { brand: '', ext: '', type: '', text: '' };
    var remaining = query;

    // Extract brand:Value
    var brandMatch = remaining.match(/brand:(\S+)/i);
    if (brandMatch) {
      result.brand = brandMatch[1];
      remaining = remaining.replace(brandMatch[0], '');
    }

    // Extract ext:Value
    var extMatch = remaining.match(/ext:(\S+)/i);
    if (extMatch) {
      result.ext = extMatch[1];
      remaining = remaining.replace(extMatch[0], '');
    }

    // Extract type:Value
    var typeMatch = remaining.match(/type:(\S+)/i);
    if (typeMatch) {
      result.type = typeMatch[1];
      remaining = remaining.replace(typeMatch[0], '');
    }

    result.text = remaining.replace(/\s+/g, ' ').trim();
    return result;
  }

  /**
   * Check if all search terms appear in the file name (exact substring match).
   * Returns true if every word in the query is found in the name.
   */
  function exactSubstringMatch(fileName, query) {
    var nameLower = fileName.toLowerCase();
    var terms = query.toLowerCase().split(/\s+/).filter(function (t) { return t.length > 0; });
    for (var i = 0; i < terms.length; i++) {
      if (nameLower.indexOf(terms[i]) === -1) return false;
    }
    return true;
  }

  /**
   * Score an exact match based on how closely it matches the query.
   * Lower score = better match. Considers position of match and name length.
   */
  function scoreExactMatch(fileName, query) {
    var nameLower = fileName.toLowerCase();
    var queryLower = query.toLowerCase();
    var score = 0;

    // Bonus for full query appearing as contiguous substring
    if (nameLower.indexOf(queryLower) !== -1) {
      score -= 1000;
      // Extra bonus if it appears near the start
      score -= (100 - Math.min(nameLower.indexOf(queryLower), 100));
    }

    // Prefer shorter file names (more specific matches)
    score += fileName.length * 0.1;

    return score;
  }

  /**
   * Perform search with advanced operator support.
   * Uses exact substring matching first, then fuzzy fallback.
   * Returns sorted results array of file objects.
   */
  function search(files, query) {
    if (!query || !query.trim()) return files;

    var parsed = parseQuery(query);
    var results = files;

    // Apply brand filter
    if (parsed.brand) {
      var brandLower = parsed.brand.toLowerCase();
      results = results.filter(function (f) {
        return f.brand && f.brand.toLowerCase() === brandLower;
      });
    }

    // Apply extension filter
    if (parsed.ext) {
      var extLower = parsed.ext.toLowerCase();
      results = results.filter(function (f) {
        return f.extension && f.extension.toLowerCase() === extLower;
      });
    }

    // Apply type filter
    if (parsed.type) {
      var typeLower = parsed.type.toLowerCase();
      results = results.filter(function (f) {
        return f.fileType && f.fileType.toLowerCase() === typeLower;
      });
    }

    // Apply text search - exact first, then fuzzy fallback
    if (parsed.text) {
      var searchText = parsed.text;

      // Phase 1: Exact substring matches (prioritized)
      var exactMatches = results.filter(function (f) {
        return exactSubstringMatch(f.name, searchText);
      });

      // Sort exact matches by relevance score
      exactMatches.sort(function (a, b) {
        return scoreExactMatch(a.name, searchText) - scoreExactMatch(b.name, searchText);
      });

      // Phase 2: Fuzzy matches via Fuse.js (only items NOT in exact matches)
      var fuzzyResults = [];
      if (fuseInstance) {
        var exactSet = {};
        for (var i = 0; i < exactMatches.length; i++) {
          exactSet[exactMatches[i].url] = true;
        }

        var tempFuse = new Fuse(results, {
          keys: [
            { name: 'name', weight: 0.7 },
            { name: 'brand', weight: 0.2 },
            { name: 'extension', weight: 0.1 }
          ],
          threshold: 0.2,
          distance: 80,
          minMatchCharLength: 2,
          includeScore: true,
          includeMatches: true,
          useExtendedSearch: true
        });

        var fuseHits = tempFuse.search(searchText);

        // Only include fuzzy results that aren't already exact matches
        // and have a reasonable score (< 0.25 to avoid false positives like g04 for g05)
        for (var j = 0; j < fuseHits.length; j++) {
          if (!exactSet[fuseHits[j].item.url] && (fuseHits[j].score || 0) < 0.25) {
            fuzzyResults.push(fuseHits[j].item);
          }
        }
      }

      // Combine: exact matches first, then fuzzy
      results = exactMatches.concat(fuzzyResults);
    }

    return results;
  }

  /**
   * Highlight matched text by wrapping in <mark> tags.
   * All text segments (highlighted and non-highlighted) are HTML-escaped.
   */
  function highlight(text, matches) {
    if (!matches || !matches.length || !text) return GWR.Utils.escapeHtml(text);

    var str = String(text);
    var pairs = [];
    var i, j, m;

    for (i = 0; i < matches.length; i++) {
      m = matches[i];
      if (m.indices) {
        for (j = 0; j < m.indices.length; j++) {
          pairs.push(m.indices[j]);
        }
      }
    }

    if (!pairs.length) return GWR.Utils.escapeHtml(str);

    // Sort pairs by start index ascending
    pairs.sort(function (a, b) { return a[0] - b[0]; });

    // Merge overlapping ranges
    var merged = [pairs[0]];
    for (i = 1; i < pairs.length; i++) {
      var last = merged[merged.length - 1];
      if (pairs[i][0] <= last[1] + 1) {
        merged[merged.length - 1] = [last[0], Math.max(pairs[i][1], last[1])];
      } else {
        merged.push(pairs[i]);
      }
    }

    // Build result by escaping all segments
    var result = '';
    var cursor = 0;
    for (i = 0; i < merged.length; i++) {
      var start = merged[i][0];
      var end = merged[i][1] + 1;
      // Escape the non-highlighted segment before this match
      result += GWR.Utils.escapeHtml(str.substring(cursor, start));
      // Escape the highlighted segment and wrap in <mark>
      result += '<mark>' + GWR.Utils.escapeHtml(str.substring(start, end)) + '</mark>';
      cursor = end;
    }
    // Escape any remaining text after the last match
    result += GWR.Utils.escapeHtml(str.substring(cursor));

    return result;
  }

  GWR.SearchEngine = {
    init: init,
    search: search,
    highlight: highlight
  };

})();
