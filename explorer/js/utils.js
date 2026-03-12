/**
 * GetwayROM File Explorer - Utility Functions
 */
(function () {
  'use strict';

  /**
   * Standard debounce: delays invoking fn until after delay ms have elapsed
   * since the last invocation.
   */
  function debounce(fn, delay) {
    var timer;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  /**
   * Standard throttle: ensures fn is called at most once every limit ms.
   */
  function throttle(fn, limit) {
    var inThrottle = false;
    return function () {
      var context = this;
      var args = arguments;
      if (!inThrottle) {
        fn.apply(context, args);
        inThrottle = true;
        setTimeout(function () {
          inThrottle = false;
        }, limit);
      }
    };
  }

  /**
   * Format a number with locale-appropriate commas (e.g. 1,234).
   */
  function formatNumber(n) {
    if (n == null) return '0';
    return Number(n).toLocaleString();
  }

  /**
   * Escape HTML special characters to prevent XSS.
   */
  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Return a Font Awesome icon class based on file type.
   */
  function getFileIcon(fileType) {
    var icons = {
      archive: 'fa-file-zipper',
      android: 'fa-android',
      image: 'fa-hard-drive',
      disk: 'fa-compact-disc',
      executable: 'fa-cog',
      binary: 'fa-microchip',
      document: 'fa-file-lines'
    };
    return icons[fileType] || 'fa-file';
  }

  /**
   * Return a CSS class string for icon color based on file type.
   */
  function getFileIconClass(fileType) {
    var classes = {
      archive: 'archive',
      android: 'android',
      image: 'image',
      disk: 'disk',
      executable: 'executable',
      binary: 'binary',
      document: 'document'
    };
    return classes[fileType] || 'file';
  }

  /**
   * Truncate text to maxLen characters, appending ellipsis if truncated.
   */
  function truncateText(text, maxLen) {
    if (!text) return '';
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen) + '\u2026';
  }

  /**
   * Copy text to clipboard using the navigator.clipboard API.
   */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for older browsers
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      // silently fail
    }
    document.body.removeChild(textarea);
  }

  /**
   * Generate a random ID string.
   */
  function generateId() {
    return 'gwr-' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  }

  GWR.Utils = {
    debounce: debounce,
    throttle: throttle,
    formatNumber: formatNumber,
    escapeHtml: escapeHtml,
    getFileIcon: getFileIcon,
    getFileIconClass: getFileIconClass,
    truncateText: truncateText,
    copyToClipboard: copyToClipboard,
    generateId: generateId
  };

})();
