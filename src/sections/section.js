sections.Section = (function () {
  var Section = function (element) {
    sections.events.EventEmitter.call(this);
    this.element = element;
    this.updatePosition();
    this.progress = 0;
  };

  Section.prototype = new sections.events.EventEmitter();

  Section.prototype.updatePosition = function () {
    var rect = this.element.getBoundingClientRect();
    this.left = rect.left;
    this.right = rect.right;
    this.top = rect.top;
    this.bottom = rect.bottom;
    return this;
  };
  
  Section.prototype.getCSS = function (key) {
    var css = sections.utils.getInlineCSS(this.element);
    return key ? css[key] : css;
  };

  Section.prototype.setCSS = function (css) {
    sections.utils.setInlineCSS(this.element, css);
    return this;
  };

  Section.prototype.updateProgress = function (pageTop, pageHeight) {
    var height = this.getHeight();
    var progress;
    if (pageTop + pageHeight > this.top && pageTop <= this.top + height) {
      var pos = this.top - pageTop;
      progress = (pos / height) * 100;

      progress = progress > 0 ? 100 - progress : progress;

    } else {
      progress = this.top - pageTop > 0 ? 0 : -100;
    }
    if (this.progress !== progress) {
      this.progress = progress;
      this.emit('progress', progress);
    }
    return this;
  };

  Section.prototype.getHeight = function () {
    return this.element.offsetHeight;
  };

  return Section;
})();
