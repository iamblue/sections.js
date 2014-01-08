sections.Section = (function () {
  var Section = function (element, sections_) {
    sections.events.EventEmitter.call(this);
    this.sections = sections_;
    this.element = element;
    this.updatePosition();
    this.progress = 0;
    this.__transitions = [];
    this.__transitionTargets = [];
  };

  Section.prototype = new sections.events.EventEmitter();

  Section.prototype.updatePosition = function () {
    var offset = this.getOffset();
    this.top = offset.top;
    return this;
  };

  Section.prototype.getOffset = function () {
    var el = this.element;
    var x = 0;
    var y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
      x += el.offsetLeft;
      y += el.offsetTop;
      el = el.offsetParent;
    }
    return {
      top: y,
      left: x
    };
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
      progress = pos / (pos > 0 ? pageHeight : height) * 100;
      progress = progress > 0 ? 100 - progress : progress * -1 + 100;
    } else {
      progress = this.top - pageTop > 0 ? 0 : 200;
    }
    if (this.progress !== progress) {
      this.runTransition(progress);
      this.progress = progress;
      this.emit('progress', progress);
    }
    return this;
  };

  Section.prototype.getHeight = function () {
    var el = this.element;
    return el.offsetHeight
      || el.clientHeight
      || el.scrollHeight;
  };

  Section.prototype.transitions = function (transitions) {
    var newTransitions = this.__transitions;
    sections.utils.forEach(transitions, (function (transition, i) {
      transition.target = transition.target || transition.targets || [];
      transition.prefix === undefined && (transition.prefix = sections.utils.needPrefix(transition.key));
      var targets = (transition.target instanceof Array) ? transition.target : [transition.target];
      sections.utils.forEach(targets, (function (target, i) {
        var data = sections.utils.clone(transition);
        data.target = this.setTarget(transition.target);
        newTransitions.push(new sections.Transition(data));
      }).bind(this));
    }).bind(this));
    return this;
  };

  Section.prototype.setTarget = function (target) {
    var targets = this.__transitionTargets;
    var id = targets.indexOf(target);
    if (!~id) {
      targets.push(target);
      id = targets.length - 1;
    }
    return id;
  };

  Section.prototype.runTransition = function (progress) {
    var transitions = this.__transitions;
    var targets = this.__transitionTargets;
    var forEach = sections.utils.forEach;
    forEach(transitions, (function (transition, i) {
      var target = transition.getTarget();
      var values = targets[target].style;
      values[transition.getKey(transition.__options.prefix ? this.sections.__prefix : null)] = transition.update(progress);
    }).bind(this));
  };

  return Section;
})();
