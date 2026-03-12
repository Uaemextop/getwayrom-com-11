/**
 * GetwayROM File Explorer - Advanced Search Engine
 * Uses Fuse.js for fuzzy search with support for advanced filter operators.
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
      keys: ['name', 'brand', 'extension'],
      threshold: 0.3,
      distance: 100,
      minMatchCharLength: 2,
      includeScore: true,
      includeMatches: true,
      useExtendedSearch: true
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
   * Perform search with advanced operator support.
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

    // Apply fuzzy text search via Fuse.js
    if (parsed.text && fuseInstance) {
      // Build a temporary Fuse instance scoped to the filtered set
      var tempFuse = new Fuse(results, {
        keys: ['name', 'brand', 'extension'],
        threshold: 0.3,
        distance: 100,
        minMatchCharLength: 2,
        includeScore: true,
        includeMatches: true,
        useExtendedSearch: true
      });

      var fuseResults = tempFuse.search(parsed.text);

      // Sort by score (lower is better) and return file objects
      fuseResults.sort(function (a, b) {
        return (a.score || 0) - (b.score || 0);
      });

      results = fuseResults.map(function (r) {
        return r.item;
      });
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
