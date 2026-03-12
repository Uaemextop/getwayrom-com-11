/**
 * GetwayROM File Explorer - File Rendering Module
 * Renders files as grid cards or list rows.
 */
(function () {
  'use strict';

  var Utils = GWR.Utils;

  /**
   * Create HTML string for a single grid card.
   */
  function createFileCard(file) {
    var icon = Utils.getFileIcon(file.fileType);
    var iconClass = Utils.getFileIconClass(file.fileType);
    var name = Utils.escapeHtml(file.name);
    var brand = Utils.escapeHtml(file.brand);
    var ext = Utils.escapeHtml(file.extension);
    var url = Utils.escapeHtml(file.url);

    return '<div class="file-card" data-name="' + name + '">' +
      '<div class="file-card-icon ' + iconClass + '">' +
        '<i class="fas ' + icon + '"></i>' +
      '</div>' +
      '<div class="file-card-info">' +
        '<div class="file-card-name" title="' + name + '">' + name + '</div>' +
        '<div class="file-card-meta">' +
          '<span class="badge brand-badge">' + brand + '</span>' +
          '<span class="badge ext-badge">.' + ext + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="file-card-actions">' +
        '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="btn-download" title="Download">' +
          '<i class="fas fa-download"></i>' +
        '</a>' +
      '</div>' +
    '</div>';
  }

  /**
   * Create HTML string for a single list row.
   */
  function createFileRow(file) {
    var icon = Utils.getFileIcon(file.fileType);
    var iconClass = Utils.getFileIconClass(file.fileType);
    var name = Utils.escapeHtml(file.name);
    var brand = Utils.escapeHtml(file.brand);
    var ext = Utils.escapeHtml(file.extension);
    var url = Utils.escapeHtml(file.url);

    return '<div class="file-row">' +
      '<div class="list-col file-icon-small ' + iconClass + '">' +
        '<i class="fas ' + icon + '"></i>' +
      '</div>' +
      '<div class="list-col file-name" title="' + name + '">' + name + '</div>' +
      '<div class="list-col file-brand">' + brand + '</div>' +
      '<div class="list-col file-ext">.' + ext + '</div>' +
      '<div class="list-col file-actions">' +
        '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="btn-download" title="Download">' +
          '<i class="fas fa-download"></i>' +
        '</a>' +
      '</div>' +
    '</div>';
  }

  /**
   * Render files as grid cards into the given container.
   */
  function renderGrid(container, files) {
    var html = '';
    for (var i = 0; i < files.length; i++) {
      html += createFileCard(files[i]);
    }
    container.innerHTML = html;
  }

  /**
   * Render files as list rows into the given container.
   */
  function renderList(container, files) {
    var html = '';
    for (var i = 0; i < files.length; i++) {
      html += createFileRow(files[i]);
    }
    container.innerHTML = html;
  }

  /**
   * Render skeleton loading placeholder cards.
   */
  function renderSkeletonGrid(container, count) {
    var html = '';
    for (var i = 0; i < count; i++) {
      html += '<div class="skeleton-card">' +
        '<div class="skeleton-icon skeleton-pulse"></div>' +
        '<div class="skeleton-text skeleton-pulse"></div>' +
        '<div class="skeleton-text short skeleton-pulse"></div>' +
      '</div>';
    }
    container.innerHTML = html;
  }

  GWR.FileRenderer = {
    renderGrid: renderGrid,
    renderList: renderList,
    renderSkeletonGrid: renderSkeletonGrid,
    createFileCard: createFileCard,
    createFileRow: createFileRow
  };

})();
