sections.utils = {};

sections.utils.getInlineCSS = function (element) {
  if (element.__style) {
    return element.__style;
  }
  var style = element.getAttribute('style') || '';
  var regexp = /([^:\s]+)\s*:\s*([^;]+)/g;
  var data = {};
  style.replace(regexp, function (origin, key, value) {
    data[key] = value.trim();
  });
  element.__style = data;
  return data;
};

sections.utils.setInlineCSS = function (element, style) {
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
      newStyle.push(i + ': ' + oldStyle[i]);
    }
  }
  element.setAttribute('style', newStyle.join('; '));
  return oldStyle;
};

sections.utils.forEach = function (array, callback) {
  array || (array = []);
  callback || (callback = function () {});
  var i, val;
  var len = array.length;
  for (i = 0; i < len; i += 1) {
    val = array[i];
    if (callback(val, i) === false) {
      break;
    }
  }
};

sections.utils.getVendorPrefix = function () {
  var getStyle = window.getComputedStyle;
  var prefix;
  if (getStyle) {
    var style = getStyle(document.documentElement, '');
    var match;
    style = Array.prototype.join.call(style, '');
    match = style.match(/-(?:O|Moz|webkit|ms)-/i);
    if (match) {
      prefix = match[0];
    }
  }
  return prefix;
};

sections.utils.clone = function (obj) {
  var newObj = {};
  var prop;
  for (prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      newObj[prop] = obj[prop];
    }
  }
  return newObj;
};
