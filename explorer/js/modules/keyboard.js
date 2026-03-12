/**
 * GetwayROM File Explorer - Keyboard Shortcuts Module
 * Global keyboard navigation and shortcuts
 */

var GWR = window.GWR || {};

GWR.Keyboard = (function () {
  'use strict';

  var shortcuts = [];
  var helpVisible = false;

  function init() {
    document.addEventListener('keydown', handleKeydown);
  }

  function register(key, description, handler, options) {
    options = options || {};
    shortcuts.push({
      key: key,
      description: description,
      handler: handler,
      ctrl: options.ctrl || false,
      shift: options.shift || false,
      alt: options.alt || false
    });
  }

  function handleKeydown(e) {
    // Skip if user is typing in an input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      // Only handle Escape in inputs
      if (e.key === 'Escape') {
        e.target.blur();
      }
      return;
    }

    for (var i = 0; i < shortcuts.length; i++) {
      var s = shortcuts[i];
      if (e.key === s.key &&
          (!s.ctrl || (e.ctrlKey || e.metaKey)) &&
          (!s.shift || e.shiftKey) &&
          (!s.alt || e.altKey)) {
        e.preventDefault();
        s.handler(e);
        return;
      }
    }
  }

  function getShortcuts() {
    return shortcuts.map(function (s) {
      var keyCombo = '';
      if (s.ctrl) keyCombo += 'Ctrl + ';
      if (s.shift) keyCombo += 'Shift + ';
      if (s.alt) keyCombo += 'Alt + ';
      keyCombo += s.key.length === 1 ? s.key.toUpperCase() : s.key;
      return { combo: keyCombo, description: s.description };
    });
  }

  function showHelp() {
    if (helpVisible) return;
    helpVisible = true;

    var shortcuts_list = getShortcuts();
    var html = '<div class="modal-backdrop" id="shortcutModal">' +
      '<div class="modal">' +
      '<div class="modal-header">' +
      '<h3><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h3>' +
      '<button class="btn-icon" id="closeShortcuts"><i class="fas fa-times"></i></button>' +
      '</div>' +
      '<div class="modal-body">' +
      '<table style="width:100%;border-collapse:collapse;">';

    shortcuts_list.forEach(function (s) {
      html += '<tr style="border-bottom:1px solid var(--border-light);">' +
        '<td style="padding:8px 0;"><kbd class="kbd">' + s.combo + '</kbd></td>' +
        '<td style="padding:8px 12px;color:var(--text-secondary);">' + s.description + '</td>' +
        '</tr>';
    });

    html += '</table></div>' +
      '<div class="modal-footer">' +
      '<button class="btn btn-primary" id="closeShortcutsBtn">Got it</button>' +
      '</div></div></div>';

    document.body.insertAdjacentHTML('beforeend', html);

    var closeModal = function () {
      var modal = document.getElementById('shortcutModal');
      if (modal) modal.remove();
      helpVisible = false;
    };

    document.getElementById('closeShortcuts').addEventListener('click', closeModal);
    document.getElementById('closeShortcutsBtn').addEventListener('click', closeModal);
    document.getElementById('shortcutModal').addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
  }

  return {
    init: init,
    register: register,
    getShortcuts: getShortcuts,
    showHelp: showHelp
  };
})();

window.GWR = GWR;
