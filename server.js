"use strict";

// Inject
var Path = require('path');

// =========================================================================
// Global variable =========================================================
// =========================================================================

global.__root    = __dirname;
global.__config  = Path.join(__dirname, 'config');
global.__server  = Path.join(__dirname, 'app/server');
global.__core    = Path.join(__dirname, 'app/server/core');
global.__model   = Path.join(__dirname, 'app/server/data/models');
global.__plugin  = Path.join(__dirname, 'app/server/data/plugins');
global.__dao     = Path.join(__dirname, 'app/server/data/dao');
global.__route   = Path.join(__dirname, 'app/server/routes');
global.__service = Path.join(__dirname, 'app/server/services');
global.__views   = Path.join(__dirname, 'app/server/views');
global.__client  = Path.join(__dirname, 'app/client');

// =========================================================================
// Server start ============================================================
// =========================================================================

let App    = require(Path.join(global.__config, 'app'));
let Config = require(Path.join(global.__core, 'system')).Config;

let server = App.listen(Config.http.port, function () {
	console.log('Express server listening on port ' + server.address().port);
});
