const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlertSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},
	// validate in route
	pairing: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	alertType: {
		type: String,
		enum: [ 'BUY', 'SELL' ],
		required: true
	}
});

module.exports = Alert = mongoose.model('alerts', AlertSchema);
