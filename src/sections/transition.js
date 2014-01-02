sections.Transition = (function () {
  var Transition = function (options) {
    this.__options = Transition.getOptions(options);
    this.values = [];
  };

  Transition.prototype.update = function (progress) {
    var values;
    var easing = this.__options.easing;
    var after = this.__options.afterCalculate;
    progress = this.getProgress(progress);
    if (easing) {
      if (this.__options.values) {
        values = [];
        sections.utils.forEach(this.__options.values, function (value) {
          values.push(after(easing(progress, value.from, value.to)));
        });
      } else {
        values = [after(easing(progress, this.__options.from, this.__options.to))];
      }
    } else {
      values = this.getValue(progress);
    }
    return Transition.format(this.__options.format, values);
  };

  Transition.prototype.getProgress = function (sectionProgress) {
    var progress;
    switch (true) {
    case sectionProgress <= this.__options.start:
      progress = 0;
      break;
    case sectionProgress >= this.__options.end:
      progress = 100;
      break;
    default:
      var range = this.__options.end - this.__options.start;
      var current = sectionProgress - this.__options.start;
      progress = current / range * 100;
    }
    return progress;
  };

  Transition.prototype.getValue = function (progress) {
    var cssValue;
    var values = this.__options.values;
    var after = this.__options.after;
    if (values) {
      var value;
      var i, len = values.length;
      cssValue = [];
      for (i = 0; i < len; i += 1) {
        value = values[i];
        cssValue.push(after(this.calcValue(value, progress)));
      }
    } else {
      cssValue = [after(this.calcValue(this.__options, progress))];
    }
    return cssValue;
  };

  Transition.prototype.calcValue = function (value, progress) {
    var from = value.from;
    var to = value.to;
    return (to - from) / 100 * progress + from;
  };

  Transition.prototype.getKey = function (prefix) {
    var key = this.__options.key;
    if (prefix) {
      key = prefix + key[0].toUpperCase() + key.slice(1);
    }
    return key;
  };

  Transition.prototype.getTarget = function () {
    return this.__options.target;
  };

  Transition.getOptions = function (options) {
    options || (options = {});
    var defOptions = Transition.defaultOptions;
    var prop;
    for (prop in defOptions) {
      if (defOptions.hasOwnProperty(prop) && !options.hasOwnProperty(prop)) {
        options[prop] = defOptions[prop];
      }
    }
    return options;
  },

  Transition.defaultOptions = {
    key: null,
    start: 0,
    end: 100,
    from: 0,
    to: 0,
    values: null,  // css transition, scale(%s) rotate(%sdeg)
    format: '%s',
    easing: null,
    target: null,
    prefix: false,
    afterCalculate: function (val) {
      return val;
    }
  };

  Transition.format = function (format, values) {
    var index = 0;
    return format.replace(/\\%s/g, '\uffff')
    .replace(/%s/g, function () {
      return values[index++];
    })
    .replace(/\uffff/g, '%s');
  };

  return Transition;
})();
