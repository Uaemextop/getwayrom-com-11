/**
 * GetwayROM File Explorer - Utility Functions
 * Common helpers used across modules
 */

var GWR = window.GWR || {};

GWR.Utils = (function () {
  'use strict';

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function formatNumber(n) {
    if (n >= 1000) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return n.toString();
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024;
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function debounce(fn, delay) {
    var timeout;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  function throttle(fn, limit) {
    var lastCall = 0;
    return function () {
      var now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        fn.apply(this, arguments);
      }
    };
  }

  function getTimeAgo(dateString) {
    var date = new Date(dateString);
    var now = new Date();
    var diffMs = now - date;
    var diffMins = Math.floor(diffMs / 60000);
    var diffHours = Math.floor(diffMs / 3600000);
    var diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return diffMins + 'm ago';
    if (diffHours < 24) return diffHours + 'h ago';
    if (diffDays < 30) return diffDays + 'd ago';
    return date.toLocaleDateString();
  }

  function generateId() {
    return 'gwr_' + Math.random().toString(36).substring(2, 9);
  }

  return {
    escapeHtml: escapeHtml,
    escapeAttr: escapeAttr,
    formatNumber: formatNumber,
    formatBytes: formatBytes,
    debounce: debounce,
    throttle: throttle,
    getTimeAgo: getTimeAgo,
    generateId: generateId
  };
})();

window.GWR = GWR;
