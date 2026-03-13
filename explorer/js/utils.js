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
      flash: 'fa-bolt',
      checksum: 'fa-hashtag',
      media: 'fa-photo-film'
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
      flash: 'flash',
      checksum: 'checksum',
      media: 'media'
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
   * Return a short brand initial/abbreviation for visual identity.
   */
  function getBrandInitial(brand) {
    var initials = {
      Samsung: 'S',
      Xiaomi: 'Xi',
      Huawei: 'Hw',
      Honor: 'Hr',
      OnePlus: '1+',
      Google: 'G',
      Motorola: 'M',
      Sony: 'Sy',
      LG: 'LG',
      Nokia: 'N',
      OPPO: 'O',
      Vivo: 'V',
      Realme: 'R',
      ASUS: 'A',
      HTC: 'H',
      Lenovo: 'Le',
      ZTE: 'Z',
      Alcatel: 'Al',
      Tecno: 'Tc',
      Infinix: 'Ix',
      Itel: 'It',
      Jio: 'Ji',
      Other: '?'
    };
    return initials[brand] || (brand ? brand.charAt(0) : '?');
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
      Google: 'brand-google',
      Sony: 'brand-sony',
      ASUS: 'brand-asus',
      HTC: 'brand-htc',
      Lenovo: 'brand-lenovo',
      ZTE: 'brand-zte',
      Alcatel: 'brand-alcatel',
      Tecno: 'brand-tecno',
      Infinix: 'brand-infinix',
      Itel: 'brand-itel',
      Jio: 'brand-jio'
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

  /**
   * Return a human-readable label for a category.
   */
  function getCategoryLabel(category) {
    var labels = {
      firmware: 'Firmware',
      frp: 'FRP Bypass',
      unlock: 'Unlock',
      repair: 'Repair',
      dump: 'Dump',
      nvdata: 'NV Data',
      emmc: 'eMMC/RPMB',
      recovery: 'Recovery',
      scatter: 'Scatter',
      flash_tool: 'Flash Tool',
      flash_file: 'Flash File',
      driver: 'Driver',
      root: 'Root',
      combination: 'Combination',
      imei: 'IMEI',
      modem: 'Modem',
      bootloader: 'Bootloader',
      security: 'Security',
      preloader: 'Preloader',
      upgrade: 'Update/OTA',
      downgrade: 'Downgrade',
      backup: 'Backup',
      custom_rom: 'Custom ROM',
      da_file: 'DA File'
    };
    return labels[category] || category;
  }

  /**
   * Return a Font Awesome icon for a category.
   */
  function getCategoryIcon(category) {
    var icons = {
      firmware: 'fa-microchip',
      frp: 'fa-shield-halved',
      unlock: 'fa-lock-open',
      repair: 'fa-wrench',
      dump: 'fa-download',
      nvdata: 'fa-database',
      emmc: 'fa-memory',
      recovery: 'fa-life-ring',
      scatter: 'fa-sitemap',
      flash_tool: 'fa-toolbox',
      flash_file: 'fa-bolt',
      driver: 'fa-plug',
      root: 'fa-user-shield',
      combination: 'fa-puzzle-piece',
      imei: 'fa-fingerprint',
      modem: 'fa-signal',
      bootloader: 'fa-power-off',
      security: 'fa-shield',
      preloader: 'fa-play',
      upgrade: 'fa-arrow-up',
      downgrade: 'fa-arrow-down',
      backup: 'fa-box-archive',
      custom_rom: 'fa-wand-magic-sparkles',
      da_file: 'fa-key'
    };
    return icons[category] || 'fa-file';
  }

  /**
   * Return a CSS color class for a category.
   */
  function getCategoryColorClass(category) {
    var classes = {
      firmware: 'cat-firmware',
      frp: 'cat-frp',
      unlock: 'cat-unlock',
      repair: 'cat-repair',
      dump: 'cat-dump',
      nvdata: 'cat-nvdata',
      emmc: 'cat-emmc',
      recovery: 'cat-recovery',
      scatter: 'cat-scatter',
      flash_tool: 'cat-flash-tool',
      flash_file: 'cat-flash-file',
      driver: 'cat-driver',
      root: 'cat-root',
      combination: 'cat-combination',
      imei: 'cat-imei',
      modem: 'cat-modem',
      bootloader: 'cat-bootloader',
      security: 'cat-security',
      preloader: 'cat-preloader',
      upgrade: 'cat-upgrade',
      downgrade: 'cat-downgrade',
      backup: 'cat-backup',
      custom_rom: 'cat-custom-rom'
    };
    return classes[category] || 'cat-other';
  }

  GWR.Utils = {
    debounce: debounce,
    throttle: throttle,
    formatNumber: formatNumber,
    escapeHtml: escapeHtml,
    getFileIcon: getFileIcon,
    getFileIconClass: getFileIconClass,
    getBrandIcon: getBrandIcon,
    getBrandInitial: getBrandInitial,
    getBrandColorClass: getBrandColorClass,
    getSourceIcon: getSourceIcon,
    getSourceColorClass: getSourceColorClass,
    detectSource: detectSource,
    truncateText: truncateText,
    copyToClipboard: copyToClipboard,
    generateId: generateId,
    getCategoryLabel: getCategoryLabel,
    getCategoryIcon: getCategoryIcon,
    getCategoryColorClass: getCategoryColorClass
  };

})();
