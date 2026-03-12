/**
 * GetwayROM File Explorer - Main Application
 * Professional file explorer with advanced search, filtering, and sorting
 */

(function () {
  'use strict';

  // --- Configuration ---
  var ITEMS_PER_PAGE = 60;
  var DATA_URL = 'data/files.json';

  // --- State ---
  var state = {
    allFiles: [],
    filteredFiles: [],
    currentPage: 1,
    totalPages: 1,
    viewMode: 'grid', // 'grid' or 'list'
    sortBy: 'name-asc',
    searchQuery: '',
    filterBrand: '',
    filterExtension: '',
    filterName: '',
    sidebarFilter: 'all',
    fuse: null,
    metadata: null
  };

  // --- DOM References ---
  var dom = {};

  function cacheDom() {
    dom.searchInput = document.getElementById('searchInput');
    dom.searchClear = document.getElementById('searchClear');
    dom.searchContainer = document.getElementById('searchContainer');
    dom.searchFilterBtn = document.getElementById('searchFilterBtn');
    dom.advancedSearch = document.getElementById('advancedSearch');
    dom.closeAdvancedSearch = document.getElementById('closeAdvancedSearch');
    dom.filterExtension = document.getElementById('filterExtension');
    dom.filterBrand = document.getElementById('filterBrand');
    dom.filterName = document.getElementById('filterName');
    dom.clearFilters = document.getElementById('clearFilters');
    dom.applyFilters = document.getElementById('applyFilters');
    dom.gridViewBtn = document.getElementById('gridViewBtn');
    dom.listViewBtn = document.getElementById('listViewBtn');
    dom.sortBtn = document.getElementById('sortBtn');
    dom.sortMenu = document.getElementById('sortMenu');
    dom.sidebar = document.getElementById('sidebar');
    dom.sidebarToggle = document.getElementById('sidebarToggle');
    dom.brandList = document.getElementById('brandList');
    dom.extensionList = document.getElementById('extensionList');
    dom.totalCount = document.getElementById('totalCount');
    dom.fileStats = document.getElementById('fileStats');
    dom.currentFilter = document.getElementById('currentFilter');
    dom.resultCount = document.getElementById('resultCount');
    dom.loading = document.getElementById('loading');
    dom.emptyState = document.getElementById('emptyState');
    dom.fileGrid = document.getElementById('fileGrid');
    dom.fileList = document.getElementById('fileList');
    dom.fileListBody = document.getElementById('fileListBody');
    dom.prevPage = document.getElementById('prevPage');
    dom.nextPage = document.getElementById('nextPage');
    dom.pageInfo = document.getElementById('pageInfo');
    dom.pagination = document.getElementById('pagination');
    dom.content = document.getElementById('content');
  }

  // --- Icon Mapping ---
  var FILE_ICONS = {
    archive: 'fas fa-file-archive',
    android: 'fab fa-android',
    image: 'fas fa-compact-disc',
    disk: 'fas fa-compact-disc',
    executable: 'fas fa-cog',
    binary: 'fas fa-microchip',
    document: 'fas fa-file-alt',
    file: 'fas fa-file'
  };

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

  // --- Data Loading ---
  function loadData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', DATA_URL, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            var data = JSON.parse(xhr.responseText);
            initializeApp(data);
          } catch (e) {
            showError('Failed to parse file data');
          }
        } else {
          showError('Failed to load file data (HTTP ' + xhr.status + ')');
        }
      }
    };
    xhr.send();
  }

  function showError(msg) {
    dom.loading.classList.add('hidden');
    dom.emptyState.classList.remove('hidden');
    dom.emptyState.querySelector('h3').textContent = 'Error';
    dom.emptyState.querySelector('p').textContent = msg;
  }

  // --- Initialization ---
  function initializeApp(data) {
    state.allFiles = data.files;
    state.metadata = {
      generated: data.generated,
      totalFiles: data.totalFiles,
      brands: data.brands,
      extensions: data.extensions
    };

    // Initialize Fuse.js for fuzzy search
    if (typeof Fuse !== 'undefined') {
      state.fuse = new Fuse(state.allFiles, {
        keys: [
          { name: 'name', weight: 0.7 },
          { name: 'brand', weight: 0.2 },
          { name: 'extension', weight: 0.1 }
        ],
        threshold: 0.3,
        distance: 100,
        minMatchCharLength: 2,
        includeScore: true,
        includeMatches: true
      });
    }

    populateSidebar();
    populateFilters();
    updateStats();
    applyFiltersAndSearch();

    dom.loading.classList.add('hidden');
  }

  // --- Sidebar Population ---
  function populateSidebar() {
    var brands = state.metadata.brands;
    var sortedBrands = Object.entries(brands).sort(function (a, b) { return b[1] - a[1]; });

    var brandHtml = '';
    sortedBrands.forEach(function (entry) {
      var brand = entry[0];
      var count = entry[1];
      var icon = BRAND_ICONS[brand] || 'fas fa-folder';
      brandHtml += '<button class="sidebar-item" data-filter="brand:' + escapeHtml(brand) + '">' +
        '<i class="' + icon + '"></i>' +
        '<span>' + escapeHtml(brand) + '</span>' +
        '<span class="badge">' + formatNumber(count) + '</span>' +
        '</button>';
    });
    dom.brandList.innerHTML = brandHtml;

    var extensions = state.metadata.extensions;
    var sortedExts = Object.entries(extensions).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 15);

    var extHtml = '';
    sortedExts.forEach(function (entry) {
      var ext = entry[0];
      var count = entry[1];
      extHtml += '<button class="sidebar-item" data-filter="ext:' + escapeHtml(ext) + '">' +
        '<i class="fas fa-file"></i>' +
        '<span>.' + escapeHtml(ext) + '</span>' +
        '<span class="badge">' + formatNumber(count) + '</span>' +
        '</button>';
    });
    dom.extensionList.innerHTML = extHtml;

    dom.totalCount.textContent = formatNumber(state.allFiles.length);
  }

  function populateFilters() {
    var brands = state.metadata.brands;
    var sortedBrands = Object.keys(brands).sort();
    sortedBrands.forEach(function (brand) {
      var opt = document.createElement('option');
      opt.value = brand;
      opt.textContent = brand + ' (' + brands[brand] + ')';
      dom.filterBrand.appendChild(opt);
    });

    var extensions = state.metadata.extensions;
    var sortedExts = Object.keys(extensions).sort();
    sortedExts.forEach(function (ext) {
      var opt = document.createElement('option');
      opt.value = ext;
      opt.textContent = '.' + ext + ' (' + extensions[ext] + ')';
      dom.filterExtension.appendChild(opt);
    });
  }

  function updateStats() {
    dom.fileStats.textContent = formatNumber(state.allFiles.length) + ' firmware files';
  }

  // --- Search & Filter ---
  function applyFiltersAndSearch() {
    var results = state.allFiles;

    // Apply sidebar filter
    if (state.sidebarFilter !== 'all') {
      var parts = state.sidebarFilter.split(':');
      var filterType = parts[0];
      var filterValue = parts.slice(1).join(':');
      if (filterType === 'brand') {
        results = results.filter(function (f) { return f.brand === filterValue; });
      } else if (filterType === 'ext') {
        results = results.filter(function (f) { return f.extension === filterValue; });
      }
    }

    // Apply advanced filters
    if (state.filterBrand) {
      results = results.filter(function (f) { return f.brand === state.filterBrand; });
    }
    if (state.filterExtension) {
      results = results.filter(function (f) { return f.extension === state.filterExtension; });
    }
    if (state.filterName) {
      var lowerFilter = state.filterName.toLowerCase();
      results = results.filter(function (f) { return f.name.toLowerCase().indexOf(lowerFilter) !== -1; });
    }

    // Apply search (fuzzy or exact)
    if (state.searchQuery) {
      var query = state.searchQuery.trim();

      // Check for advanced search operators
      if (query.indexOf(':') !== -1 || query.indexOf('"') !== -1) {
        results = advancedSearch(results, query);
      } else if (state.fuse && query.length >= 2) {
        // Fuzzy search with Fuse.js
        var fuseResults = state.fuse.search(query);
        var matchedUrls = new Set();
        fuseResults.forEach(function (r) { matchedUrls.add(r.item.url); });
        results = results.filter(function (f) { return matchedUrls.has(f.url); });
        // Sort by relevance
        var urlOrder = {};
        fuseResults.forEach(function (r, i) { urlOrder[r.item.url] = i; });
        results.sort(function (a, b) {
          var aIdx = urlOrder[a.url] !== undefined ? urlOrder[a.url] : 99999;
          var bIdx = urlOrder[b.url] !== undefined ? urlOrder[b.url] : 99999;
          return aIdx - bIdx;
        });
      } else {
        // Simple exact search for short queries
        var lowerQuery = query.toLowerCase();
        results = results.filter(function (f) {
          return f.name.toLowerCase().indexOf(lowerQuery) !== -1;
        });
      }
    } else {
      // Apply sort if no search
      results = sortFiles(results, state.sortBy);
    }

    state.filteredFiles = results;
    state.currentPage = 1;
    state.totalPages = Math.max(1, Math.ceil(results.length / ITEMS_PER_PAGE));

    updateResultCount();
    renderFiles();
    updatePagination();
  }

  /**
   * Advanced search with operators:
   * - brand:Samsung → filter by brand
   * - ext:zip → filter by extension
   * - "exact phrase" → exact match
   * - -keyword → exclude keyword
   */
  function advancedSearch(files, query) {
    var tokens = [];
    var regex = /(".*?"|[\S]+)/g;
    var match;
    while ((match = regex.exec(query)) !== null) {
      tokens.push(match[1]);
    }

    var positiveTerms = [];
    var negativeTerms = [];
    var brandFilter = '';
    var extFilter = '';

    tokens.forEach(function (token) {
      if (token.indexOf('brand:') === 0) {
        brandFilter = token.substring(6).toLowerCase();
      } else if (token.indexOf('ext:') === 0) {
        extFilter = token.substring(4).toLowerCase().replace('.', '');
      } else if (token.charAt(0) === '-' && token.length > 1) {
        negativeTerms.push(token.substring(1).toLowerCase().replace(/"/g, ''));
      } else {
        positiveTerms.push(token.toLowerCase().replace(/"/g, ''));
      }
    });

    return files.filter(function (f) {
      var nameLower = f.name.toLowerCase();

      if (brandFilter && f.brand.toLowerCase() !== brandFilter) return false;
      if (extFilter && f.extension.toLowerCase() !== extFilter) return false;

      for (var i = 0; i < negativeTerms.length; i++) {
        if (nameLower.indexOf(negativeTerms[i]) !== -1) return false;
      }

      for (var j = 0; j < positiveTerms.length; j++) {
        if (nameLower.indexOf(positiveTerms[j]) === -1) return false;
      }

      return true;
    });
  }

  // --- Sorting ---
  function sortFiles(files, sortKey) {
    var sorted = files.slice();
    var parts = sortKey.split('-');
    var field = parts[0];
    var dir = parts[1] === 'desc' ? -1 : 1;

    sorted.sort(function (a, b) {
      var valA, valB;
      if (field === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (field === 'ext') {
        valA = a.extension.toLowerCase();
        valB = b.extension.toLowerCase();
      } else if (field === 'brand') {
        valA = a.brand.toLowerCase();
        valB = b.brand.toLowerCase();
      } else {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      }

      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });

    return sorted;
  }

  // --- Rendering ---
  function renderFiles() {
    var start = (state.currentPage - 1) * ITEMS_PER_PAGE;
    var end = start + ITEMS_PER_PAGE;
    var page = state.filteredFiles.slice(start, end);

    if (page.length === 0) {
      dom.fileGrid.innerHTML = '';
      dom.fileListBody.innerHTML = '';
      dom.emptyState.classList.remove('hidden');
      return;
    }

    dom.emptyState.classList.add('hidden');

    if (state.viewMode === 'grid') {
      renderGrid(page);
    } else {
      renderList(page);
    }
  }

  function renderGrid(files) {
    var html = '';
    files.forEach(function (file) {
      var iconClass = FILE_ICONS[file.fileType] || FILE_ICONS.file;
      html += '<a href="' + escapeAttr(file.url) + '" target="_blank" rel="noopener" class="file-card" title="' + escapeAttr(file.name) + '">' +
        '<div class="file-card-icon ' + escapeAttr(file.fileType) + '">' +
        '<i class="' + iconClass + '"></i></div>' +
        '<div class="file-card-name">' + escapeHtml(file.name) + '</div>' +
        '<div class="file-card-meta">' +
        '<span class="file-card-brand">' + escapeHtml(file.brand) + '</span>' +
        '<span class="file-card-ext">' + escapeHtml(file.extension) + '</span>' +
        '</div>' +
        '<div class="file-card-download"><i class="fas fa-download"></i></div>' +
        '</a>';
    });
    dom.fileGrid.innerHTML = html;
  }

  function renderList(files) {
    var html = '';
    files.forEach(function (file) {
      var iconClass = FILE_ICONS[file.fileType] || FILE_ICONS.file;
      html += '<a href="' + escapeAttr(file.url) + '" target="_blank" rel="noopener" class="file-list-row" title="' + escapeAttr(file.name) + '">' +
        '<div class="list-row-icon ' + escapeAttr(file.fileType) + '">' +
        '<i class="' + iconClass + '"></i></div>' +
        '<div class="list-row-name">' + escapeHtml(file.name) + '</div>' +
        '<div class="list-row-brand">' + escapeHtml(file.brand) + '</div>' +
        '<div class="list-row-ext">' + escapeHtml(file.extension) + '</div>' +
        '<div class="list-row-action"><span class="btn-download">Download</span></div>' +
        '</a>';
    });
    dom.fileListBody.innerHTML = html;
  }

  function updateResultCount() {
    var total = state.filteredFiles.length;
    if (state.searchQuery) {
      dom.resultCount.textContent = formatNumber(total) + ' results for "' + state.searchQuery + '"';
    } else {
      dom.resultCount.textContent = formatNumber(total) + ' files';
    }
  }

  function updatePagination() {
    dom.prevPage.disabled = state.currentPage <= 1;
    dom.nextPage.disabled = state.currentPage >= state.totalPages;
    dom.pageInfo.textContent = 'Page ' + state.currentPage + ' of ' + state.totalPages;
    dom.pagination.classList.toggle('hidden', state.totalPages <= 1);
  }

  // --- Event Handlers ---
  function bindEvents() {
    // Search
    var searchTimeout;
    dom.searchInput.addEventListener('input', function () {
      clearTimeout(searchTimeout);
      var val = this.value;
      dom.searchClear.classList.toggle('hidden', !val);
      searchTimeout = setTimeout(function () {
        state.searchQuery = val;
        applyFiltersAndSearch();
      }, 300);
    });

    dom.searchClear.addEventListener('click', function () {
      dom.searchInput.value = '';
      dom.searchClear.classList.add('hidden');
      state.searchQuery = '';
      applyFiltersAndSearch();
    });

    // Advanced Search Toggle
    dom.searchFilterBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      dom.advancedSearch.classList.toggle('hidden');
    });

    dom.closeAdvancedSearch.addEventListener('click', function () {
      dom.advancedSearch.classList.add('hidden');
    });

    dom.applyFilters.addEventListener('click', function () {
      state.filterBrand = dom.filterBrand.value;
      state.filterExtension = dom.filterExtension.value;
      state.filterName = dom.filterName.value;
      dom.advancedSearch.classList.add('hidden');
      applyFiltersAndSearch();
    });

    dom.clearFilters.addEventListener('click', function () {
      dom.filterBrand.value = '';
      dom.filterExtension.value = '';
      dom.filterName.value = '';
      state.filterBrand = '';
      state.filterExtension = '';
      state.filterName = '';
      applyFiltersAndSearch();
    });

    // View Toggle
    dom.gridViewBtn.addEventListener('click', function () {
      state.viewMode = 'grid';
      dom.gridViewBtn.classList.add('active');
      dom.listViewBtn.classList.remove('active');
      dom.fileGrid.classList.remove('hidden');
      dom.fileList.classList.add('hidden');
      renderFiles();
    });

    dom.listViewBtn.addEventListener('click', function () {
      state.viewMode = 'list';
      dom.listViewBtn.classList.add('active');
      dom.gridViewBtn.classList.remove('active');
      dom.fileList.classList.remove('hidden');
      dom.fileGrid.classList.add('hidden');
      renderFiles();
    });

    // Sort
    dom.sortBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      dom.sortMenu.classList.toggle('hidden');
    });

    dom.sortMenu.addEventListener('click', function (e) {
      var item = e.target.closest('.dropdown-item');
      if (!item) return;
      var sortKey = item.getAttribute('data-sort');
      state.sortBy = sortKey;
      dom.sortMenu.querySelectorAll('.dropdown-item').forEach(function (el) {
        el.classList.remove('active');
      });
      item.classList.add('active');
      dom.sortMenu.classList.add('hidden');
      applyFiltersAndSearch();
    });

    // List header sort
    var listHeaders = document.querySelectorAll('.file-list-header .list-col[data-sort]');
    listHeaders.forEach(function (header) {
      header.addEventListener('click', function () {
        var sortKey = this.getAttribute('data-sort');
        // Toggle direction if already active
        if (state.sortBy === sortKey) {
          var parts = sortKey.split('-');
          sortKey = parts[0] + '-' + (parts[1] === 'asc' ? 'desc' : 'asc');
          this.setAttribute('data-sort', sortKey);
        }
        state.sortBy = sortKey;
        applyFiltersAndSearch();
      });
    });

    // Sidebar
    dom.sidebarToggle.addEventListener('click', function () {
      if (window.innerWidth <= 1024) {
        dom.sidebar.classList.toggle('open');
        toggleOverlay(dom.sidebar.classList.contains('open'));
      } else {
        dom.sidebar.classList.toggle('collapsed');
      }
    });

    // Sidebar filter items
    document.addEventListener('click', function (e) {
      var item = e.target.closest('.sidebar-item[data-filter]');
      if (item) {
        var filter = item.getAttribute('data-filter');
        state.sidebarFilter = filter;

        // Update active state
        document.querySelectorAll('.sidebar-item').forEach(function (el) {
          el.classList.remove('active');
        });
        item.classList.add('active');

        // Update breadcrumb
        if (filter === 'all') {
          dom.currentFilter.textContent = 'All Files';
        } else {
          var parts = filter.split(':');
          dom.currentFilter.textContent = parts.slice(1).join(':');
        }

        applyFiltersAndSearch();

        // Close sidebar on mobile
        if (window.innerWidth <= 1024) {
          dom.sidebar.classList.remove('open');
          toggleOverlay(false);
        }
      }
    });

    // Pagination
    dom.prevPage.addEventListener('click', function () {
      if (state.currentPage > 1) {
        state.currentPage--;
        renderFiles();
        updatePagination();
        dom.content.scrollTop = 0;
      }
    });

    dom.nextPage.addEventListener('click', function () {
      if (state.currentPage < state.totalPages) {
        state.currentPage++;
        renderFiles();
        updatePagination();
        dom.content.scrollTop = 0;
      }
    });

    // Close dropdowns on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.sort-dropdown')) {
        dom.sortMenu.classList.add('hidden');
      }
      if (!e.target.closest('.advanced-search') && !e.target.closest('.search-filter-btn')) {
        dom.advancedSearch.classList.add('hidden');
      }
    });

    // Keyboard shortcut: focus search on /
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== dom.searchInput) {
        e.preventDefault();
        dom.searchInput.focus();
      }
      if (e.key === 'Escape') {
        dom.searchInput.blur();
        dom.advancedSearch.classList.add('hidden');
        dom.sortMenu.classList.add('hidden');
      }
    });
  }

  // --- Overlay for mobile ---
  function toggleOverlay(show) {
    var overlay = document.querySelector('.sidebar-overlay');
    if (!overlay && show) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay active';
      overlay.addEventListener('click', function () {
        dom.sidebar.classList.remove('open');
        toggleOverlay(false);
      });
      document.body.appendChild(overlay);
    } else if (overlay) {
      if (show) {
        overlay.classList.add('active');
      } else {
        overlay.classList.remove('active');
      }
    }
  }

  // --- Utility Functions ---
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function formatNumber(n) {
    if (n >= 1000) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return n.toString();
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', function () {
    cacheDom();
    bindEvents();
    loadData();
  });

})();
