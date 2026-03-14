/**
 * GetwayROM File Explorer - Virtual List Module
 * Optimized rendering for large file lists using DOM recycling.
 * Only renders visible items plus a small buffer for smooth scrolling.
 */
(function () {
  'use strict';

  var ITEM_HEIGHT = 44;     // pixels per row
  var BUFFER_COUNT = 10;    // extra items above/below viewport
  var SCROLL_THROTTLE = 16; // ~60fps

  /**
   * Create a new virtual list instance.
   * @param {Object} options
   * @param {HTMLElement} options.container - The scrollable container
   * @param {HTMLElement} options.listEl - The list body element to render into
   * @param {Function} options.renderItem - Function(item, index) returning HTML string
   * @param {number} [options.itemHeight] - Override default row height
   * @returns {Object} Virtual list controller
   */
  function create(options) {
    var container = options.container;
    var listEl = options.listEl;
    var renderItem = options.renderItem;
    var itemHeight = options.itemHeight || ITEM_HEIGHT;

    var items = [];
    var scrollHandler = null;
    var sentinel = null;
    var lastStart = -1;
    var lastEnd = -1;
    var isActive = false;

    /**
     * Set the items array and trigger re-render.
     * @param {Array} newItems
     */
    function setItems(newItems) {
      items = newItems || [];
      lastStart = -1;
      lastEnd = -1;
      render();
    }

    /**
     * Calculate visible range based on scroll position.
     * @returns {{ start: number, end: number }}
     */
    function getVisibleRange() {
      var scrollTop = container.scrollTop || 0;
      var viewportHeight = container.clientHeight || 500;

      var start = Math.floor(scrollTop / itemHeight) - BUFFER_COUNT;
      var end = Math.ceil((scrollTop + viewportHeight) / itemHeight) + BUFFER_COUNT;

      start = Math.max(0, start);
      end = Math.min(items.length, end);

      return { start: start, end: end };
    }

    /**
     * Render visible items into the list element.
     */
    function render() {
      if (!listEl) return;

      var totalHeight = items.length * itemHeight;

      // If few items, render all directly (no virtualization needed)
      if (items.length <= 200) {
        var html = '';
        for (var i = 0; i < items.length; i++) {
          html += renderItem(items[i], i);
        }
        listEl.style.height = '';
        listEl.style.position = '';
        listEl.innerHTML = html;
        lastStart = 0;
        lastEnd = items.length;
        return;
      }

      var range = getVisibleRange();

      // Skip if range hasn't changed
      if (range.start === lastStart && range.end === lastEnd) return;

      lastStart = range.start;
      lastEnd = range.end;

      // Build visible HTML
      var visibleHtml = '';
      for (var j = range.start; j < range.end; j++) {
        visibleHtml += renderItem(items[j], j);
      }

      // Use padding to maintain total scroll height
      var topPadding = range.start * itemHeight;
      var bottomPadding = Math.max(0, (items.length - range.end) * itemHeight);

      listEl.style.position = 'relative';
      listEl.style.height = totalHeight + 'px';
      listEl.innerHTML =
        '<div style="height:' + topPadding + 'px"></div>' +
        visibleHtml +
        '<div style="height:' + bottomPadding + 'px"></div>';
    }

    /**
     * Attach scroll listener for virtual updates.
     */
    function activate() {
      if (isActive) return;
      isActive = true;

      var throttleTimer = null;
      scrollHandler = function () {
        if (throttleTimer) return;
        throttleTimer = setTimeout(function () {
          throttleTimer = null;
          render();
        }, SCROLL_THROTTLE);
      };

      container.addEventListener('scroll', scrollHandler, { passive: true });
    }

    /**
     * Detach scroll listener.
     */
    function deactivate() {
      if (!isActive) return;
      isActive = false;
      if (scrollHandler) {
        container.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;
      }
    }

    /**
     * Get the current items array.
     * @returns {Array}
     */
    function getItems() {
      return items;
    }

    /**
     * Destroy the virtual list and clean up.
     */
    function destroy() {
      deactivate();
      items = [];
      if (listEl) {
        listEl.innerHTML = '';
        listEl.style.height = '';
        listEl.style.position = '';
      }
    }

    return {
      setItems: setItems,
      render: render,
      activate: activate,
      deactivate: deactivate,
      getItems: getItems,
      destroy: destroy
    };
  }

  GWR.VirtualList = {
    create: create
  };

})();
