sections.Sections = function (config) {
  sections.events.EventEmitter.call(this);
  config = config || {};
  var defConfig = sections.config;
  var i;
  for (i in defConfig) {
    if (defConfig.hasOwnProperty(i) && !config.hasOwnProperty(i)) {
      config[i] = defConfig[i];
    }
  }
  this.__started = false;
  this.__currentIndex = -1;
  this.config = config;
  this.width = 0;
  this.height = 0;
  this.top = 0;
  this.left = 0;
  this.__lazyApply = [];
};

sections.Sections.prototype = sections.proto;

sections.requestAnimationFrame = sections.proto.requestAnimationFrame;
sections.cancelAnimationFrame = sections.proto.cancelAnimationFrame;

sections.create = function (config) {
  return new sections.Sections(config);
};
