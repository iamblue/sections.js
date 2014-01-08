var page = sections.create();

//page.on('changed', function (current, prev) {
  //console.log('changed');
//});

//page.on('progress', function (progress) {
  //console.log('progress: %s', progress);
//});

page.section(1, function (section) {
  var target = document.querySelector('#section-2-opacity');
  section.transitions([
    {
      key: 'opacity',
      start: 0,
      end: 100,
      from: 0,
      to: 1,
      format: '%s',
      target: target,
      easing: function (progress, from, to) {
        return (to - from) / 100 * progress + from; // default
      }
    },
    {
      key: 'transform',
      start: 10,
      end: 200,
      from: 0,
      to: 500,
      format: 'translate3d(%spx, 0, 0)',
      target: target
    }
  ]);
  section.on('progress', function (progress) {
    //console.log(progress);
  });
});

window.onload = function () {
  page.init();
};
