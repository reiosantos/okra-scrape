const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const AuthSchema = new Schema({
	email: {
		type: String,
		lowercase: true,
		validate: (input) => validator.isEmail(input)
	},
	password: {
		type: String,
		required: [true, 'A password is required']
	},
	otp: Number
}, {
	timestamps: true
});

const Auth = mongoose.model('Auth', AuthSchema);
module.exports = { Auth };
