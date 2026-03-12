/**
 * GetwayROM File Explorer - File Renderer Module
 * Renders file cards (grid) and file rows (list)
 */

var GWR = window.GWR || {};

GWR.FileRenderer = (function () {
  'use strict';

  var Utils = GWR.Utils;

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

  function getIcon(fileType) {
    return FILE_ICONS[fileType] || FILE_ICONS.file;
  }

  function renderGridItem(file) {
    var iconClass = getIcon(file.fileType);
    return '<a href="' + Utils.escapeAttr(file.url) + '" target="_blank" rel="noopener noreferrer" class="file-card hover-lift" title="' + Utils.escapeAttr(file.name) + '">' +
      '<div class="file-card-icon ' + Utils.escapeAttr(file.fileType) + '">' +
      '<i class="' + iconClass + '"></i></div>' +
      '<div class="file-card-name">' + Utils.escapeHtml(file.name) + '</div>' +
      '<div class="file-card-meta">' +
      '<span class="file-card-brand">' + Utils.escapeHtml(file.brand) + '</span>' +
      '<span class="file-card-ext">' + Utils.escapeHtml(file.extension) + '</span>' +
      '</div>' +
      '<div class="file-card-download"><i class="fas fa-download"></i></div>' +
      '</a>';
  }

  function renderListItem(file) {
    var iconClass = getIcon(file.fileType);
    return '<a href="' + Utils.escapeAttr(file.url) + '" target="_blank" rel="noopener noreferrer" class="file-list-row" title="' + Utils.escapeAttr(file.name) + '">' +
      '<div class="list-row-icon ' + Utils.escapeAttr(file.fileType) + '">' +
      '<i class="' + iconClass + '"></i></div>' +
      '<div class="list-row-name">' + Utils.escapeHtml(file.name) + '</div>' +
      '<div class="list-row-brand">' + Utils.escapeHtml(file.brand) + '</div>' +
      '<div class="list-row-ext">' + Utils.escapeHtml(file.extension) + '</div>' +
      '<div class="list-row-action"><span class="btn-download"><i class="fas fa-download"></i> Download</span></div>' +
      '</a>';
  }

  function renderGrid(container, files) {
    var html = '';
    for (var i = 0; i < files.length; i++) {
      html += renderGridItem(files[i]);
    }
    container.innerHTML = html;
  }

  function renderList(container, files) {
    var html = '';
    for (var i = 0; i < files.length; i++) {
      html += renderListItem(files[i]);
    }
    container.innerHTML = html;
  }

  function renderSkeletonGrid(container, count) {
    var html = '';
    for (var i = 0; i < count; i++) {
      html += '<div class="skeleton skeleton-card"></div>';
    }
    container.innerHTML = html;
  }

  function renderSkeletonList(container, count) {
    var html = '';
    for (var i = 0; i < count; i++) {
      html += '<div class="skeleton skeleton-row"></div>';
    }
    container.innerHTML = html;
  }

  return {
    getIcon: getIcon,
    renderGrid: renderGrid,
    renderList: renderList,
    renderSkeletonGrid: renderSkeletonGrid,
    renderSkeletonList: renderSkeletonList
  };
})();

window.GWR = GWR;
