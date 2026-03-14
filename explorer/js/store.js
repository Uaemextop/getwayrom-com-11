/**
 * GetwayROM File Explorer - Centralized State Store
 * Single source of truth for application state with change notifications.
 * Uses EventBus for reactive state updates across modules.
 */
(function () {
  'use strict';

  var EventBus = GWR.EventBus;

  // Default state shape
  var state = {
    allFiles: [],
    filteredFiles: [],
    currentPage: 1,
    totalPages: 1,
    viewMode: 'list',
    sortBy: 'name-asc',
    searchQuery: '',
    filterBrand: '',
    filterExtension: '',
    filterName: '',
    sidebarFilter: 'all',
    folderPath: [],
    metadata: null,
    isLoading: true,
    error: null
  };

  /**
   * Get the full state object reference.
   * Note: Returns direct reference for read performance.
   * Always use Store.set() to modify state to ensure change notifications fire.
   * @returns {Object}
   */
  function getState() {
    return state;
  }

  /**
   * Get a specific state property.
   * @param {string} key
   * @returns {*}
   */
  function get(key) {
    return state[key];
  }

  /**
   * Update one or more state properties.
   * Emits 'state:change' with the changed keys, plus 'state:<key>' for each key.
   * @param {Object} updates - Key-value pairs to update
   */
  function set(updates) {
    var changedKeys = [];
    var key;

    for (key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (state[key] !== updates[key]) {
          state[key] = updates[key];
          changedKeys.push(key);
        }
      }
    }

    if (changedKeys.length > 0) {
      EventBus.emit('state:change', { keys: changedKeys, state: state });
      for (var i = 0; i < changedKeys.length; i++) {
        EventBus.emit('state:' + changedKeys[i], state[changedKeys[i]]);
      }
    }
  }

  /**
   * Reset state to initial defaults (preserving allFiles and metadata).
   */
  function resetFilters() {
    set({
      searchQuery: '',
      filterBrand: '',
      filterExtension: '',
      filterName: '',
      sidebarFilter: 'all',
      folderPath: [],
      currentPage: 1,
      sortBy: 'name-asc'
    });
  }

  /**
   * Subscribe to state changes for a specific key.
   * @param {string} key - State key to watch
   * @param {Function} callback - Handler receiving the new value
   * @returns {Function} Unsubscribe function
   */
  function watch(key, callback) {
    return EventBus.on('state:' + key, callback);
  }

  /**
   * Subscribe to any state change.
   * @param {Function} callback - Handler receiving { keys, state }
   * @returns {Function} Unsubscribe function
   */
  function onChange(callback) {
    return EventBus.on('state:change', callback);
  }

  GWR.Store = {
    getState: getState,
    get: get,
    set: set,
    resetFilters: resetFilters,
    watch: watch,
    onChange: onChange
  };

})();
