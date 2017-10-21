// todo: change to dynamic created functions
// todo: change initializer

var c = require('chalk');

var Log = {
	show: function (name) {
		if (typeof name === 'string') Log.level = name;
		Log.shown = Log.levels.slice(Log.levels.indexOf(Log.level));
		// !todo: check if given name (string) is in levels
		return Log;
	},
	shown: [
		'info',
		'debug',
		'warn',
		'error',
		'silent'
	],

	level: 'info',
	levels: [
		'silly',
		'verbose',
		'info',
		'debug',
		'warn',
		'error',
		'silent'
	],

	// todo: make colors changeable after init? slower?
	// 		 map levels as object?

	silly:   function () { Log.convenient('magenta', 'silly',   arguments); },
	verbose: function () { Log.convenient('cyan',    'verbose', arguments); },
	info:    function () { Log.convenient('green',   'info',    arguments); },
	debug:   function () { Log.convenient('blue',    'debug',   arguments); },
	warn:    function () { Log.convenient('yellow',  'warn',    arguments); },
	error:   function () { Log.convenient('red',     'error',   arguments); },

	convenient: function (color, name, array) {
		if (Log.shown.indexOf(name) > -1) {
			var args = (array.length === 1 ? [array[0]] : Array.apply(null, array));
			var lvl  = '[' + name + ']';
			args.unshift(c[color](lvl));
			console.log.apply(console, args);
		}
	},

	custom: function () {
		var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));

		switch (args.length) {
			case 0:
				break;
			case 1:
				Log.info(args);
				break;
			case 2:
				Log.convenient('green', args[0], args[1]);
				break;
			default:
				Log.convenient(args[0], args[1], args.slice(2));
		}
	}
};

module.exports = function (name) {
	if (name)
		return Log.show(name);
	return Log;
};
