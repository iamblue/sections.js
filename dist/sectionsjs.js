/*! sectionsjs - v0.0.4 - 2013-11-13 | Copyright (c) 2013 Po-Ying Chen <poying.me@gmail.com> */

(function(window, document) {
    "use strict";
    var sections = window.sections = {};
    sections.config = {
        className: "section",
        marginTop: 0,
        interval: 200,
        autoSectionHeight: true
    };
    sections.utils = {};
    sections.utils.getInlineCSS = function(element) {
        var style = element.getAttribute("style") || "";
        var regexp = /([^:\s]+)\s*:\s*([^;]+)/g;
        var data = {};
        style.replace(regexp, function(origin, key, value) {
            data[key] = value.trim();
        });
        return data;
    };
    sections.utils.setInlineCSS = function(element, style) {
        var oldStyle = sections.utils.getInlineCSS(element);
        var newStyle = [];
        var i;
        for (i in style) {
            if (style.hasOwnProperty(i)) {
                oldStyle[i] = style[i];
            }
        }
        for (i in oldStyle) {
            if (oldStyle.hasOwnProperty(i)) {
                newStyle.push(i + ": " + oldStyle[i]);
            }
        }
        element.setAttribute("style", newStyle.join("; "));
        return oldStyle;
    };
    sections.events = {};
    sections.events.EventEmitter = function() {
        var EventEmitter = function() {
            this.events = {};
        };
        var on = EventEmitter.prototype.on = function(eventName, handler, isOnce) {
            var events = this.events;
            if (typeof handler === "function") {
                handler.once = !!isOnce;
                if (!events[eventName]) {
                    events[eventName] = [];
                }
                events[eventName].push(handler);
            }
            return this;
        };
        var addEventListener = EventEmitter.prototype.addEventListener = on;
        var once = EventEmitter.prototype.once = function(eventName, handler) {
            return this.on(eventName, handler, true);
        };
        var off = EventEmitter.prototype.off = function(eventName, handler) {
            var events = this.events;
            if (typeof handler === "function") {
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
        var emit = EventEmitter.prototype.emit = function(eventName) {
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
    }();
    sections.Transition = function() {
        var Transition = function(options) {
            this.__options = Transition.getOptions(options);
            this.values = [];
        };
        Transition.prototype.update = function(progress) {
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
        Transition.prototype.getProgress = function(sectionProgress) {
            var range = this.__options.start - this.__options.end;
            var current = sectionProgress - this.__options.end;
            return current / range * 100;
        };
        Transition.prototype.getValue = function(progress) {
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
                cssValue = [ this.calcValue(this.__options, progress) ];
            }
            return cssValue;
        };
        Transition.prototype.calcValue = function(value, progress) {
            var from = value.from;
            var to = value.to;
            return (to - from) / 100 * progress;
        };
        Transition.prototype.getKey = function() {
            return this.__options.key;
        };
        Transition.prototype.getTarget = function() {
            return this.__options.target;
        };
        Transition.getOptions = function(options) {
            options || (options = {});
            var defOptions = Transition.defaultOptions;
            var prop;
            for (prop in defOptions) {
                if (defOptions.hasOwnProperty(prop) && !options.hasOwnProperty(prop)) {
                    options[prop] = defOptions[prop];
                }
            }
            return options;
        }, Transition.defaultOptions = {
            key: null,
            start: 0,
            end: 100,
            from: 0,
            to: 0,
            values: null,
            format: "%s",
            handler: null,
            target: null
        };
        Transition.format = function(format, values) {
            var index = 0;
            return format.replace(/\\%s/g, "￿").replace(/%s/g, function() {
                return values[index++];
            }).replace(/\uffff/g, "%s");
        };
        return Transition;
    }();
    sections.Section = function() {
        var Section = function(element) {
            sections.events.EventEmitter.call(this);
            this.element = element;
            this.updatePosition();
            this.progress = 0;
            this.__transitions = [];
            this.__transitionTargets = [];
        };
        Section.prototype = new sections.events.EventEmitter();
        Section.prototype.updatePosition = function() {
            var offset = this.getOffset();
            this.top = offset.top;
            return this;
        };
        Section.prototype.getOffset = function() {
            var el = this.element;
            var x = 0;
            var y = 0;
            while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                x += el.offsetLeft;
                y += el.offsetTop;
                el = el.offsetParent;
            }
            return {
                top: y,
                left: x
            };
        };
        Section.prototype.getCSS = function(key) {
            var css = sections.utils.getInlineCSS(this.element);
            return key ? css[key] : css;
        };
        Section.prototype.setCSS = function(css) {
            sections.utils.setInlineCSS(this.element, css);
            return this;
        };
        Section.prototype.updateProgress = function(pageTop, pageHeight) {
            var height = this.getHeight();
            var progress;
            if (pageTop + pageHeight > this.top && pageTop <= this.top + height) {
                var pos = this.top - pageTop;
                progress = pos / (pos > 0 ? pageHeight : height) * 100;
                progress = progress > 0 ? 100 - progress : progress;
            } else {
                progress = this.top - pageTop > 0 ? 0 : -100;
            }
            if (this.progress !== progress) {
                this.runTransition(progress);
                this.progress = progress;
                this.emit("progress", progress);
            }
            return this;
        };
        Section.prototype.getHeight = function() {
            var el = this.element;
            return el.offsetHeight || el.clientHeight || el.scrollHeight;
        };
        Section.prototype.transitions = function(transitions) {
            transitions || (transitions = []);
            var i, len = transitions.length;
            var transition;
            var newTransitions = this.__transitions;
            for (i = 0; i < len; i += 1) {
                transition = transitions[i];
                transition.target = this.setTarget(transition.target);
                newTransitions.push(new sections.Transition(transition));
            }
            return this;
        };
        Section.prototype.setTarget = function(target) {
            var targets = this.__transitionTargets;
            var id = targets.indexOf(target);
            if (!~id) {
                targets.push(target);
                id = targets.length - 1;
            }
            return id;
        };
        Section.prototype.runTransition = function(progress) {
            var transitions = this.__transitions;
            var targets = this.__transitionTargets;
            var i, len = transitions.length;
            var targetValues = [];
            var values;
            var target;
            var transition;
            for (i = 0; i < len; i += 1) {
                transition = transitions[i];
                target = transition.getTarget();
                values = targetValues[target] || sections.utils.getInlineCSS(targets[target]);
                values[transition.getKey()] = transition.update(progress);
                targetValues[target] = values;
            }
            for (i = 0, len = targetValues.length; i < len; i += 1) {
                sections.utils.setInlineCSS(targets[i], targetValues[i]);
            }
        };
        return Section;
    }();
    sections.proto = new sections.events.EventEmitter();
    sections.proto.init = function() {
        this.__started = false;
        this.__init = true;
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
    sections.proto.getScrollHeight = function() {
        var body = document.body;
        var documentElement = document.documentElement;
        this.scrollHeight = body.scrollHeight || documentElement.scrollHeight || 0;
        return this;
    };
    sections.proto.getSections = function() {
        this.sections = [];
        var elements = document.getElementsByClassName(this.config.className) || [];
        var len = elements.length;
        var index;
        for (index = 0; index < len; index += 1) {
            this.sections.push(new sections.Section(elements[index]));
        }
        return this;
    };
    sections.proto.start = function() {
        if (!this.__started) {
            this.__started = true;
            this.emit("started");
            this.loop();
        }
        return this;
    };
    sections.proto.stop = function() {
        this.cancelAnimationFrame(this.__intervalID);
        this.__started = false;
    };
    sections.proto.loop = function() {
        var step = function() {
            if (this.__started) {
                var scrollOffset = {
                    x: 0,
                    y: 0
                };
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
        }.bind(this);
        step();
    };
    sections.proto.requestAnimationFrame = function(cb, interval) {
        return (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || setTimeout)(cb);
    };
    sections.proto.cancelAnimationFrame = function(id) {
        (window.cancelAnimationFrame || window.mozcancelAnimationFrame || window.webkitcancelAnimationFrame || window.mscancelAnimationFrame || setInterval)(id);
    };
    sections.proto.updateWindowSize = function() {
        var documentElement = document.documentElement;
        var body = document.body;
        var width = window.innerWidth || documentElement.clientWidth || body.clientWidth;
        var height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
        this.width = width;
        this.height = height;
        if (this.config.autoSectionHeight) {
            this.each(function(index, section) {
                section.setCSS({
                    height: height + "px"
                });
                section.updatePosition();
            });
        }
        return this;
    };
    sections.proto.addWindowResizeHandler = function() {
        var onResize = function() {
            this.updateWindowSize();
        }.bind(this);
        window.addEventListener("resize", onResize);
        onResize();
        return this;
    };
    sections.proto.addScrollHandler = function() {
        window.addEventListener("scroll", function() {
            this.start();
        }.bind(this));
    };
    sections.proto.addStopHandler = function() {
        this.on("stop", function() {
            this.stop();
            this.emit("stopped");
        }.bind(this));
    };
    sections.proto.checkCurrentSection = function() {
        var prevIndex = this.__currentIndex;
        this.each(function(index, section) {
            if (this.top >= section.top && this.top < section.top + section.getHeight() && index !== prevIndex) {
                this.__currentIndex = index;
                var prev = this.get(prevIndex);
                var current = this.get(index);
                this.emit("changed", current, prev);
                if (prev) {
                    prev.emit("scrollOut", prevIndex < index ? 1 : -1);
                }
                current.emit("scrollIn", prevIndex > index ? 1 : -1);
                return false;
            }
        }.bind(this));
        return this;
    };
    sections.proto.updateProgress = function() {
        var last = this.last();
        var progress = this.top / (this.scrollHeight - last.getHeight()) * 100;
        if (this.progress === progress) {
            this.emit("stop");
        } else {
            this.progress = progress;
            this.emit("progress", progress);
        }
        this.each(function(index, section) {
            section.updateProgress(this.top, this.height);
        }.bind(this));
        return this;
    };
    sections.proto.lazyApply = function() {
        var allfn = this.__lazyApply;
        var len = allfn.length;
        while (len--) {
            allfn[len]();
        }
        return this;
    };
    sections.proto.current = function() {
        return this.get(this.currentIndex());
    };
    sections.proto.last = function() {
        return this.get(this.sections.length - 1);
    };
    sections.proto.first = function() {
        return this.get(0);
    };
    sections.proto.currentIndex = function() {
        return this.__currentIndex | 0;
    };
    sections.proto.get = function(index) {
        return this.sections[index] || null;
    };
    sections.proto.section = function(index, fn) {
        if (!this.__init) {
            this.__lazyApply.push(function() {
                this.section(index, fn);
            }.bind(this));
        } else {
            if (typeof fn === "function") {
                switch (index) {
                  case "first":
                    index = 0;
                    break;

                  case "last":
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
    sections.proto.each = function(fn) {
        var items = this.sections || [];
        var len = items.length;
        var index;
        for (index = 0; index < len; index += 1) {
            if (fn.call(items[index], index, items[index]) === false) {
                break;
            }
        }
        return this;
    };
    sections.Sections = function(config) {
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
    sections.create = function(config) {
        return new sections.Sections(config);
    };
})(this, this.document);