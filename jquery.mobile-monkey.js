/*!
 * Mobile Monkey
 *
 * Based on jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * 
 * Modifications for generalized jQuery support by Tyler Sommer 
 * https://github.com/tyler-sommer
 */
(function ($, undefined) {

  // Detect touch support
  $.support.touch = 'ontouchend' in document;

  // Ignore browsers without touch support
  if (!$.support.touch) {
    return;
  }
  
  var console = console || { log: $.noop };

  function ObjectStore() {
    this.keys = [];
    this.values = {};
  }

  ObjectStore.prototype = {
    constructor : ObjectStore,

    get: function (key) {
      return this.values[this.keys.indexOf(key)];
    },
    
    set: function (key, value) {
      var id = this.keys.indexOf(key);
      if (id < 0) {
        id = this.keys.push(key);
      }

      this.values[id] = value;
    },

    increment: function (key, inc) {
      inc = inc || 1;
      var value = (this.get(key) || 0) + inc;

      this.set(key, value);

      return value;
    },

    decrement: function (key, dec) {
      dec = dec || 1;
      var value = (this.get(key) || 0) - dec;
      if (value < 0) {
        value = 0;
      }

      this.set(key, value);

      return value;
    }
  };

  var SimulatedMouse = function() {
    this._touchMoved = false;
  };
  var mouseProto = SimulatedMouse.prototype,
    touchHandled,
    tracking = new ObjectStore();

  mouseProto.bind = function(elements) {
    if (!elements instanceof jQuery) {
      elements = $(elements);
    }

    var self = this;
    elements.each(function(index, element) {
      if (tracking.increment(element) == 1) {
        console.log('Binding touch handlers for ', element);

        $(element).bind({
          touchstart: $.proxy(self, '_touchStart'),
          touchmove: $.proxy(self, '_touchMove'),
          touchend: $.proxy(self, '_touchEnd')
        });
      }
    });
  };

  mouseProto.unbind = function(elements) {
    if (!elements instanceof jQuery) {
      elements = $(elements);
    }

    var self = this;
    elements.each(function(index, element) {
      if (tracking.decrement(element) <= 0) {
        console.log('Removing touch handlers for ', element);

        $(element).unbind({
          touchstart: $.proxy(self, '_touchStart'),
          touchmove: $.proxy(self, '_touchMove'),
          touchend: $.proxy(self, '_touchEnd')
        });
      }
    });
  };

  /**
   * Simulate a mouse event based on a corresponding touch event
   * @param {Object} event A touch event
   * @param {String} simulatedType The corresponding mouse event
   */
  mouseProto.simulateMouseEvent = function(event, simulatedType) {
    // Ignore multi-touch events
    if (event.originalEvent.touches.length > 1) {
      return;
    }

    if (event.type !== 'touchmove') {
      event.preventDefault();
    }

    var touch = event.originalEvent.changedTouches[0],
      simulatedEvent = document.createEvent('MouseEvents');

    // Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
      simulatedType,    // type
      true,             // bubbles                    
      true,             // cancelable                 
      window,           // view                       
      1,                // detail                     
      touch.screenX,    // screenX                    
      touch.screenY,    // screenY                    
      touch.clientX,    // clientX                    
      touch.clientY,    // clientY                    
      false,            // ctrlKey                    
      false,            // altKey                     
      false,            // shiftKey                   
      false,            // metaKey                    
      0,                // button                     
      null              // relatedTarget              
    );

    console.log('Dispatching simulated event', simulatedType, 'for real event', event.type, event.target);

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
  };

  /**
   * Handle the jQuery UI widget's touchstart events
   * @param {Object} event The widget element's touchstart event
   */
  mouseProto._touchStart = function (event) {

    var self = this;

    // Ignore the event if another widget is already being handled
    if (touchHandled) {
      return;
    }

    // Set the flag to prevent other widgets from inheriting the touch event
    touchHandled = true;

    // Track movement to determine if interaction was a click
    self._touchMoved = false;

    // Simulate the mouseover event
    self.simulateMouseEvent(event, 'mouseover');

    // Simulate the mousemove event
    self.simulateMouseEvent(event, 'mousemove');

    // Simulate the mousedown event
    self.simulateMouseEvent(event, 'mousedown');
  };

  /**
   * Handle the jQuery UI widget's touchmove events
   * @param {Object} event The document's touchmove event
   */
  mouseProto._touchMove = function (event) {

    var self = this;

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Interaction was not a click
    self._touchMoved = true;

    // Simulate the mousemove event
    self.simulateMouseEvent(event, 'mousemove');
  };

  /**
   * Handle the jQuery UI widget's touchend events
   * @param {Object} event The document's touchend event
   */
  mouseProto._touchEnd = function (event) {

    var self = this;

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Simulate the mouseup event
    self.simulateMouseEvent(event, 'mouseup');

    // Simulate the mouseout event
    self.simulateMouseEvent(event, 'mouseout');

    // If the touch interaction did not move, it should trigger a click
    if (!self._touchMoved) {

      // Simulate the click event
      self.simulateMouseEvent(event, 'click');
    }

    // Unset the flag to allow other widgets to inherit the touch event
    touchHandled = false;
  };

  var mouse = new SimulatedMouse();

  var jQueryOn = $.prototype.on;
  $.prototype.on = function(types, selector, data, handler) {
    if (this.length > 0
      && typeof(types) === 'string'
      && !this.is(document)
      && (selector instanceof Function || ((data instanceof Function || handler instanceof Function) && !selector))
      && types.indexOf('click') === 0 // TODO: Allow more than only click events
    ) {
      mouse.bind(this);
    }

    return jQueryOn.apply(this, arguments);
  };

  var jQueryOff = $.prototype.off;
  $.prototype.off = function(types) {
    if (this.length > 0
      && typeof(types) === 'string'
      && !this.is(document)
      && types.indexOf('click') === 0 // TODO: Allow more than only click events
    ) {
      mouse.unbind(this);
    }

    return jQueryOff.apply(this, arguments);
  };

})(jQuery);