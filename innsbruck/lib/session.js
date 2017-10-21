// Session /////////////////////////////////////////////////////////////////////
// globals -> web -> [session] -> views -> middleware -> controllers -> index
var innsbruck = require('./web');

var iosession = require('express-socket.io-session');
var session = require('express-session')({
	secret: 'ssssshhhhh',
	resave: true,
	saveUninitialized: true
});

// set session for express and socket.io
innsbruck.app.use(session);

ibk.iosession = iosession(session, {
	autoSave: true
});

module.exports = innsbruck;
