"use strict";

// Inject
var path = require('path');

// =========================================================================
// Global variable =========================================================
// =========================================================================

global.__root    = __dirname;
global.__config  = path.join(__dirname, 'config');
global.__core    = path.join(__dirname, 'app/server/core');
global.__model   = path.join(__dirname, 'app/server/data/models');
global.__plugin  = path.join(__dirname, 'app/server/data/plugins');
global.__dao     = path.join(__dirname, 'app/server/data/dao');
global.__route   = path.join(__dirname, 'app/server/routes');
global.__service = path.join(__dirname, 'app/server/services');
global.__views   = path.join(__dirname, 'app/server/views');
global.__client  = path.join(__dirname, 'app/client');

// =========================================================================
// Server start ============================================================
// =========================================================================

let app    = require(path.join(global.__config, 'app'));
let config = require(path.join(global.__core, 'system')).Config;

let server = app.listen(config.http.port, function () {
	console.log('Express server listening on port ' + server.address().port);
});
