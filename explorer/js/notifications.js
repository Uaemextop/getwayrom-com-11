/**
 * GetwayROM File Explorer - Toast Notifications Module
 */
(function () {
  'use strict';

  var container = null;

  var typeIcons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    info: 'fa-circle-info',
    warning: 'fa-triangle-exclamation'
  };

  /**
   * Initialize the toast container. Creates it if it does not exist.
   */
  function init() {
    container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }
  }

  /**
   * Ensure the container exists before showing a toast.
   */
  function ensureContainer() {
    if (!container) {
      init();
    }
  }

  /**
   * Show a toast notification.
   * @param {string} message - The message to display
   * @param {string} type - 'success', 'error', 'info', or 'warning'
   * @param {number} duration - Auto-dismiss in ms (default 3000)
   */
  function show(message, type, duration) {
    ensureContainer();

    type = type || 'info';
    duration = duration || 3000;

    var icon = typeIcons[type] || typeIcons.info;
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;

    toast.innerHTML =
      '<div class="toast-icon"><i class="fas ' + icon + '"></i></div>' +
      '<div class="toast-message">' + GWR.Utils.escapeHtml(message) + '</div>' +
      '<button class="toast-close"><i class="fas fa-times"></i></button>';

    // Slide-in animation
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    toast.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

    container.appendChild(toast);

    // Trigger reflow, then animate in
    var _ = toast.offsetHeight;
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', function () {
      removeToast(toast);
    });

    // Auto-remove after duration
    setTimeout(function () {
      removeToast(toast);
    }, duration);
  }

  /**
   * Remove a toast with slide-out animation.
   */
  function removeToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  function success(message) {
    show(message, 'success');
  }

  function error(message) {
    show(message, 'error');
  }

  function info(message) {
    show(message, 'info');
  }

  function warning(message) {
    show(message, 'warning');
  }

  GWR.Toast = {
    init: init,
    show: show,
    success: success,
    error: error,
    info: info,
    warning: warning
  };

})();
