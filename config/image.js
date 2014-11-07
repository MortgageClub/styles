/* globals require, slimerjs */
var system = require('system');
var page = require('webpage').create();
var url = system.args[1];
var file = url.split('/').pop();
var out_dir = system.args[2];

page
  .open(url)
  .then(function () { // executed after loading
    // store a screenshot of the page
    page.viewportSize = {
      width: 400,
      height: 50
    };

    page.render(out_dir + '/' + file + '.png');

    slimer.exit();
  });
