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
      target: target
    }
  ]);
  section.on('progress', function (progress) {
    //console.log(progress);
  });
});

window.onload = function () {
  setTimeout(function () {
    page.start();
  }, 200);
};
