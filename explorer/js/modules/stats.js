/**
 * GetwayROM File Explorer - Stats Module
 * Generates statistics and charts from file data
 */

var GWR = window.GWR || {};

GWR.Stats = (function () {
  'use strict';

  function calculate(files, metadata) {
    var brandCounts = {};
    var extensionCounts = {};
    var typeCounts = {};

    files.forEach(function (f) {
      brandCounts[f.brand] = (brandCounts[f.brand] || 0) + 1;
      extensionCounts[f.extension] = (extensionCounts[f.extension] || 0) + 1;
      typeCounts[f.fileType] = (typeCounts[f.fileType] || 0) + 1;
    });

    var topBrands = Object.entries(brandCounts)
      .sort(function (a, b) { return b[1] - a[1]; })
      .slice(0, 10);

    var topExtensions = Object.entries(extensionCounts)
      .sort(function (a, b) { return b[1] - a[1]; })
      .slice(0, 10);

    return {
      totalFiles: files.length,
      uniqueBrands: Object.keys(brandCounts).length,
      uniqueExtensions: Object.keys(extensionCounts).length,
      topBrands: topBrands,
      topExtensions: topExtensions,
      typeCounts: typeCounts,
      generated: metadata ? metadata.generated : null
    };
  }

  function renderBarChart(items, maxWidth) {
    maxWidth = maxWidth || 200;
    var max = items.length > 0 ? items[0][1] : 1;
    var html = '<div class="stats-chart">';

    items.forEach(function (entry) {
      var label = entry[0];
      var count = entry[1];
      var width = Math.max(4, Math.round((count / max) * maxWidth));
      var pct = ((count / max) * 100).toFixed(0);

      html += '<div class="stats-row">' +
        '<span class="stats-label">' + label + '</span>' +
        '<div class="stats-bar-container">' +
        '<div class="stats-bar" style="width:' + pct + '%"></div>' +
        '</div>' +
        '<span class="stats-count">' + GWR.Utils.formatNumber(count) + '</span>' +
        '</div>';
    });

    html += '</div>';
    return html;
  }

  return {
    calculate: calculate,
    renderBarChart: renderBarChart
  };
})();

window.GWR = GWR;
