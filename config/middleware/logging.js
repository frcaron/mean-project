(function() {
  'use strict';

  module.exports = function(app, config) {
    var format;

    if (config !== false) {
      config = config || {};

      format  = config.format || 'dev';

      app.use(require('morgan')(format));
    }
  };

})();