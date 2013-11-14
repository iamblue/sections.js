sections.Section = (function () {
  var Section = function (element) {
    sections.events.EventEmitter.call(this);
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
      transition.target = this.setTarget(transition.target);
      newTransitions.push(new sections.Transition(transition));
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
    var targetValues = [];
    var forEach = sections.utils.forEach;
    forEach(transitions, function (transition, i) {
      var target = transition.getTarget();
      var values = targetValues[target] || sections.utils.getInlineCSS(targets[target]);
      var value = transition.update(progress);
      var keys = transition.getKeys();
      forEach(keys, function (key) {
        values[key] = value;
      });
      targetValues[target] = values;
    });
    forEach(targetValues, function (values, i) {
      sections.utils.setInlineCSS(targets[i], values);
    });
  };

  return Section;
})();
