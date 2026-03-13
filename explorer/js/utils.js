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
      android: 'fa-robot',
      firmware: 'fa-microchip',
      image: 'fa-hard-drive',
      disk: 'fa-compact-disc',
      executable: 'fa-gears',
      binary: 'fa-microchip',
      document: 'fa-file-lines',
      scatter: 'fa-sitemap',
      config: 'fa-sliders',
      flash: 'fa-bolt'
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
      firmware: 'firmware',
      image: 'image',
      disk: 'disk',
      executable: 'executable',
      binary: 'binary',
      document: 'document',
      scatter: 'scatter',
      config: 'config',
      flash: 'flash'
    };
    return classes[fileType] || 'file';
  }

  /**
   * Return a brand-specific icon class.
   */
  function getBrandIcon(brand) {
    var icons = {
      Samsung: 'fa-mobile-screen',
      Xiaomi: 'fa-mobile-retro',
      Huawei: 'fa-mobile-screen-button',
      Honor: 'fa-mobile-screen-button',
      OnePlus: 'fa-mobile',
      Google: 'fa-mobile-screen',
      Motorola: 'fa-mobile',
      Sony: 'fa-mobile-screen-button',
      LG: 'fa-mobile',
      Nokia: 'fa-mobile-screen',
      OPPO: 'fa-mobile',
      Vivo: 'fa-mobile',
      Realme: 'fa-mobile',
      ASUS: 'fa-mobile-screen',
      HTC: 'fa-mobile',
      Lenovo: 'fa-tablet-screen-button',
      ZTE: 'fa-mobile',
      Alcatel: 'fa-mobile',
      Tecno: 'fa-mobile',
      Infinix: 'fa-mobile',
      Itel: 'fa-mobile',
      Other: 'fa-microchip'
    };
    return icons[brand] || 'fa-mobile';
  }

  /**
   * Return a brand color CSS class.
   */
  function getBrandColorClass(brand) {
    var colors = {
      Samsung: 'brand-samsung',
      Xiaomi: 'brand-xiaomi',
      Huawei: 'brand-huawei',
      Honor: 'brand-honor',
      Realme: 'brand-realme',
      OPPO: 'brand-oppo',
      Vivo: 'brand-vivo',
      Motorola: 'brand-motorola',
      OnePlus: 'brand-oneplus',
      Nokia: 'brand-nokia',
      LG: 'brand-lg',
      Google: 'brand-google'
    };
    return colors[brand] || 'brand-other';
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

  /**
   * Return a source-specific icon class (includes prefix).
   */
  function getSourceIcon(source) {
    var icons = {
      'Google Drive': 'fab fa-google-drive',
      'MediaFire': 'fas fa-fire',
      'OneDrive': 'fab fa-microsoft',
      'MEGA': 'fas fa-cloud-arrow-down',
      'Dropbox': 'fab fa-dropbox',
      'GitHub': 'fab fa-github',
      'AFH': 'fab fa-android',
      'Direct': 'fas fa-link'
    };
    return icons[source] || 'fas fa-link';
  }

  /**
   * Return a source color CSS class.
   */
  function getSourceColorClass(source) {
    var colors = {
      'Google Drive': 'source-gdrive',
      'MediaFire': 'source-mediafire',
      'OneDrive': 'source-onedrive',
      'MEGA': 'source-mega',
      'Dropbox': 'source-dropbox',
      'GitHub': 'source-github',
      'AFH': 'source-afh',
      'Direct': 'source-direct'
    };
    return colors[source] || 'source-direct';
  }

  /**
   * Detect source from URL (for in-browser fallback parsing).
   */
  function detectSource(url) {
    if (/drive\.google\.com|drive\.usercontent\.google\.com/i.test(url)) return 'Google Drive';
    if (/mediafire\.com/i.test(url)) return 'MediaFire';
    if (/onedrive\.live\.com|1drv\.ms/i.test(url)) return 'OneDrive';
    if (/mega\.nz|mega\.co\.nz/i.test(url)) return 'MEGA';
    if (/dropbox\.com/i.test(url)) return 'Dropbox';
    if (/github\.com|githubusercontent\.com/i.test(url)) return 'GitHub';
    if (/androidfilehost\.com/i.test(url)) return 'AFH';
    return 'Direct';
  }

  GWR.Utils = {
    debounce: debounce,
    throttle: throttle,
    formatNumber: formatNumber,
    escapeHtml: escapeHtml,
    getFileIcon: getFileIcon,
    getFileIconClass: getFileIconClass,
    getBrandIcon: getBrandIcon,
    getBrandColorClass: getBrandColorClass,
    getSourceIcon: getSourceIcon,
    getSourceColorClass: getSourceColorClass,
    detectSource: detectSource,
    truncateText: truncateText,
    copyToClipboard: copyToClipboard,
    generateId: generateId
  };

})();
