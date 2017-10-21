// Routes //////////////////////////////////////////////////////////////////////
// globals -> web -> session -> views -> middleware -> [controllers] -> index

//> todo: add error handling and error messages for faulty controllers

var innsbruck = require('./middleware.js');

const controllersPath = ibk.methods.path('app/controllers');

// use all files in `controllers` directory and subdirectories
walkFilesRecursive(controllersPath, function (filePath, rootDir, subDir, fileName) {
	
	const controllerPath =
		controllersPath + (subDir ? '/' + subDir : '') + '/' + fileName;
	const controller = require(controllerPath);

	// use the controller on the express app
	innsbruck.app.use(controller);

	// log used controllers
	log.verbose('Including controller:', ibk.methods.unpath(controllerPath));
});

module.exports = innsbruck;

//## Functions #################################################################
function walkFilesRecursive(rootDir, callback, subDir) {
	const abspath = subDir ? require('path').join(rootDir, subDir) : rootDir;
	require('fs').readdirSync(abspath).forEach(function(fileName) {
		var filepath = require('path').join(abspath, fileName);
		if (require('fs').statSync(filepath).isDirectory()) {
			walkFilesRecursive(rootDir, callback, require('path').join(subDir || '', fileName || ''));
		} else {
			callback(filepath, rootDir, subDir, fileName);
		}
	});
}
