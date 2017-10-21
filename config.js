//# Config #####################################################################
module.exports = {

	//## database ##############################################################
	"database": {
		"address" : "PLACEHOLDER",
		"database": "PLACEHOLDER",
		"username": "PLACEHOLDER",
		"password": "PLACEHOLDER"
	},

	//## web ###################################################################
	"web": {
		"use": [
			require('cors')()
		]
	}
};
