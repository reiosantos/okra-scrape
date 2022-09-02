const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const CustomerSchema = new Schema({
	name: String,
	address: String,
	bvn: {
		unique: true,
		type: Number,
		required: true,
		min: [10]
	},
	phone: {
		type: String,
		required: true,
		min: 10
	},
	email: {
		type: String,
		lowercase: true,
		validate: (input) => validator.isEmail(input)
	}
}, {
	timestamps: true
});

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = { Customer };
