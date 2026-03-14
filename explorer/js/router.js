/**
 * GetwayROM File Explorer - Router Module
 * Handles folder navigation, breadcrumb rendering, and URL hash routing.
 * Syncs folder path with the URL hash for shareable links.
 */
(function () {
  'use strict';

  var Utils = GWR.Utils;
  var Store = GWR.Store;
  var EventBus = GWR.EventBus;

  /**
   * Parse the current URL hash into a folder path array.
   * Hash format: #/Brand/SubFolder
   * @returns {string[]}
   */
  function parseHash() {
    var hash = window.location.hash || '';
    if (hash.indexOf('#/') !== 0) return [];
    var path = hash.substring(2);
    if (!path) return [];
    return path.split('/').filter(function (seg) {
      return seg.length > 0;
    }).map(decodeURIComponent);
  }

  /**
   * Update the URL hash to reflect the current folder path.
   * @param {string[]} folderPath
   */
  function updateHash(folderPath) {
    if (!folderPath || folderPath.length === 0) {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } else {
      var hash = '#/' + folderPath.map(encodeURIComponent).join('/');
      history.replaceState(null, '', hash);
    }
  }

  /**
   * Navigate into a folder by name.
   * @param {string} folderName
   */
  function navigateTo(folderName) {
    var current = Store.get('folderPath').slice();
    current.push(folderName);
    Store.set({ folderPath: current, currentPage: 1 });
    updateHash(current);
    EventBus.emit('navigate', { path: current });
  }

  /**
   * Navigate up one folder level.
   */
  function navigateUp() {
    var current = Store.get('folderPath').slice();
    if (current.length > 0) {
      current.pop();
      Store.set({ folderPath: current, currentPage: 1 });
      updateHash(current);
      EventBus.emit('navigate', { path: current });
    }
  }

  /**
   * Navigate to a specific path (array or slash-separated string).
   * @param {string|string[]} path
   */
  function navigateToPath(path) {
    var pathArr;
    if (typeof path === 'string') {
      pathArr = path === '' ? [] : path.split('/');
    } else {
      pathArr = path || [];
    }
    Store.set({ folderPath: pathArr, currentPage: 1 });
    updateHash(pathArr);
    EventBus.emit('navigate', { path: pathArr });
  }

  /**
   * Navigate to root.
   */
  function navigateToRoot() {
    navigateToPath([]);
  }

  /**
   * Render the breadcrumb HTML into a container element.
   * @param {HTMLElement} container
   */
  function renderBreadcrumb(container) {
    if (!container) return;
    var folderPath = Store.get('folderPath');
    var html = '<span class="breadcrumb-item breadcrumb-link" data-path=""><i class="fas fa-home"></i> Root</span>';

    for (var i = 0; i < folderPath.length; i++) {
      html += '<span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>';
      var pathUpTo = folderPath.slice(0, i + 1).join('/');
      var isLast = (i === folderPath.length - 1);
      html += '<span class="breadcrumb-item' + (isLast ? ' active' : ' breadcrumb-link') + '" data-path="' + Utils.escapeHtml(pathUpTo) + '">' +
        '<i class="fas ' + (isLast ? 'fa-folder-open' : 'fa-folder') + '"></i> ' +
        Utils.escapeHtml(folderPath[i]) +
      '</span>';
    }

    container.innerHTML = html;

    // Bind click events on breadcrumb links
    var links = container.querySelectorAll('.breadcrumb-link');
    for (var j = 0; j < links.length; j++) {
      links[j].addEventListener('click', function () {
        var pathStr = this.getAttribute('data-path');
        navigateToPath(pathStr);
      });
    }
  }

  /**
   * Initialize router: read hash on load, listen for hash changes.
   */
  function init() {
    var initialPath = parseHash();
    if (initialPath.length > 0) {
      Store.set({ folderPath: initialPath });
    }

    window.addEventListener('hashchange', function () {
      var path = parseHash();
      Store.set({ folderPath: path, currentPage: 1 });
      EventBus.emit('navigate', { path: path });
    });
  }

  GWR.Router = {
    init: init,
    navigateTo: navigateTo,
    navigateUp: navigateUp,
    navigateToPath: navigateToPath,
    navigateToRoot: navigateToRoot,
    renderBreadcrumb: renderBreadcrumb
  };

})();
