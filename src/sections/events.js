sections.events = {};

sections.events.EventEmitter = (function () {
  var EventEmitter = function () {
    this.events = {};
  };

  var on = EventEmitter.prototype.on = function (eventName, handler, isOnce) {
    var events = this.events;
    if (typeof handler === 'function') {
      handler.once = !!isOnce;
      if (!events[eventName]) {
        events[eventName] = [];
      }
      events[eventName].push(handler);
    }
    return this;
  };

  var addEventListener = EventEmitter.prototype.addEventListener = on;

  var once = EventEmitter.prototype.once = function (eventName, handler) {
    return this.on(eventName, handler, true);
  };

  var off = EventEmitter.prototype.off = function (eventName, handler) {
    var events = this.events;
    if (typeof handler === 'function') {
      var handlers = events[eventName] || [];
      var len = handlers.length;
      while (len--) {
        if (handlers[len] === handler) {
          handlers.splice(len, 1);
        }
      }
    } else {
      delete events[eventName];
    }
    return this;
  };

  var removeEventListener = EventEmitter.prototype.removeEventListener = off;

  var emit = EventEmitter.prototype.emit = function (eventName) {
    var args = Array.prototype.slice.call(arguments, 1);
    var handlers = this.events[eventName] || [];
    var len = handlers.length;
    while (len--) {
      handlers[len].apply(this, args);
      if (handlers[len].once) {
        handlers.splice(len, 1);
      }
    }
    return this;
  };

  var trigger = EventEmitter.prototype.trigger = emit;

  return EventEmitter;
})();
