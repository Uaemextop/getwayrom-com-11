/**
 * GetwayROM File Explorer - Theme Module
 * Dark/light mode toggling with system preference detection
 */

var GWR = window.GWR || {};

GWR.Theme = (function () {
  'use strict';

  var STORAGE_KEY = 'gwr-theme';
  var currentTheme = 'light';

  function init() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      currentTheme = saved;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentTheme = 'dark';
    }
    apply(currentTheme);
    bindSystemListener();
  }

  function apply(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleButton();
  }

  function toggle() {
    apply(currentTheme === 'dark' ? 'light' : 'dark');
    return currentTheme;
  }

  function get() {
    return currentTheme;
  }

  function updateToggleButton() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    var icon = btn.querySelector('i');
    if (icon) {
      icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    btn.title = currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  }

  function bindSystemListener() {
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem(STORAGE_KEY)) {
          apply(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  return {
    init: init,
    toggle: toggle,
    get: get,
    apply: apply
  };
})();

window.GWR = GWR;
