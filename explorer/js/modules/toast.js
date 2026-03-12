/**
 * GetwayROM File Explorer - Toast Notification Module
 * Non-intrusive notification system
 */

var GWR = window.GWR || {};

GWR.Toast = (function () {
  'use strict';

  var container = null;
  var DURATION = 4000;

  function ensureContainer() {
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function show(message, type) {
    type = type || 'info';
    var c = ensureContainer();

    var icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle',
      warning: 'fas fa-exclamation-triangle'
    };

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML =
      '<i class="toast-icon ' + (icons[type] || icons.info) + '"></i>' +
      '<span>' + message + '</span>' +
      '<button class="toast-close"><i class="fas fa-times"></i></button>';

    toast.querySelector('.toast-close').addEventListener('click', function () {
      dismiss(toast);
    });

    c.appendChild(toast);

    setTimeout(function () {
      dismiss(toast);
    }, DURATION);

    return toast;
  }

  function dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add('toast-out');
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }

  function success(message) { return show(message, 'success'); }
  function error(message) { return show(message, 'error'); }
  function info(message) { return show(message, 'info'); }
  function warning(message) { return show(message, 'warning'); }

  return {
    show: show,
    success: success,
    error: error,
    info: info,
    warning: warning
  };
})();

window.GWR = GWR;
