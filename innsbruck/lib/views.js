// Views ///////////////////////////////////////////////////////////////////////
// globals -> web -> session -> [views] -> middleware -> controllers -> index
var innsbruck = require('./session');

// third-party packages
// todo: configurable?

// set view config
innsbruck.app.set('views', ibk.methods.path('app/views'));
innsbruck.app.set('view engine', 'ejs');

module.exports = innsbruck;
