/**
 * GetwayROM File Explorer - Main Application Controller
 * Orchestrates all modules: search, rendering, sidebar, theme, keyboard, notifications
 */

(function () {
  'use strict';

  var Utils = GWR.Utils;
  var SearchEngine = GWR.SearchEngine;
  var FileRenderer = GWR.FileRenderer;
  var Sidebar = GWR.Sidebar;
  var Theme = GWR.Theme;
  var Keyboard = GWR.Keyboard;
  var Toast = GWR.Toast;

  // --- Configuration ---
  var ITEMS_PER_PAGE = 60;
  var DATA_URL = 'data/files.json';

  // --- State ---
  var state = {
    allFiles: [],
    filteredFiles: [],
    currentPage: 1,
    totalPages: 1,
    viewMode: 'grid',
    sortBy: 'name-asc',
    searchQuery: '',
    filterBrand: '',
    filterExtension: '',
    filterName: '',
    sidebarFilter: 'all',
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
    dom.themeToggle = document.getElementById('themeToggle');
  }

  // --- Data Loading ---
  function loadData() {
    FileRenderer.renderSkeletonGrid(dom.fileGrid, 12);

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
    dom.fileGrid.innerHTML = '';
    dom.emptyState.classList.remove('hidden');
    dom.emptyState.querySelector('h3').textContent = 'Error';
    dom.emptyState.querySelector('p').textContent = msg;
    Toast.error(msg);
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

    // Initialize search engine
    SearchEngine.init(state.allFiles);

    // Populate sidebar using module
    Sidebar.init({ onFilterChange: function () { applyFiltersAndSearch(); } });
    Sidebar.populateBrands(dom.brandList, state.metadata.brands);
    Sidebar.populateExtensions(dom.extensionList, state.metadata.extensions);

    // Populate filter dropdowns
    populateFilters();

    // Update stats
    dom.totalCount.textContent = Utils.formatNumber(state.allFiles.length);
    dom.fileStats.textContent = Utils.formatNumber(state.allFiles.length) + ' firmware files';

    applyFiltersAndSearch();
    dom.loading.classList.add('hidden');

    Toast.success('Loaded ' + Utils.formatNumber(state.allFiles.length) + ' firmware files');
  }

  function populateFilters() {
    var brands = state.metadata.brands;
    Object.keys(brands).sort().forEach(function (brand) {
      var opt = document.createElement('option');
      opt.value = brand;
      opt.textContent = brand + ' (' + brands[brand] + ')';
      dom.filterBrand.appendChild(opt);
    });

    var extensions = state.metadata.extensions;
    Object.keys(extensions).sort().forEach(function (ext) {
      var opt = document.createElement('option');
      opt.value = ext;
      opt.textContent = '.' + ext + ' (' + extensions[ext] + ')';
      dom.filterExtension.appendChild(opt);
    });
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

    // Apply search using the SearchEngine module
    if (state.searchQuery) {
      results = SearchEngine.search(results, state.searchQuery);
    } else {
      results = sortFiles(results, state.sortBy);
    }

    state.filteredFiles = results;
    state.currentPage = 1;
    state.totalPages = Math.max(1, Math.ceil(results.length / ITEMS_PER_PAGE));

    updateResultCount();
    renderFiles();
    updatePagination();
    updateActiveFilterBadges();
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
      FileRenderer.renderGrid(dom.fileGrid, page);
    } else {
      FileRenderer.renderList(dom.fileListBody, page);
    }
  }

  function updateResultCount() {
    var total = state.filteredFiles.length;
    if (state.searchQuery) {
      dom.resultCount.textContent = Utils.formatNumber(total) + ' results for \u201c' + state.searchQuery + '\u201d';
    } else {
      dom.resultCount.textContent = Utils.formatNumber(total) + ' files';
    }
  }

  function updatePagination() {
    dom.prevPage.disabled = state.currentPage <= 1;
    dom.nextPage.disabled = state.currentPage >= state.totalPages;
    dom.pageInfo.textContent = 'Page ' + state.currentPage + ' of ' + state.totalPages;
    dom.pagination.classList.toggle('hidden', state.totalPages <= 1);
  }

  function updateActiveFilterBadges() {
    var container = document.getElementById('activeFilters');
    if (!container) return;
    var html = '';

    if (state.sidebarFilter !== 'all') {
      html += '<span class="filter-badge"><i class="fas fa-filter"></i> ' +
        Utils.escapeHtml(state.sidebarFilter.split(':').slice(1).join(':')) +
        ' <button data-clear="sidebar"><i class="fas fa-times"></i></button></span>';
    }
    if (state.filterBrand) {
      html += '<span class="filter-badge"><i class="fas fa-tag"></i> ' +
        Utils.escapeHtml(state.filterBrand) +
        ' <button data-clear="brand"><i class="fas fa-times"></i></button></span>';
    }
    if (state.filterExtension) {
      html += '<span class="filter-badge"><i class="fas fa-file"></i> .' +
        Utils.escapeHtml(state.filterExtension) +
        ' <button data-clear="ext"><i class="fas fa-times"></i></button></span>';
    }

    container.innerHTML = html;

    container.querySelectorAll('button[data-clear]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var type = this.getAttribute('data-clear');
        if (type === 'sidebar') {
          state.sidebarFilter = 'all';
          Sidebar.setActiveItem('all');
          dom.currentFilter.textContent = 'All Files';
        } else if (type === 'brand') {
          state.filterBrand = '';
          dom.filterBrand.value = '';
        } else if (type === 'ext') {
          state.filterExtension = '';
          dom.filterExtension.value = '';
        }
        applyFiltersAndSearch();
      });
    });
  }

  // --- Event Handlers ---
  function bindEvents() {
    // Search (debounced)
    var debouncedSearch = Utils.debounce(function (val) {
      state.searchQuery = val;
      applyFiltersAndSearch();
    }, 300);

    dom.searchInput.addEventListener('input', function () {
      var val = this.value;
      dom.searchClear.classList.toggle('hidden', !val);
      debouncedSearch(val);
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
      state.sortBy = item.getAttribute('data-sort');
      dom.sortMenu.querySelectorAll('.dropdown-item').forEach(function (el) {
        el.classList.remove('active');
      });
      item.classList.add('active');
      dom.sortMenu.classList.add('hidden');
      applyFiltersAndSearch();
    });

    // List header sort
    document.querySelectorAll('.file-list-header .list-col[data-sort]').forEach(function (header) {
      header.addEventListener('click', function () {
        var sortKey = this.getAttribute('data-sort');
        if (state.sortBy === sortKey) {
          var p = sortKey.split('-');
          sortKey = p[0] + '-' + (p[1] === 'asc' ? 'desc' : 'asc');
          this.setAttribute('data-sort', sortKey);
        }
        state.sortBy = sortKey;
        applyFiltersAndSearch();
      });
    });

    // Sidebar toggle
    dom.sidebarToggle.addEventListener('click', function () {
      Sidebar.toggle(dom.sidebar);
    });

    // Sidebar filter items (delegated)
    document.addEventListener('click', function (e) {
      var item = e.target.closest('.sidebar-item[data-filter]');
      if (item) {
        var filter = item.getAttribute('data-filter');
        state.sidebarFilter = filter;
        Sidebar.setActiveItem(filter);

        dom.currentFilter.textContent = filter === 'all'
          ? 'All Files'
          : filter.split(':').slice(1).join(':');

        applyFiltersAndSearch();

        if (window.innerWidth <= 1024) {
          Sidebar.close(dom.sidebar);
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

    // Theme toggle
    if (dom.themeToggle) {
      dom.themeToggle.addEventListener('click', function () {
        var newTheme = Theme.toggle();
        Toast.info('Switched to ' + newTheme + ' mode');
      });
    }

    // Close dropdowns on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.sort-dropdown')) {
        dom.sortMenu.classList.add('hidden');
      }
      if (!e.target.closest('.advanced-search') && !e.target.closest('.search-filter-btn')) {
        dom.advancedSearch.classList.add('hidden');
      }
    });
  }

  // --- Keyboard Shortcuts ---
  function setupKeyboardShortcuts() {
    Keyboard.init();

    Keyboard.register('/', 'Focus search bar', function () {
      dom.searchInput.focus();
    });

    Keyboard.register('Escape', 'Close menus and blur search', function () {
      dom.advancedSearch.classList.add('hidden');
      dom.sortMenu.classList.add('hidden');
    });

    Keyboard.register('g', 'Switch to grid view', function () {
      dom.gridViewBtn.click();
    });

    Keyboard.register('l', 'Switch to list view', function () {
      dom.listViewBtn.click();
    });

    Keyboard.register('t', 'Toggle dark/light theme', function () {
      if (dom.themeToggle) dom.themeToggle.click();
    });

    Keyboard.register('?', 'Show keyboard shortcuts', function () {
      Keyboard.showHelp();
    });

    Keyboard.register('ArrowLeft', 'Previous page', function () {
      dom.prevPage.click();
    });

    Keyboard.register('ArrowRight', 'Next page', function () {
      dom.nextPage.click();
    });
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', function () {
    Theme.init();
    cacheDom();
    bindEvents();
    setupKeyboardShortcuts();
    loadData();
  });

})();
