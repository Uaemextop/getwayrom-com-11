/**
 * GetwayROM File Explorer - Event Bus Module
 * Lightweight publish/subscribe system for decoupled module communication.
 */
(function () {
  'use strict';

  var listeners = {};

  /**
   * Subscribe to an event.
   * @param {string} event - Event name
   * @param {Function} callback - Handler function
   * @returns {Function} Unsubscribe function
   */
  function on(event, callback) {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(callback);

    // Return unsubscribe function
    return function () {
      off(event, callback);
    };
  }

  /**
   * Subscribe to an event once (auto-unsubscribes after first call).
   * @param {string} event - Event name
   * @param {Function} callback - Handler function
   */
  function once(event, callback) {
    var unsub = on(event, function () {
      callback.apply(null, arguments);
      unsub();
    });
  }

  /**
   * Unsubscribe a specific callback from an event.
   * @param {string} event - Event name
   * @param {Function} callback - The callback to remove
   */
  function off(event, callback) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(function (fn) {
      return fn !== callback;
    });
  }

  /**
   * Emit an event with optional data payload.
   * @param {string} event - Event name
   * @param {*} data - Data to pass to handlers
   */
  function emit(event, data) {
    if (!listeners[event]) return;
    var handlers = listeners[event].slice();
    for (var i = 0; i < handlers.length; i++) {
      try {
        handlers[i](data);
      } catch (e) {
        // Prevent one bad handler from breaking others
        if (typeof console !== 'undefined') {
          console.error('[EventBus] Error in handler for "' + event + '":', e);
        }
      }
    }
  }

  /**
   * Remove all listeners for a specific event, or all events.
   * @param {string} [event] - Optional event name; omit to clear all
   */
  function clear(event) {
    if (event) {
      delete listeners[event];
    } else {
      listeners = {};
    }
  }

  /**
   * Get the count of listeners for an event.
   * @param {string} event - Event name
   * @returns {number}
   */
  function listenerCount(event) {
    return listeners[event] ? listeners[event].length : 0;
  }

  GWR.EventBus = {
    on: on,
    once: once,
    off: off,
    emit: emit,
    clear: clear,
    listenerCount: listenerCount
  };

})();
