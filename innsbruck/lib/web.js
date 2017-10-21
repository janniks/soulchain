// Web /////////////////////////////////////////////////////////////////////////
// globals -> [web] -> session -> views -> middleware -> controllers -> index
require('./globals');

// helper modules
const _ = require('lodash');
const emoji = require('node-emoji');

// init express
var express = require('express');
var app = express();

// copy router to global ibk object
global.ibk.router = function () {
	return express.Router();
};

// start express
var server = app.listen(ibk.Config.web.port, function () {
	//> todo: add configurable emoji settings
 	log.info('innsbruck listening on port ' + ibk.Config.web.port + ' ' + emoji.get('rocket'));
});
server.on('error', log.error.bind(log, 'Connection error:')); //> todo: message on EADDRINUSE (Address already in use) error catch

// Init Innsbruck //////////////////////////////////////////////////////////////
var innsbruck = {
	'app': app,
	'server': server,
};

// socket io
process.io = require('socket.io')(innsbruck.server);

// third-party packages
var bodyParser = require('body-parser');
var layouts    = require('express-ejs-layouts');

// set parsers
innsbruck.app.use(bodyParser.json());
innsbruck.app.use(bodyParser.urlencoded({ extended: true }));
innsbruck.app.use(layouts);

// Static Web //////////////////////////////////////////////////////////////////
const WebConfig = ibk.Config.web;

if (!WebConfig.static) WebConfig.static = 'public';

if (typeof WebConfig.static === 'string') {
	app.use(express.static(ibk.methods.path(WebConfig.static)));
} else if (Array.isArray(WebConfig.static)) {
	_.forEach(WebConfig.static, function (directory) {
		if (typeof directory === 'string') {
			innsbruck.app.use(express.static(ibk.methods.path(directory)));
		}
	});
}

// Express Use /////////////////////////////////////////////////////////////////
if (!WebConfig.use) WebConfig.use = [];

if (Array.isArray(WebConfig.use)) {
	_.forEach(WebConfig.use, function (item) {
		innsbruck.app.use(item);
	});
}

//> todo: virtual path prefix (http://expressjs.com/en/starter/static-files.html)

module.exports = innsbruck;
