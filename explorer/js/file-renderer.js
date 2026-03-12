/**
 * GetwayROM File Explorer - File Rendering Module
 * Renders files as grid cards or list rows with click-to-detail dialog.
 */
(function () {
  'use strict';

  var Utils = GWR.Utils;

  /**
   * Create HTML string for a single grid card.
   * Clicking the card opens the file detail dialog.
   */
  function createFileCard(file) {
    var icon = Utils.getFileIcon(file.fileType);
    var iconClass = Utils.getFileIconClass(file.fileType);
    var brandIcon = Utils.getBrandIcon(file.brand);
    var brandClass = Utils.getBrandColorClass(file.brand);
    var name = Utils.escapeHtml(file.name);
    var brand = Utils.escapeHtml(file.brand);
    var ext = Utils.escapeHtml(file.extension);

    return '<div class="file-card" data-file-name="' + name + '" data-file-url="' + Utils.escapeHtml(file.url) + '" data-file-brand="' + brand + '" data-file-ext="' + ext + '" data-file-type="' + Utils.escapeHtml(file.fileType) + '">' +
      '<div class="file-card-icon ' + iconClass + '">' +
        '<i class="fas ' + icon + '"></i>' +
      '</div>' +
      '<div class="file-card-info">' +
        '<div class="file-card-name" title="' + name + '">' + name + '</div>' +
        '<div class="file-card-meta">' +
          '<span class="badge brand-badge ' + brandClass + '"><i class="fas ' + brandIcon + '"></i> ' + brand + '</span>' +
          '<span class="badge ext-badge">.' + ext + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /**
   * Create HTML string for a single list row.
   */
  function createFileRow(file) {
    var icon = Utils.getFileIcon(file.fileType);
    var iconClass = Utils.getFileIconClass(file.fileType);
    var brandIcon = Utils.getBrandIcon(file.brand);
    var name = Utils.escapeHtml(file.name);
    var brand = Utils.escapeHtml(file.brand);
    var ext = Utils.escapeHtml(file.extension);

    return '<div class="file-row" data-file-name="' + name + '" data-file-url="' + Utils.escapeHtml(file.url) + '" data-file-brand="' + brand + '" data-file-ext="' + ext + '" data-file-type="' + Utils.escapeHtml(file.fileType) + '">' +
      '<div class="list-col file-icon-small ' + iconClass + '">' +
        '<i class="fas ' + icon + '"></i>' +
      '</div>' +
      '<div class="list-col file-name" title="' + name + '">' + name + '</div>' +
      '<div class="list-col file-brand"><i class="fas ' + brandIcon + '"></i> ' + brand + '</div>' +
      '<div class="list-col file-ext">.' + ext + '</div>' +
      '<div class="list-col file-actions">' +
        '<button class="btn-download btn-sm" title="Details">' +
          '<i class="fas fa-info-circle"></i>' +
        '</button>' +
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
      html += '<div class="skeleton-card skeleton"></div>';
    }
    container.innerHTML = html;
  }

  /**
   * Open a file detail dialog.
   */
  function openFileDialog(fileData) {
    closeFileDialog();

    var icon = Utils.getFileIcon(fileData.type);
    var iconClass = Utils.getFileIconClass(fileData.type);
    var brandIcon = Utils.getBrandIcon(fileData.brand);
    var brandClass = Utils.getBrandColorClass(fileData.brand);

    var backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'fileDetailBackdrop';

    var modal = document.createElement('div');
    modal.className = 'modal file-detail-modal';
    modal.innerHTML =
      '<div class="modal-header">' +
        '<h3><i class="fas fa-file-circle-info"></i> File Details</h3>' +
        '<button class="btn-icon modal-close-btn" id="modalCloseBtn" title="Close">' +
          '<i class="fas fa-times"></i>' +
        '</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="file-detail-icon ' + iconClass + '">' +
          '<i class="fas ' + icon + '"></i>' +
        '</div>' +
        '<div class="file-detail-name">' + Utils.escapeHtml(fileData.name) + '</div>' +
        '<div class="file-detail-meta">' +
          '<div class="detail-row">' +
            '<span class="detail-label"><i class="fas fa-tag"></i> Provider</span>' +
            '<span class="detail-value ' + brandClass + '"><i class="fas ' + brandIcon + '"></i> ' + Utils.escapeHtml(fileData.brand) + '</span>' +
          '</div>' +
          '<div class="detail-row">' +
            '<span class="detail-label"><i class="fas fa-file"></i> Type</span>' +
            '<span class="detail-value">.' + Utils.escapeHtml(fileData.ext) + ' (' + Utils.escapeHtml(fileData.type) + ')</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-secondary" id="modalCancelBtn"><i class="fas fa-times"></i> Close</button>' +
        '<a href="' + Utils.escapeHtml(fileData.url) + '" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-download-lg">' +
          '<i class="fas fa-download"></i> Download' +
        '</a>' +
      '</div>';

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Event listeners for closing
    var closeBtn = document.getElementById('modalCloseBtn');
    var cancelBtn = document.getElementById('modalCancelBtn');

    function handleClose() {
      closeFileDialog();
    }

    if (closeBtn) closeBtn.addEventListener('click', handleClose);
    if (cancelBtn) cancelBtn.addEventListener('click', handleClose);

    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) {
        handleClose();
      }
    });

    // ESC key to close
    function handleEsc(e) {
      if (e.key === 'Escape') {
        handleClose();
        document.removeEventListener('keydown', handleEsc);
      }
    }
    document.addEventListener('keydown', handleEsc);
  }

  /**
   * Close file detail dialog if open.
   */
  function closeFileDialog() {
    var existing = document.getElementById('fileDetailBackdrop');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
    document.body.style.overflow = '';
  }

  GWR.FileRenderer = {
    renderGrid: renderGrid,
    renderList: renderList,
    renderSkeletonGrid: renderSkeletonGrid,
    createFileCard: createFileCard,
    createFileRow: createFileRow,
    openFileDialog: openFileDialog,
    closeFileDialog: closeFileDialog
  };

})();
