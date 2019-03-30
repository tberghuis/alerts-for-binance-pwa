const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: {
		type: String
	},
	anonUuid: {
		type: String
	},
	password: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now
	},
	notificationTokens: [ { type: String } ]
});

module.exports = User = mongoose.model('users', UserSchema);
