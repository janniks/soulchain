//# Globals ####################################################################
// [globals] -> web -> session -> views -> middleware -> controllers -> index

//## Functions #################################################################
// Handy `required` function
global.required = function (path) {
	return require(require('./path').path(path));
};

//## Requires ##################################################################
const Utils = require('./utils');

//## Config ####################################################################
//> todo: DefaultConfig
const Config = Utils.getConfig();

//## Logger ####################################################################
global.log = require('./log')((Config.log.show) ? Config.log.show : 'info');

// lodash
if (Config.global._) {
	global._ = require('lodash');					//> todo: fix global lodash
}

//## Database ##################################################################
// Get values from config
const DB_PORT = Config.database.port ? ':' + Config.database.port : '';
const DB_ADDR = Config.database.address ? Config.database.address : 'localhost';
const DB_USER = Config.database.username ? Config.database.username : '';
const DB_PASS = Config.database.password ? Config.database.password : '';
const DB_DBNM = Config.database.database ? Config.database.database : '';

// Build auth string if applicable
var DB_AUTH = '';
if (DB_USER !== '' || DB_PASS !== '') {
	DB_AUTH = DB_USER + ':' + DB_PASS + '@';
}

// Use url instead if available
var DB_URL = '';
if (Config.database.url && typeof Config.database.url !== 'undefined') {
	DB_URL = Config.database.url;
} else {
	DB_URL = 'mongodb://' + DB_AUTH + DB_ADDR + DB_PORT + '/' + DB_DBNM;
}

// Initialize database
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(DB_URL);

// Save mongo and bind error log
var mongodb = mongoose.connection;
mongodb.on('error', log.error.bind(log, 'Connection error:'));
mongodb.once('open', function () {
	//> todo: add configurable emoji settings
	log.info('Database connected ' + require('node-emoji').get('file_cabinet') + '\n');
});

//## innsbruck #################################################################
// Setup global innsbruck object
global.ibk = {
	Config: Config,
	Custom: (Config.custom !== undefined) ? Config.custom : null,
	Schema: mongoose.Schema,
	Model: function (name, schema) {
		global.ibk.Schemas[name] = schema;
		log.debug(__filename, __dirname);
		return mongoose.model(name, schema);
	},
	ModelReference: function (schema) {
		return {
			type: ibk.Database.mongoose.Schema.ObjectId,
			ref: schema
		};
	},
	Schemas: [ ],
	Models: { },
	Utils: { },
	Database: {
		mongo: mongodb,
		mongoose: mongoose
	},
	methods: {
		path: require('./path').path,
		unpath: require('./path').unpath,
		promisify: function (f) {
			//> todo: add config for promisify
			return require('bluebird').promisify(f);
		},
		promisifyAll: function (f) {
			//> todo: add config for promisifyAll
			return require('bluebird').promisifyAll(f);
		},
		ObjectId: function (i) {
			return ibk.Database.mongoose.Types.ObjectId(i);
		}
	}
};

//## Models ####################################################################
// Iterate through all models and add them to global ibk object
const modelsPath = ibk.methods.path('app/models');
walkFilesRecursive(modelsPath, function (filePath, rootDir, subDir, fileName) {
	const modelName = (subDir ? subDir.replace(/[\/\s]+/, '') : '') +
					  fileName.replace(/\.[^/.]+$/, '');
	const modelRequire = modelsPath +
						 (subDir ? '/' + subDir : '') + '/' + fileName;
	const modelSchema = require(modelRequire);

	global.ibk.Schemas[modelName] = modelSchema;
	global.ibk.Models[modelName] = mongoose.model(modelName, modelSchema);
});

//## Utils #####################################################################
// Iterate through all utils and add them to global ibk object
const utilsPath = ibk.methods.path('app/utils');
walkFilesRecursive(utilsPath, function (filePath, rootDir, subDir, fileName) {
	const utilName = (subDir ? subDir.replace(/[\/\s]+/, '') : '') +
					  fileName.replace(/\.[^/.]+$/, '');
	const utilRequire = utilsPath +
						 (subDir ? '/' + subDir : '') + '/' + fileName;

	global.ibk.Utils[utilName] = require(utilRequire);
});


//> todo: std paths and chageable e.g. models directory paths

//## Helper Functions ##########################################################
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
