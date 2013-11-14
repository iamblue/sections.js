sections.Transition = (function () {
  var Transition = function (options) {
    this.__options = Transition.getOptions(options);
    this.values = [];
  };

  Transition.prototype.update = function (progress) {
    var values;
    var handler = this.__options.handler;
    progress = this.getProgress(progress);
    if (handler) {
      values = handler(progress, this.__options.from, this.__options.to);
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
    if (values) {
      var value;
      var i, len = values.length;
      cssValue = [];
      for (i = 0; i < len; i += 1) {
        value = values[i];
        cssValue.push(this.calcValue(value, progress));
      }
    } else {
      cssValue = [this.calcValue(this.__options, progress)];
    }
    return cssValue;
  };

  Transition.prototype.calcValue = function (value, progress) {
    var from = value.from;
    var to = value.to;
    return (to - from) / 100 * progress + from;
  };

  Transition.prototype.getKey = function () {
    return this.__options.key;
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
    handler: null,
    target: null
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
