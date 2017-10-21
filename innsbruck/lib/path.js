module.exports.path = function (path) {
	if (typeof path === 'undefined') {
		return process.IBKPATH;
	}
	return process.IBKPATH + path;
};

module.exports.unpath = function (path) {
	return path.replace(process.IBKPATH, '');
};
