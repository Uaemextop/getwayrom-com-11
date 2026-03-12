/**
 * GetwayROM File Explorer - Search Engine Module
 * Fuzzy search with Fuse.js + advanced query parser
 */

var GWR = window.GWR || {};

GWR.SearchEngine = (function () {
  'use strict';

  var fuse = null;

  function init(files) {
    if (typeof Fuse !== 'undefined') {
      fuse = new Fuse(files, {
        keys: [
          { name: 'name', weight: 0.7 },
          { name: 'brand', weight: 0.2 },
          { name: 'extension', weight: 0.1 }
        ],
        threshold: 0.3,
        distance: 100,
        minMatchCharLength: 2,
        includeScore: true,
        includeMatches: true,
        findAllMatches: true,
        ignoreLocation: false
      });
    }
  }

  /**
   * Parse advanced search query into tokens:
   *   brand:Samsung   → filter by brand
   *   ext:zip         → filter by extension
   *   "exact phrase"  → exact match
   *   -keyword        → exclude keyword
   *   regular text    → fuzzy/contains search
   */
  function parseQuery(queryStr) {
    var tokens = [];
    var regex = /(".*?"|[\S]+)/g;
    var match;
    while ((match = regex.exec(queryStr)) !== null) {
      tokens.push(match[1]);
    }

    var result = {
      positiveTerms: [],
      negativeTerms: [],
      brandFilter: '',
      extFilter: '',
      typeFilter: '',
      isAdvanced: false
    };

    tokens.forEach(function (token) {
      if (token.indexOf('brand:') === 0) {
        result.brandFilter = token.substring(6).toLowerCase();
        result.isAdvanced = true;
      } else if (token.indexOf('ext:') === 0) {
        result.extFilter = token.substring(4).toLowerCase().replace(/^\./, '');
        result.isAdvanced = true;
      } else if (token.indexOf('type:') === 0) {
        result.typeFilter = token.substring(5).toLowerCase();
        result.isAdvanced = true;
      } else if (token.charAt(0) === '-' && token.length > 1) {
        result.negativeTerms.push(token.substring(1).toLowerCase().replace(/"/g, ''));
        result.isAdvanced = true;
      } else {
        result.positiveTerms.push(token.toLowerCase().replace(/"/g, ''));
      }
    });

    return result;
  }

  function search(files, query) {
    if (!query || !query.trim()) return files;

    query = query.trim();

    // Check if query uses advanced syntax
    if (query.indexOf(':') !== -1 || query.indexOf('"') !== -1 || query.indexOf('-') === 0) {
      return advancedSearch(files, query);
    }

    // Fuzzy search with Fuse.js for queries >= 2 chars
    if (fuse && query.length >= 2) {
      return fuzzySearch(files, query);
    }

    // Simple contains search for short queries
    return simpleSearch(files, query);
  }

  function fuzzySearch(files, query) {
    var results = fuse.search(query);
    var matchedUrls = new Set();
    results.forEach(function (r) { matchedUrls.add(r.item.url); });

    var filtered = files.filter(function (f) { return matchedUrls.has(f.url); });

    // Sort by relevance (match score)
    var urlOrder = {};
    results.forEach(function (r, i) { urlOrder[r.item.url] = i; });
    filtered.sort(function (a, b) {
      var aIdx = urlOrder[a.url] !== undefined ? urlOrder[a.url] : 99999;
      var bIdx = urlOrder[b.url] !== undefined ? urlOrder[b.url] : 99999;
      return aIdx - bIdx;
    });

    return filtered;
  }

  function simpleSearch(files, query) {
    var lowerQuery = query.toLowerCase();
    return files.filter(function (f) {
      return f.name.toLowerCase().indexOf(lowerQuery) !== -1;
    });
  }

  function advancedSearch(files, queryStr) {
    var parsed = parseQuery(queryStr);

    return files.filter(function (f) {
      var nameLower = f.name.toLowerCase();

      if (parsed.brandFilter && f.brand.toLowerCase() !== parsed.brandFilter) return false;
      if (parsed.extFilter && f.extension.toLowerCase() !== parsed.extFilter) return false;
      if (parsed.typeFilter && f.fileType.toLowerCase() !== parsed.typeFilter) return false;

      for (var i = 0; i < parsed.negativeTerms.length; i++) {
        if (nameLower.indexOf(parsed.negativeTerms[i]) !== -1) return false;
      }

      for (var j = 0; j < parsed.positiveTerms.length; j++) {
        if (nameLower.indexOf(parsed.positiveTerms[j]) === -1) return false;
      }

      return true;
    });
  }

  function getSuggestions(files, query, limit) {
    limit = limit || 8;
    if (!query || query.length < 2) return [];
    if (!fuse) return [];

    var results = fuse.search(query, { limit: limit });
    return results.map(function (r) {
      return { name: r.item.name, score: r.score, brand: r.item.brand };
    });
  }

  return {
    init: init,
    search: search,
    parseQuery: parseQuery,
    getSuggestions: getSuggestions
  };
})();

window.GWR = GWR;
