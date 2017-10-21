var profileSchema = new ibk.Schema({
	accessToken: ibk.Schema.Types.Mixed,
	refreshToken: ibk.Schema.Types.Mixed,
	profile: {
		type: ibk.Schema.Types.Mixed,
		unique : true
	}
}, {
	versionKey: false
});

module.exports = profileSchema;
