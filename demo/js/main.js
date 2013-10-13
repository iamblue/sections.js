var page = sections.create();

window.onload = function () {
  page.start();

  page.on('changed', function (current, prev) {
    console.log('changed');
  });

  page.on('progress', function (progress) {
    console.log('progress: %s', progress);
  });

  page.get(1)
    .on('progress', function (progress) {
      console.log('section 1: %s', progress);
    })
    .on('scrollIn', function (way) {
      console.log('section 1: scrollIn. %s', way === -1 ? 'top -> bottom' : 'bottom -> top');
    })
    .on('scrollOut', function (way) {
      console.log('section 1: scrollOut. %s', way === 1 ? 'top -> bottom' : 'bottom -> top');
    });
};
