sections.proto = new sections.events.EventEmitter();

sections.proto.init = function () {
  this.__started = false;
  this.__init = true;
  this.__prefix = null;
  this.detectCSSPrefix();
  this.getSections();
  this.updateWindowSize();
  this.getScrollHeight();
  this.addWindowResizeHandler();
  this.addScrollHandler();
  this.addStopHandler();
  this.updateProgress();
  this.lazyApply();
  return this;
};

sections.proto.detectCSSPrefix = function () {
  this.__prefix = sections.utils.getVendorPrefix();
};

sections.proto.getScrollHeight = function () {
  var body = document.body;
  var documentElement = document.documentElement;
  this.scrollHeight = body.scrollHeight || documentElement.scrollHeight || 0;
  return this;
};

sections.proto.getSections = function () {
  this.sections = [];
  var elements = document.getElementsByClassName(this.config.className);
  sections.utils.forEach(elements, (function (element) {
    this.sections.push(new sections.Section(element, this));
  }).bind(this));
  return this;
};

sections.proto.start = function () {
  if (!this.__started) {
    this.__started = true;
    this.emit('started');
    this.loop();
  }
  return this;
};

sections.proto.stop = function () {
  this.cancelAnimationFrame(this.__intervalID);
  this.__started = false;
};

sections.proto.loop = function () {
  var step = (function () {
    if (this.__started) {
      var scrollOffset = {x: 0, y: 0};
      if (window.pageYOffset) {
        scrollOffset.y = window.pageYOffset;
        scrollOffset.x = window.pageXOffset;
      } else if (document.body && document.body.scrollLeft) {
        scrollOffset.y = document.body.scrollTop;
        scrollOffset.x = document.body.scrollLeft;
      } else if (document.documentElement && document.documentElement.scrollLeft) {
        scrollOffset.y = document.documentElement.scrollTop;
        scrollOffset.x = document.documentElement.scrollLeft;
      }
      this.top = scrollOffset.y;
      this.left = scrollOffset.x;
      this.checkCurrentSection();
      this.updateProgress();
      this.__intervalID = this.requestAnimationFrame(step, this.config.interval);
    }
  }).bind(this);
  step();
};

sections.proto.requestAnimationFrame = function (cb, interval) {
  return (window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || setTimeout)(cb);
};

sections.proto.cancelAnimationFrame = function (id) {
  (window.cancelAnimationFrame
    || window.mozcancelAnimationFrame
    || window.webkitcancelAnimationFrame
    || window.mscancelAnimationFrame
    || setInterval)(id);
};

sections.proto.updateWindowSize = function () {
  var documentElement = document.documentElement;
  var body = document.body;
  var width = window.innerWidth || documentElement.clientWidth || body.clientWidth;
  var height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
  this.width = width;
  this.height = height;
  if (this.config.autoSectionHeight) {
    this.each(function (index, section) {
      section.setCSS({height: height + 'px'});
      section.updatePosition();
    });
  }
  return this;
};

sections.proto.addWindowResizeHandler = function () {
  var onResize = (function () {
    this.updateWindowSize();
  }).bind(this);
  window.addEventListener('resize', onResize);
  onResize();
  return this;
};

sections.proto.addScrollHandler = function () {
  window.addEventListener('scroll', (function () {
    this.start();
  }).bind(this));
};

sections.proto.addStopHandler = function () {
  this.on('stop', (function () {
    this.stop();
    this.emit('stopped');
  }).bind(this));
};

sections.proto.checkCurrentSection = function () {
  var prevIndex = this.__currentIndex;
  this.each((function (index, section) {
    if (this.top >= section.top && this.top < section.top + section.getHeight() && index !== prevIndex) {
      this.__currentIndex = index;
      var prev = this.get(prevIndex);
      var current = this.get(index);
      this.emit('changed', current, prev);
      if (prev) {
        prev.emit("scrollOut", prevIndex < index ? 1 : -1);
      }
      current.emit("scrollIn", prevIndex > index ? 1 : -1);
      return false;
    }
  }).bind(this));
  return this;
};

sections.proto.updateProgress = function () {
  var last = this.last();
  var progress = (this.top / (this.scrollHeight - last.getHeight())) * 100;
  if (this.progress === progress) {
    this.emit('stop');
  } else {
    this.progress = progress;
    this.emit('progress', progress);
  }
  this.each((function (index, section) {
    section.updateProgress(this.top, this.height);
  }).bind(this));
  return this;
};

sections.proto.lazyApply = function () {
  var allfn = this.__lazyApply;
  var len = allfn.length;
  while (len--) {
    allfn[len]();
  }
  return this;
};

sections.proto.current = function () {
  return this.get(this.currentIndex());
};

sections.proto.last = function () {
  return this.get(this.sections.length - 1);
};

sections.proto.first = function () {
  return this.get(0);
};

sections.proto.currentIndex = function () {
  return this.__currentIndex | 0;
};

sections.proto.get = function (index) {
  return this.sections[index] || null;
};

sections.proto.section = function (index, fn) {
  if (!this.__init) {
    this.__lazyApply.push((function () {
      this.section(index, fn);
    }).bind(this));
  } else {
    if (typeof fn === 'function') {
      switch (index) {
      case 'first':
        index = 0;
        break;
      case 'last':
        index = this.sections.length - 1;
        break;
      default:
        index = index | 0;
      }
      var section = this.get(index);
      if (section) {
        fn.call(section, section);
      }
    }
  }
  return this;
};

sections.proto.each = function (fn) {
  sections.utils.forEach(this.sections, function (val, i) {
    if (fn.call(val, i, val) === false) {
      return false;
    };
  });
  return this;
};
