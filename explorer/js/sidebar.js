/**
 * GetwayROM File Explorer - Sidebar Management Module
 * Enhanced with collapsible sections, search filtering, and smooth animations.
 */
(function () {
  'use strict';

  var Utils = GWR.Utils;
  var overlayEl = null;

  function isMobileViewport() {
    return window.innerWidth <= 1024;
  }

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
    OPPO: 'fa-mobile',
    Vivo: 'fa-mobile',
    Realme: 'fa-mobile',
    Honor: 'fa-award',
    Tecno: 'fa-mobile',
    Infinix: 'fa-mobile',
    ASUS: 'fa-laptop',
    Lenovo: 'fa-tablet-screen-button',
    ZTE: 'fa-mobile',
    HTC: 'fa-mobile'
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
    window.addEventListener('resize', function () {
      var sidebar = document.getElementById('sidebar');
      if (!sidebar) return;

      if (isMobileViewport()) {
        sidebar.classList.remove('collapsed');
      } else {
        sidebar.classList.remove('open');
        getOverlay().classList.remove('active');
      }
    });
  }

  /**
   * Filter sidebar items based on search text.
   */
  function filterSidebarItems(searchText) {
    var items = document.querySelectorAll('.sidebar-scroll .sidebar-item');
    var query = searchText.toLowerCase().trim();

    for (var i = 0; i < items.length; i++) {
      var text = items[i].textContent.toLowerCase();
      if (!query || text.indexOf(query) !== -1) {
        items[i].style.display = '';
      } else {
        items[i].style.display = 'none';
      }
    }
  }

  /**
   * Populate brand list in sidebar.
   */
  function populateBrands(container, brands) {
    if (!container || !brands) return;

    var html = '';
    var brandNames = Object.keys(brands).sort();
    for (var i = 0; i < brandNames.length; i++) {
      var brand = brandNames[i];
      var count = brands[brand];
      var icon = getBrandIcon(brand);
      html += '<div class="sidebar-item" data-filter="brand:' + Utils.escapeHtml(brand) + '">' +
        '<i class="fas ' + icon + '"></i>' +
        '<span>' + Utils.escapeHtml(brand) + '</span>' +
        '<span class="sidebar-count">' + Utils.formatNumber(count) + '</span>' +
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
        '<span class="sidebar-count">' + Utils.formatNumber(count) + '</span>' +
      '</div>';
    }

    container.innerHTML = html;
  }

  /**
   * Toggle sidebar open/collapsed.
   */
  function toggle(sidebarEl) {
    if (!sidebarEl) return;
    var isOpen = isMobileViewport()
      ? sidebarEl.classList.contains('open')
      : !sidebarEl.classList.contains('collapsed');

    if (isOpen) {
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
    sidebarEl.classList.remove('collapsed');

    if (isMobileViewport()) {
      sidebarEl.classList.add('open');
      getOverlay().classList.add('active');
    } else {
      sidebarEl.classList.remove('open');
      getOverlay().classList.remove('active');
    }
  }

  /**
   * Close the sidebar and remove overlay.
   */
  function close(sidebarEl) {
    if (!sidebarEl) return;
    if (isMobileViewport()) {
      sidebarEl.classList.remove('open');
    } else {
      sidebarEl.classList.add('collapsed');
    }
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

  /**
   * Toggle collapsible sidebar section.
   */
  function toggleSection(headingEl) {
    var section = headingEl.closest('.sidebar-section');
    if (!section) return;
    var scrollContent = section.querySelector('.sidebar-scroll');
    if (!scrollContent) return;

    var isCollapsed = section.classList.contains('collapsed');
    section.classList.toggle('collapsed');
    headingEl.querySelector('.sidebar-heading-icon').classList.toggle('rotated', isCollapsed);
  }

  GWR.Sidebar = {
    init: init,
    populateBrands: populateBrands,
    populateExtensions: populateExtensions,
    toggle: toggle,
    open: open,
    close: close,
    setActiveItem: setActiveItem,
    toggleSection: toggleSection,
    filterSidebarItems: filterSidebarItems
  };

})();
