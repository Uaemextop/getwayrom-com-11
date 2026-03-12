/**
 * GetwayROM File Explorer - Keyboard Shortcuts Module
 */
(function () {
  'use strict';

  var shortcuts = {};

  /**
   * Check if the currently focused element is an input field.
   */
  function isTyping() {
    var tag = document.activeElement && document.activeElement.tagName;
    if (!tag) return false;
    tag = tag.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select';
  }

  /**
   * Initialize the keyboard shortcut listener.
   */
  function init() {
    document.addEventListener('keydown', function (e) {
      // Don't fire shortcuts when user is typing in a form field
      if (isTyping()) return;

      var key = e.key;
      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key].callback();
      }
    });
  }

  /**
   * Register a keyboard shortcut.
   */
  function register(key, description, callback) {
    shortcuts[key] = {
      key: key,
      description: description,
      callback: callback
    };
  }

  /**
   * Unregister a keyboard shortcut.
   */
  function unregister(key) {
    delete shortcuts[key];
  }

  /**
   * Show a modal listing all registered shortcuts.
   */
  function showHelp() {
    // Remove existing modal if present
    hideHelp();

    var overlay = document.createElement('div');
    overlay.className = 'shortcuts-overlay';

    var modal = document.createElement('div');
    modal.className = 'shortcuts-modal';

    var html = '<h3>Keyboard Shortcuts</h3><ul>';
    var keys = Object.keys(shortcuts);
    for (var i = 0; i < keys.length; i++) {
      var s = shortcuts[keys[i]];
      html += '<li>' +
        '<kbd>' + GWR.Utils.escapeHtml(s.key) + '</kbd>' +
        '<span>' + GWR.Utils.escapeHtml(s.description) + '</span>' +
      '</li>';
    }
    html += '</ul>' +
      '<button class="shortcuts-close">Close</button>';

    modal.innerHTML = html;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        hideHelp();
      }
    });

    // Close on button click
    modal.querySelector('.shortcuts-close').addEventListener('click', function () {
      hideHelp();
    });
  }

  /**
   * Hide the shortcuts modal.
   */
  function hideHelp() {
    var existing = document.querySelector('.shortcuts-overlay');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
  }

  GWR.Keyboard = {
    init: init,
    register: register,
    unregister: unregister,
    showHelp: showHelp,
    hideHelp: hideHelp
  };

})();
