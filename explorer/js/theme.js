/**
 * GetwayROM File Explorer - Theme Management Module
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'gwr-theme';
  var currentTheme = 'light';

  /**
   * Apply the given theme to the document.
   */
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
  }

  /**
   * Initialize theme: load from localStorage or detect system preference.
   */
  function init() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // localStorage not available
    }

    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  }

  /**
   * Toggle between light and dark themes. Returns the new theme name.
   */
  function toggle() {
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    set(newTheme);
    return newTheme;
  }

  /**
   * Get the current theme name.
   */
  function get() {
    return currentTheme;
  }

  /**
   * Set a specific theme and persist it.
   */
  function set(theme) {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // localStorage not available
    }
  }

  GWR.Theme = {
    init: init,
    toggle: toggle,
    get: get,
    set: set
  };

})();
