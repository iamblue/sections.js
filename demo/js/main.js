var page = sections.create();

page.on('changed', function (current, prev) {
  console.log('changed');
});

page.on('progress', function (progress) {
  console.log('progress: %s', progress);
});

page.section(1, function (section) {
  section.on('progress', function (progress) {
    console.log('section 1: %s', progress);
  });

  section.on('scrollIn', function (way) {
    console.log('section 1: scrollIn. %s', way === -1 ? 'top -> bottom' : 'bottom -> top');
  });

  section.on('scrollOut', function (way) {
    console.log('section 1: scrollOut. %s', way === 1 ? 'top -> bottom' : 'bottom -> top');
  });
});

window.onload = function () {
  page.start();
};
