;(function (window, $$) {
  'use strict';

  var page = $$.create();

  page.section(0, function (section) {
    var mouse = document.querySelector('.section--first__mouse');

    section.transitions([
      {key: 'transform', start: 100, end: 0, from: 0, to: 200, format: 'translate3d(0, %spx, 0)', prefix: true, target: mouse}
    ]);
  });

  window.onload = function () {
    page.init();
  };
})(this, sections);
