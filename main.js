;(function (window, $$) {
  'use strict';

  var page = $$.create();

  page.section(0, function (section) {
    var title = document.querySelector('.section--first__title');
    var letters = title.querySelectorAll('span');
    var des = document.querySelector('.section--first__des');
    var code = document.querySelector('.section--first__code');
    var mouse = document.querySelector('.section--first__mouse');
    var transitions = [];

    var rng = new Math.seedrandom();

    var random = function (max, min) {
      return Math.floor(rng() * (max - min + 1)) + min;
    };

    //title
    Array.prototype.forEach.call(letters, function (letter) {
      transitions.push({key: 'transform', start: 100, end: 200, from: 0, to: random(100, 200), format: 'translate3d(0, %spx, 0)', prefix: true, target: letter});
    });

    // des
    transitions.push({key: 'transform', start: 100, end: 200, from: 0, to: 80, format: 'translate3d(0, %spx, 0)', prefix: true, target: des});

    // mouse
    transitions.push({key: 'transform', start: 100, end: 200, from: 0, to: 200, format: 'translate3d(0, %spx, 0)', prefix: true, target: mouse});

    // code
    transitions.push({key: 'transform', start: 100, end: 200, from: 0, to: 300, format: 'translate3d(0, %spx, 0)', prefix: true, target: code});

    section.transitions(transitions);
  });

  window.onload = function () {
    page.init();
  };
})(this, sections);
