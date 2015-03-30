(function() {
  'use strict';

  var pathRX = new RegExp(/\/[^\/]+$/)
    , locationPath = location.pathname.replace(pathRX, '');

  require({
    async: true,
    parseOnLoad: true,
    packages: [{
      name: 'widgets',
      location: locationPath + 'dist/widgets'
    }, {
      name: 'ramda',
      location: locationPath + 'bower_components/ramda/dist',
      main: 'ramda.min'
    }, {
      name: 'app',
      location: locationPath + 'dist',
      main: 'main'
    }]
  }, ['app']);

})();
