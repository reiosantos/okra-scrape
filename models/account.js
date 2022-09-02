const mongoose = require('mongoose');

const { Schema } = mongoose;

const AccountSchema = new Schema({
	accountId: {
		type: Number,
		required: true,
		unique: true
	},
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Customer"
	},
	customer_bvn: {
		type: String,
		unique: false
	},
	accountName: {
		type: String,
		required: true
	},
	accountBalance: {
		type: Number,
		default: 0
	},
	currency: String,
	ledgerBalance: {
		type: Number,
		default: 0
	},
	href: String
}, {
	timestamps: true
});

const Account = mongoose.model('Account', AccountSchema);
module.exports = {Account}
