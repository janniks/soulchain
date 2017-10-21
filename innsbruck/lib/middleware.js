// Middleware ////////////////////////////////////////////////////////////////////
// globals -> web -> session -> views -> [middleware] -> controllers -> index
var innsbruck = require('./views');

// add middleware shorthand
global.ibk.Middleware = function (name) {
	return required('app/middleware/' + name);
};

module.exports = innsbruck;
