sections.Animate = (function () {
  function Animate(fn, speed, easing) {
    this.id = 0;
    this.startTime = 0;
    this.started = false;
    this.speed = speed || 300;
    this.fn = fn;
    this.easing = easing;
  }

  Animate.prototype = new sections.events.EventEmitter();

  Animate.prototype.loop = function () {
    this.id = sections.requestAnimationFrame((function () {
      var progress = (Date.now() - this.startTime) / this.speed;
      this.easing && (progress = this.easing(progress));
      if (progress >= 1) {
        this.fn(1);
        this.emit('done');
      } else {
        this.fn(progress);
        this.loop();
      }
    }).bind(this));
  };

  Animate.prototype.stop = function () {
    this.started && sections.cancelAnimationFrame(this.id);
    this.started = false;
    return this;
  };

  Animate.prototype.start = function () {
    if (!this.started) {
      this.startTime = Date.now();
      this.started = true;
      this.loop();
    }
    return this;
  };

  return Animate;
})();
