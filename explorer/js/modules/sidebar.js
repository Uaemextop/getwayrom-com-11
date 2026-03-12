/**
 * GetwayROM File Explorer - Sidebar Module
 * Manages sidebar state, navigation, and brand/extension lists
 */

var GWR = window.GWR || {};

GWR.Sidebar = (function () {
  'use strict';

  var Utils = GWR.Utils;
  var isOpen = false;
  var onFilterChange = null;

  var BRAND_ICONS = {
    Samsung: 'fas fa-mobile-alt',
    Xiaomi: 'fas fa-mobile-alt',
    OPPO: 'fas fa-mobile-alt',
    Realme: 'fas fa-mobile-alt',
    Vivo: 'fas fa-mobile-alt',
    Huawei: 'fas fa-mobile-alt',
    Honor: 'fas fa-mobile-alt',
    Nokia: 'fas fa-mobile-alt',
    LG: 'fas fa-tv',
    Motorola: 'fas fa-mobile-alt',
    Sony: 'fas fa-mobile-alt',
    Lenovo: 'fas fa-laptop',
    OnePlus: 'fas fa-mobile-alt',
    ASUS: 'fas fa-laptop',
    Tecno: 'fas fa-mobile-alt',
    Infinix: 'fas fa-mobile-alt',
    Itel: 'fas fa-mobile-alt',
    Jio: 'fas fa-mobile-alt',
    Other: 'fas fa-folder'
  };

  function init(options) {
    onFilterChange = options.onFilterChange || function () {};
  }

  function populateBrands(container, brands) {
    var sorted = Object.entries(brands).sort(function (a, b) { return b[1] - a[1]; });
    var html = '';
    sorted.forEach(function (entry) {
      var brand = entry[0];
      var count = entry[1];
      var icon = BRAND_ICONS[brand] || 'fas fa-folder';
      html += '<button class="sidebar-item" data-filter="brand:' + Utils.escapeHtml(brand) + '">' +
        '<i class="' + icon + '"></i>' +
        '<span>' + Utils.escapeHtml(brand) + '</span>' +
        '<span class="badge">' + Utils.formatNumber(count) + '</span>' +
        '</button>';
    });
    container.innerHTML = html;
  }

  function populateExtensions(container, extensions, limit) {
    limit = limit || 15;
    var sorted = Object.entries(extensions).sort(function (a, b) { return b[1] - a[1]; }).slice(0, limit);
    var html = '';
    sorted.forEach(function (entry) {
      var ext = entry[0];
      var count = entry[1];
      html += '<button class="sidebar-item" data-filter="ext:' + Utils.escapeHtml(ext) + '">' +
        '<i class="fas fa-file"></i>' +
        '<span>.' + Utils.escapeHtml(ext) + '</span>' +
        '<span class="badge">' + Utils.formatNumber(count) + '</span>' +
        '</button>';
    });
    container.innerHTML = html;
  }

  function toggle(sidebarEl) {
    if (window.innerWidth <= 1024) {
      isOpen = !isOpen;
      sidebarEl.classList.toggle('open', isOpen);
      toggleOverlay(isOpen, sidebarEl);
    } else {
      sidebarEl.classList.toggle('collapsed');
    }
  }

  function close(sidebarEl) {
    isOpen = false;
    sidebarEl.classList.remove('open');
    toggleOverlay(false, sidebarEl);
  }

  function toggleOverlay(show, sidebarEl) {
    var overlay = document.querySelector('.sidebar-overlay');
    if (!overlay && show) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay active';
      overlay.addEventListener('click', function () {
        close(sidebarEl);
      });
      document.body.appendChild(overlay);
    } else if (overlay) {
      overlay.classList.toggle('active', show);
    }
  }

  function setActiveItem(filter) {
    document.querySelectorAll('.sidebar-item').forEach(function (el) {
      el.classList.remove('active');
    });
    var target = document.querySelector('.sidebar-item[data-filter="' + filter + '"]');
    if (target) target.classList.add('active');
  }

  return {
    init: init,
    populateBrands: populateBrands,
    populateExtensions: populateExtensions,
    toggle: toggle,
    close: close,
    setActiveItem: setActiveItem,
    BRAND_ICONS: BRAND_ICONS
  };
})();

window.GWR = GWR;
