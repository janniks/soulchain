const _ = require('lodash');

//## Config Utils ##############################################################
module.exports.getConfigDefault = function () {
	return require('./config/ConfigDefault');
};

module.exports.getConfigEnvironment = function () {
	switch (this.getCurrentEnvironment()) {
		case 'production':
		case 'prod':
			return require('./config/ConfigProduction');
		case 'staging':
		case 'stage':
			return require('./config/ConfigStaging');
		case 'testing':
		case 'test':
			return require('./config/ConfigTesting');
		case 'development':
		case 'dev':
			return require('./config/ConfigDevelopment');
		default:
			return null;
	}
};

module.exports.getConfigUser = function () {
	return required('config');
};

module.exports.getConfigUserEnvironment = function () {
	const ConfigUser = this.getConfigUser();
	const env = this.getCurrentEnvironment();

	return (ConfigUser.environments[env] !== undefined) ? ConfigUser.environments[env] : null;
};

module.exports.getConfig = function () {
	return _.merge(
		this.getConfigDefault(),
		this.getConfigEnvironment(),
		this.getConfigUser(),
		this.getConfigUserEnvironment()
	);
};

//## Helper Methods ############################################################
module.exports.getCurrentEnvironment = function () {
	return process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : null;
};
