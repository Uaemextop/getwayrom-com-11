/**
 * GetwayROM File Explorer - Sidebar Management Module
 */
(function () {
  'use strict';

  var Utils = GWR.Utils;
  var overlayEl = null;

  // Brand-specific icons
  var brandIcons = {
    Samsung: 'fa-mobile-screen',
    Xiaomi: 'fa-mobile',
    Huawei: 'fa-mobile-screen-button',
    OnePlus: 'fa-mobile',
    Google: 'fa-mobile-screen',
    Motorola: 'fa-mobile',
    Sony: 'fa-mobile-screen-button',
    LG: 'fa-mobile',
    Nokia: 'fa-mobile-screen',
    Oppo: 'fa-mobile',
    Vivo: 'fa-mobile',
    Realme: 'fa-mobile'
  };

  function getBrandIcon(brand) {
    return brandIcons[brand] || 'fa-mobile';
  }

  /**
   * Create or return the overlay element for mobile sidebar.
   */
  function getOverlay() {
    if (!overlayEl) {
      overlayEl = document.createElement('div');
      overlayEl.className = 'sidebar-overlay';
      overlayEl.addEventListener('click', function () {
        var sidebar = document.getElementById('sidebar');
        if (sidebar) {
          close(sidebar);
        }
      });
      document.body.appendChild(overlayEl);
    }
    return overlayEl;
  }

  /**
   * Initialize sidebar with options.
   */
  function init() {
    // Reserved for future configuration
  }

  /**
   * Populate brand list in sidebar.
   */
  function populateBrands(container, brands) {
    if (!container || !brands) return;

    var html = '<div class="sidebar-item active" data-filter="all">' +
      '<i class="fas fa-list"></i>' +
      '<span>All Files</span>' +
    '</div>';

    var brandNames = Object.keys(brands).sort();
    for (var i = 0; i < brandNames.length; i++) {
      var brand = brandNames[i];
      var count = brands[brand];
      var icon = getBrandIcon(brand);
      html += '<div class="sidebar-item" data-filter="brand:' + Utils.escapeHtml(brand) + '">' +
        '<i class="fas ' + icon + '"></i>' +
        '<span>' + Utils.escapeHtml(brand) + '</span>' +
        '<span class="sidebar-count">' + Utils.escapeHtml(String(count)) + '</span>' +
      '</div>';
    }

    container.innerHTML = html;
  }

  /**
   * Populate extension list in sidebar.
   */
  function populateExtensions(container, extensions) {
    if (!container || !extensions) return;

    var html = '';
    var extNames = Object.keys(extensions).sort();
    for (var i = 0; i < extNames.length; i++) {
      var ext = extNames[i];
      var count = extensions[ext];
      html += '<div class="sidebar-item" data-filter="ext:' + Utils.escapeHtml(ext) + '">' +
        '<i class="fas fa-file"></i>' +
        '<span>.' + Utils.escapeHtml(ext) + '</span>' +
        '<span class="sidebar-count">' + Utils.escapeHtml(String(count)) + '</span>' +
      '</div>';
    }

    container.innerHTML = html;
  }

  /**
   * Toggle sidebar open/collapsed.
   */
  function toggle(sidebarEl) {
    if (!sidebarEl) return;
    if (sidebarEl.classList.contains('open')) {
      close(sidebarEl);
    } else {
      open(sidebarEl);
    }
  }

  /**
   * Open the sidebar.
   */
  function open(sidebarEl) {
    if (!sidebarEl) return;
    sidebarEl.classList.add('open');
    getOverlay().classList.add('active');
  }

  /**
   * Close the sidebar and remove overlay.
   */
  function close(sidebarEl) {
    if (!sidebarEl) return;
    sidebarEl.classList.remove('open');
    var overlay = getOverlay();
    overlay.classList.remove('active');
  }

  /**
   * Set active state on the sidebar item matching the given filter.
   */
  function setActiveItem(filter) {
    var items = document.querySelectorAll('.sidebar-item[data-filter]');
    for (var i = 0; i < items.length; i++) {
      var itemFilter = items[i].getAttribute('data-filter');
      if (itemFilter === filter) {
        items[i].classList.add('active');
      } else {
        items[i].classList.remove('active');
      }
    }
  }

  GWR.Sidebar = {
    init: init,
    populateBrands: populateBrands,
    populateExtensions: populateExtensions,
    toggle: toggle,
    open: open,
    close: close,
    setActiveItem: setActiveItem
  };

})();
