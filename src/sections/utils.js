sections.utils = {};

sections.utils.getInlineCSS = function (element) {
  var style = element.getAttribute('style') || '';
  var regexp = /([^:\s]+)\s*:\s*([^;]+)/g;
  var data = {};
  style.replace(regexp, function (origin, key, value) {
    data[key] = value.trim();
  });
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
