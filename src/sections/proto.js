sections.proto = new sections.events.EventEmitter();

sections.proto.start = function () {
  this.__started = true;
  this.getSections();
  this.updateWindowSize();
  this.__intervalID = this.setInterval();
  this.getScrollHeight();
  this.addWindowResizeHandler();
  this.updateProgress();
  this.lazyApply();
  return this;
};

sections.proto.stop = function () {
  this.cancelAnimationFrame(this.__intervalID);
};

sections.proto.getScrollHeight = function () {
  var body = document.body;
  var documentElement = document.documentElement;
  this.scrollHeight = body.scrollHeight || documentElement.scrollHeight || 0;
  return this;
};

sections.proto.getSections = function () {
  this.sections = [];
  var elements = document.getElementsByClassName(this.config.className) || [];
  var len = elements.length;
  var index;
  for (index = 0; index < len; index += 1) {
    this.sections.push(new sections.Section(elements[index]));
  }
  return this;
};

sections.proto.setInterval = function () {
  var that = this;
  var step = function () {
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
    that.top = scrollOffset.y;
    that.left = scrollOffset.x;
    that.checkCurrentSection();
    that.updateProgress();
    that.requestAnimationFrame(step, that.config.interval);
  };
  step();
  return this;
};

sections.proto.requestAnimationFrame = function (cb, interval) {
  return (window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || setInterval)(cb);
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
  var that = this;
  var onResize = function () {
    that.updateWindowSize();
  };
  window.addEventListener('resize', onResize);
  onResize();
  return this;
};

sections.proto.checkCurrentSection = function () {
  var that = this;
  var prevIndex = this.__currentIndex;
  this.each(function (index, section) {
    if (that.top >= section.top && that.top < section.top + section.getHeight() && index !== prevIndex) {
      that.__currentIndex = index;
      var prev = that.get(prevIndex);
      var current = that.get(index);
      that.emit('changed', current, prev);
      if (prev) {
        prev.emit("scrollOut", prevIndex < index ? 1 : -1);
      }
      current.emit("scrollIn", prevIndex > index ? 1 : -1);
      return false;
    }
  });
  return this;
};

sections.proto.updateProgress = function () {
  var last = this.last();
  var that = this;
  var progress = (this.top / (this.scrollHeight - last.getHeight())) * 100;
  if (this.progress !== progress) {
    this.progress = progress;
    this.emit('progress', progress);
  }
  this.each(function (index, section) {
    section.updateProgress(that.top, that.height);
  });
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
  if (!this.__started) {
    var that = this;
    this.__lazyApply.push(function () {
      that.section(index, fn);
    });
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
  var items = this.sections || [];
  var len = items.length;
  var index;
  for (index = 0; index < len; index += 1) {
    if (fn.call(items[index], index, items[index]) === false) {
      break;
    };
  }
  return this;
};
