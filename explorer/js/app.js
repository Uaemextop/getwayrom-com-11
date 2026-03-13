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
  var GITHUB_OWNER = 'Uaemextop';
  var GITHUB_REPO = 'getwayrom-com-11';

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
    currentFolder: null,
    folderPath: [],
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
    dom.overviewTotalFiles = document.getElementById('overviewTotalFiles');
    dom.overviewBrandCount = document.getElementById('overviewBrandCount');
    dom.overviewExtensionCount = document.getElementById('overviewExtensionCount');
    dom.overviewUpdatedAt = document.getElementById('overviewUpdatedAt');
    dom.quickBrandRail = document.getElementById('quickBrandRail');
    dom.quickExtensionRail = document.getElementById('quickExtensionRail');
    dom.resetWorkspaceBtn = document.getElementById('resetWorkspaceBtn');
    dom.jumpToQuickAccessBtn = document.getElementById('jumpToQuickAccessBtn');
    dom.workspacePanel = document.getElementById('workspacePanel');
    dom.loading = document.getElementById('loading');
    dom.emptyState = document.getElementById('emptyState');
    dom.fileGrid = document.getElementById('fileGrid');
    dom.fileList = document.getElementById('fileList');
    dom.fileListBody = document.getElementById('fileListBody');
    dom.prevPage = document.getElementById('prevPage');
    dom.nextPage = document.getElementById('nextPage');
    dom.pageInfo = document.getElementById('pageInfo');
    dom.pageNumbers = document.getElementById('pageNumbers');
    dom.pagination = document.getElementById('pagination');
    dom.content = document.getElementById('content');
    dom.themeToggle = document.getElementById('themeToggle');
    dom.breadcrumb = document.querySelector('.breadcrumb');
    dom.refreshBtn = document.getElementById('refreshBtn');
    dom.backToTop = document.getElementById('backToTop');
    dom.sidebarSearch = document.getElementById('sidebarSearch');
    dom.clearAllFiltersBtn = document.getElementById('clearAllFiltersBtn');
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
          tryFetchFromRelease();
        }
      }
    };
    xhr.send();
  }

  /**
   * Attempt to fetch firmware_ok.md from GitHub Releases as a fallback.
   */
  function tryFetchFromRelease() {
    Toast.info('Trying to fetch data from GitHub releases...');

    var apiUrl = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/releases/latest';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl, true);
    xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          var release = JSON.parse(xhr.responseText);
          var asset = null;
          if (release.assets) {
            for (var i = 0; i < release.assets.length; i++) {
              if (release.assets[i].name === 'firmware_ok.md') {
                asset = release.assets[i];
                break;
              }
            }
          }
          if (asset) {
            fetchAndParseMd(asset.browser_download_url);
          }
        } catch (e) {
          // silently fail
        }
      }
    };
    xhr.send();
  }

  /**
   * Fetch markdown content and parse it into file data.
   */
  function fetchAndParseMd(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var content = xhr.responseText;
        var data = parseFirmwareMd(content);
        if (data.files.length > 0) {
          initializeApp(data);
          Toast.success('Loaded ' + Utils.formatNumber(data.files.length) + ' files from release');
        }
      }
    };
    xhr.send();
  }

  /**
   * Parse firmware_ok.md content into structured data.
   */
  function parseFirmwareMd(content) {
    var lines = content.split('\n').filter(function (l) {
      return l.trim().indexOf('- **') === 0;
    });
    var files = [];
    var seen = {};
    var brands = {};
    var extensions = {};

    var brandPatterns = [
      { pattern: /\bSM-[A-Z]\d/i, brand: 'Samsung' },
      { pattern: /\bSamsung\b/i, brand: 'Samsung' },
      { pattern: /\bGalaxy\b/i, brand: 'Samsung' },
      { pattern: /\bRMX\d/i, brand: 'Realme' },
      { pattern: /\bRealme\b/i, brand: 'Realme' },
      { pattern: /\bRedmi\b/i, brand: 'Xiaomi' },
      { pattern: /\bXiaomi\b/i, brand: 'Xiaomi' },
      { pattern: /\bPOCO\b/i, brand: 'Xiaomi' },
      { pattern: /\bOPPO\b/i, brand: 'OPPO' },
      { pattern: /\bVivo\b/i, brand: 'Vivo' },
      { pattern: /\bHuawei\b/i, brand: 'Huawei' },
      { pattern: /\bHonor\b/i, brand: 'Honor' },
      { pattern: /\bNokia\b/i, brand: 'Nokia' },
      { pattern: /\bMotorola\b/i, brand: 'Motorola' },
      { pattern: /\bMoto\s/i, brand: 'Motorola' },
      { pattern: /\bOnePlus\b/i, brand: 'OnePlus' },
      { pattern: /\bLG-/i, brand: 'LG' },
      { pattern: /\bSony\b/i, brand: 'Sony' },
      { pattern: /\bLenovo\b/i, brand: 'Lenovo' },
      { pattern: /\bASUS\b/i, brand: 'ASUS' },
      { pattern: /\bHTC\b/i, brand: 'HTC' },
      { pattern: /\bZTE\b/i, brand: 'ZTE' },
      { pattern: /\bTecno\b/i, brand: 'Tecno' },
      { pattern: /\bInfinix\b/i, brand: 'Infinix' }
    ];

    function detectBrand(name) {
      for (var i = 0; i < brandPatterns.length; i++) {
        if (brandPatterns[i].pattern.test(name)) return brandPatterns[i].brand;
      }
      return 'Other';
    }

    var typeMap = {
      zip: 'archive', rar: 'archive', '7z': 'archive', gz: 'archive',
      apk: 'android', img: 'image', iso: 'disk',
      exe: 'executable', bin: 'binary', mbn: 'binary', dat: 'binary',
      md: 'document', txt: 'document', pdf: 'document',
      ozip: 'archive', ofp: 'flash', pac: 'flash'
    };

    for (var i = 0; i < lines.length; i++) {
      var match = lines[i].match(/^-\s+\*\*(.+?)\*\*\s+—\s+\[Download\]\((.+?)\)/);
      if (!match) continue;
      var name = match[1].trim();
      var url = match[2].trim();
      if (seen[url]) continue;
      seen[url] = true;

      var extMatch = name.match(/\.(\w+)$/);
      var ext = extMatch ? extMatch[1].toLowerCase() : 'unknown';
      var brand = detectBrand(name);
      var fileType = typeMap[ext] || 'file';

      files.push({ name: name, url: url, extension: ext, brand: brand, fileType: fileType });
      brands[brand] = (brands[brand] || 0) + 1;
      extensions[ext] = (extensions[ext] || 0) + 1;
    }

    files.sort(function (a, b) {
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

    return {
      generated: new Date().toISOString(),
      totalFiles: files.length,
      brands: brands,
      extensions: extensions,
      files: files
    };
  }

  function showError(msg) {
    dom.loading.classList.add('hidden');
    dom.fileGrid.innerHTML = '';
    dom.emptyState.classList.remove('hidden');
    dom.emptyState.querySelector('h3').textContent = 'Error';
    dom.emptyState.querySelector('p').textContent = msg;
    Toast.error(msg);
  }

  // --- Folder Structure ---
  function buildFolderTree(files) {
    var tree = {
      name: 'All Files',
      folders: {},
      files: []
    };

    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      var brand = f.brand || 'Other';
      var fType = f.fileType || 'file';

      if (!tree.folders[brand]) {
        tree.folders[brand] = {
          name: brand,
          folders: {},
          files: []
        };
      }

      if (!tree.folders[brand].folders[fType]) {
        tree.folders[brand].folders[fType] = {
          name: fType,
          folders: {},
          files: []
        };
      }

      tree.folders[brand].folders[fType].files.push(f);
      tree.folders[brand].files.push(f);
    }

    return tree;
  }

  function getCurrentFolderFiles() {
    if (!state.folderPath.length) return state.allFiles;

    var tree = buildFolderTree(state.allFiles);
    var current = tree;
    for (var i = 0; i < state.folderPath.length; i++) {
      if (current.folders && current.folders[state.folderPath[i]]) {
        current = current.folders[state.folderPath[i]];
      } else {
        return [];
      }
    }
    return current.files || [];
  }

  function getCurrentSubfolders() {
    var tree = buildFolderTree(state.allFiles);
    var current = tree;
    for (var i = 0; i < state.folderPath.length; i++) {
      if (current.folders && current.folders[state.folderPath[i]]) {
        current = current.folders[state.folderPath[i]];
      } else {
        return {};
      }
    }
    return current.folders || {};
  }

  function renderBreadcrumb() {
    if (!dom.breadcrumb) return;
    var html = '<span class="breadcrumb-item breadcrumb-link" data-path=""><i class="fas fa-home"></i> Home</span>';

    for (var i = 0; i < state.folderPath.length; i++) {
      html += '<span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>';
      var pathUpTo = state.folderPath.slice(0, i + 1).join('/');
      var isLast = (i === state.folderPath.length - 1);
      html += '<span class="breadcrumb-item' + (isLast ? ' active' : ' breadcrumb-link') + '" data-path="' + Utils.escapeHtml(pathUpTo) + '">' +
        '<i class="fas ' + (state.folderPath.length === 1 ? 'fa-folder' : 'fa-folder-open') + '"></i> ' +
        Utils.escapeHtml(state.folderPath[i]) +
      '</span>';
    }

    dom.breadcrumb.innerHTML = html;

    // Bind breadcrumb click events
    dom.breadcrumb.querySelectorAll('.breadcrumb-link').forEach(function (el) {
      el.addEventListener('click', function () {
        var pathStr = this.getAttribute('data-path');
        if (pathStr === '') {
          state.folderPath = [];
        } else {
          state.folderPath = pathStr.split('/');
        }
        state.currentPage = 1;
        applyFiltersAndSearch();
        renderBreadcrumb();
      });
    });
  }

  function renderFolderCards(container) {
    var subfolders = getCurrentSubfolders();
    var folderNames = Object.keys(subfolders).sort();
    if (folderNames.length === 0) return '';

    var html = '';
    for (var i = 0; i < folderNames.length; i++) {
      var name = folderNames[i];
      var folder = subfolders[name];
      var fileCount = folder.files ? folder.files.length : 0;
      var subCount = folder.folders ? Object.keys(folder.folders).length : 0;
      var iconClass = state.folderPath.length === 0 ? Utils.getBrandColorClass(name) : '';

      html += '<div class="folder-card" data-folder="' + Utils.escapeHtml(name) + '">' +
        '<div class="folder-card-icon ' + iconClass + '">' +
          '<i class="fas ' + (state.folderPath.length === 0 ? Utils.getBrandIcon(name) : 'fa-folder') + '"></i>' +
        '</div>' +
        '<div class="folder-card-info">' +
          '<div class="folder-card-name">' + Utils.escapeHtml(name) + '</div>' +
          '<div class="folder-card-meta">' +
            Utils.formatNumber(fileCount) + ' files' +
            (subCount > 0 ? ', ' + subCount + ' folders' : '') +
          '</div>' +
        '</div>' +
      '</div>';
    }

    return html;
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
    populateQuickAccess();

    // Update stats
    dom.totalCount.textContent = Utils.formatNumber(state.allFiles.length);
    dom.fileStats.textContent = Utils.formatNumber(state.allFiles.length) + ' firmware files';
    if (dom.overviewTotalFiles) dom.overviewTotalFiles.textContent = Utils.formatNumber(state.allFiles.length);
    if (dom.overviewBrandCount) dom.overviewBrandCount.textContent = Utils.formatNumber(Object.keys(state.metadata.brands).length);
    if (dom.overviewExtensionCount) dom.overviewExtensionCount.textContent = Utils.formatNumber(Object.keys(state.metadata.extensions).length);
    if (dom.overviewUpdatedAt) {
      var updatedAt = new Date(state.metadata.generated);
      dom.overviewUpdatedAt.textContent = isNaN(updatedAt.getTime())
        ? 'Recently'
        : updatedAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    applyFiltersAndSearch();
    dom.loading.classList.add('hidden');
    renderBreadcrumb();

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

  function populateQuickAccess() {
    if (dom.quickBrandRail) {
      var brandButtons = Object.keys(state.metadata.brands)
        .sort(function (a, b) { return state.metadata.brands[b] - state.metadata.brands[a]; })
        .slice(0, 8)
        .map(function (brand) {
          return '<button class="quick-filter-card" data-quick-filter="brand" data-value="' + Utils.escapeHtml(brand) + '">' +
            '<span class="quick-filter-title">' + Utils.escapeHtml(brand) + '</span>' +
            '<span class="quick-filter-meta">' + Utils.formatNumber(state.metadata.brands[brand]) + ' files</span>' +
          '</button>';
        })
        .join('');
      dom.quickBrandRail.innerHTML = brandButtons;
    }

    if (dom.quickExtensionRail) {
      var extButtons = Object.keys(state.metadata.extensions)
        .sort(function (a, b) { return state.metadata.extensions[b] - state.metadata.extensions[a]; })
        .slice(0, 8)
        .map(function (ext) {
          return '<button class="quick-filter-card" data-quick-filter="ext" data-value="' + Utils.escapeHtml(ext) + '">' +
            '<span class="quick-filter-title">.' + Utils.escapeHtml(ext) + '</span>' +
            '<span class="quick-filter-meta">' + Utils.formatNumber(state.metadata.extensions[ext]) + ' files</span>' +
          '</button>';
        })
        .join('');
      dom.quickExtensionRail.innerHTML = extButtons;
    }
  }

  function resetWorkspace() {
    state.searchQuery = '';
    state.filterBrand = '';
    state.filterExtension = '';
    state.filterName = '';
    state.sidebarFilter = 'all';
    state.folderPath = [];
    state.currentFolder = null;
    state.sortBy = 'name-asc';
    state.currentPage = 1;

    dom.searchInput.value = '';
    dom.searchClear.classList.add('hidden');
    dom.filterBrand.value = '';
    dom.filterExtension.value = '';
    dom.filterName.value = '';
    dom.currentFilter.textContent = 'All Files';
    Sidebar.setActiveItem('all');

    applyFiltersAndSearch();
  }

  // --- Search & Filter ---
  function applyFiltersAndSearch() {
    var results = state.folderPath.length > 0 ? getCurrentFolderFiles() : state.allFiles;

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
    renderBreadcrumb();
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

    // Get folder cards (only for first page and not searching)
    var folderHtml = '';
    if (state.currentPage === 1 && !state.searchQuery && state.sidebarFilter === 'all' && !state.filterBrand && !state.filterExtension) {
      folderHtml = renderFolderCards(dom.fileGrid);
    }

    var page = state.filteredFiles.slice(start, end);

    if (page.length === 0 && !folderHtml) {
      dom.fileGrid.innerHTML = '';
      dom.fileListBody.innerHTML = '';
      dom.emptyState.classList.remove('hidden');
      return;
    }

    dom.emptyState.classList.add('hidden');

    if (state.viewMode === 'grid') {
      var gridHtml = folderHtml;
      for (var i = 0; i < page.length; i++) {
        gridHtml += FileRenderer.createFileCard(page[i]);
      }
      dom.fileGrid.innerHTML = gridHtml;
    } else {
      FileRenderer.renderList(dom.fileListBody, page);
    }
  }

  function updateResultCount() {
    var total = state.filteredFiles.length;
    var prefix = state.folderPath.length > 0 ? state.folderPath[state.folderPath.length - 1] + ': ' : '';
    if (state.searchQuery) {
      dom.resultCount.textContent = prefix + Utils.formatNumber(total) + ' results for \u201c' + state.searchQuery + '\u201d';
    } else {
      dom.resultCount.textContent = prefix + Utils.formatNumber(total) + ' files';
    }
  }

  function updatePagination() {
    dom.prevPage.disabled = state.currentPage <= 1;
    dom.nextPage.disabled = state.currentPage >= state.totalPages;
    dom.pageInfo.textContent = 'Page ' + state.currentPage + ' of ' + state.totalPages;
    dom.pagination.classList.toggle('hidden', state.totalPages <= 1);

    // Render page number buttons
    if (dom.pageNumbers) {
      var html = '';
      var total = state.totalPages;
      var current = state.currentPage;
      var maxVisible = 5;
      var start = Math.max(1, current - Math.floor(maxVisible / 2));
      var end = Math.min(total, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      if (start > 1) {
        html += '<button class="btn-page-num" data-page="1">1</button>';
        if (start > 2) html += '<span class="page-ellipsis">...</span>';
      }

      for (var i = start; i <= end; i++) {
        html += '<button class="btn-page-num' + (i === current ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
      }

      if (end < total) {
        if (end < total - 1) html += '<span class="page-ellipsis">...</span>';
        html += '<button class="btn-page-num" data-page="' + total + '">' + total + '</button>';
      }

      dom.pageNumbers.innerHTML = html;
    }
  }

  function updateActiveFilterBadges() {
    var container = document.getElementById('activeFilters');
    if (!container) return;
    var html = '';

    if (state.folderPath.length > 0) {
      html += '<span class="filter-badge"><i class="fas fa-folder"></i> ' +
        Utils.escapeHtml(state.folderPath.join(' / ')) +
        ' <button data-clear="folder"><i class="fas fa-times"></i></button></span>';
    }

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
        if (type === 'folder') {
          state.folderPath = [];
        } else if (type === 'sidebar') {
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

  // --- File Click Handler ---
  function handleFileClick(e) {
    var card = e.target.closest('.file-card, .file-row');
    if (!card) return;

    // Don't open dialog if clicking the download button directly
    if (e.target.closest('.btn-download')) return;

    var fileName = card.getAttribute('data-file-name');
    var fileUrl = card.getAttribute('data-file-url');
    var fileBrand = card.getAttribute('data-file-brand');
    var fileExt = card.getAttribute('data-file-ext');
    var fileType = card.getAttribute('data-file-type');

    if (fileName && fileUrl) {
      FileRenderer.openFileDialog({
        name: fileName,
        url: fileUrl,
        brand: fileBrand || 'Unknown',
        ext: fileExt || 'unknown',
        type: fileType || 'file'
      });
    }
  }

  // --- Folder Click Handler ---
  function handleFolderClick(e) {
    var folderCard = e.target.closest('.folder-card');
    if (!folderCard) return;

    var folderName = folderCard.getAttribute('data-folder');
    if (folderName) {
      state.folderPath.push(folderName);
      state.currentPage = 1;
      applyFiltersAndSearch();
    }
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
        state.folderPath = [];
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

    // File card click → open detail dialog
    dom.fileGrid.addEventListener('click', handleFileClick);
    dom.fileListBody.addEventListener('click', handleFileClick);

    // Folder card click → navigate into folder
    dom.fileGrid.addEventListener('click', handleFolderClick);

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
        var icon = dom.themeToggle.querySelector('i');
        if (icon) {
          icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        Toast.info('Switched to ' + newTheme + ' mode');
      });
    }

    // Refresh button
    if (dom.refreshBtn) {
      dom.refreshBtn.addEventListener('click', function () {
        dom.loading.classList.remove('hidden');
        dom.fileGrid.innerHTML = '';
        Toast.info('Refreshing file list...');
        tryFetchFromRelease();
      });
    }

    if (dom.resetWorkspaceBtn) {
      dom.resetWorkspaceBtn.addEventListener('click', resetWorkspace);
    }

    if (dom.jumpToQuickAccessBtn && dom.workspacePanel) {
      dom.jumpToQuickAccessBtn.addEventListener('click', function () {
        dom.content.scrollTo({
          top: dom.workspacePanel.offsetTop - 12,
          behavior: 'smooth'
        });
      });
    }

    // Back to top button
    if (dom.backToTop && dom.content) {
      dom.content.addEventListener('scroll', function () {
        dom.backToTop.classList.toggle('hidden', dom.content.scrollTop < 300);
      });
      dom.backToTop.addEventListener('click', function () {
        dom.content.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Sidebar search
    if (dom.sidebarSearch) {
      dom.sidebarSearch.addEventListener('input', function () {
        Sidebar.filterSidebarItems(this.value);
      });
    }

    document.addEventListener('click', function (e) {
      var quickFilter = e.target.closest('.quick-filter-card[data-quick-filter]');
      if (!quickFilter) return;

      var filterType = quickFilter.getAttribute('data-quick-filter');
      var filterValue = quickFilter.getAttribute('data-value');

      state.folderPath = [];

      if (filterType === 'brand') {
        state.sidebarFilter = 'brand:' + filterValue;
      } else {
        state.sidebarFilter = 'ext:' + filterValue;
      }

      Sidebar.setActiveItem(state.sidebarFilter);
      dom.currentFilter.textContent = filterValue;
      applyFiltersAndSearch();
      dom.content.scrollTo({ top: dom.workspacePanel.offsetTop, behavior: 'smooth' });
    });

    // Sidebar section toggles
    document.querySelectorAll('[data-toggle-section]').forEach(function (heading) {
      heading.addEventListener('click', function () {
        Sidebar.toggleSection(this);
      });
    });

    // Page number clicks
    if (dom.pageNumbers) {
      dom.pageNumbers.addEventListener('click', function (e) {
        var btn = e.target.closest('.btn-page-num');
        if (!btn) return;
        var page = parseInt(btn.getAttribute('data-page'), 10);
        if (page && page !== state.currentPage) {
          state.currentPage = page;
          renderFiles();
          updatePagination();
          dom.content.scrollTop = 0;
        }
      });
    }

    // Clear all filters button (in empty state)
    if (dom.clearAllFiltersBtn) {
      dom.clearAllFiltersBtn.addEventListener('click', function () {
        dom.searchInput.value = '';
        dom.searchClear.classList.add('hidden');
        state.searchQuery = '';
        state.filterBrand = '';
        state.filterExtension = '';
        state.filterName = '';
        state.sidebarFilter = 'all';
        state.folderPath = [];
        dom.filterBrand.value = '';
        dom.filterExtension.value = '';
        dom.filterName.value = '';
        Sidebar.setActiveItem('all');
        dom.currentFilter.textContent = 'All Files';
        applyFiltersAndSearch();
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
      FileRenderer.closeFileDialog();
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

    Keyboard.register('Alt+ArrowUp', 'Go up one folder', function () {
      if (state.folderPath.length > 0) {
        state.folderPath.pop();
        applyFiltersAndSearch();
      }
    });
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', function () {
    Theme.init();
    // Update theme toggle icon based on current theme
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      var icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = Theme.get() === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
    cacheDom();
    bindEvents();
    setupKeyboardShortcuts();
    loadData();
  });

})();
