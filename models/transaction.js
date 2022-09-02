const mongoose = require('mongoose');

const { Schema } = mongoose;

const TransactionSchema = new Schema({
	type: String,
	cleared_date: Date,
	description: String,
	amount: String,
	beneficiary: String,
	sender: String,
	account: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Account"
	},
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Customer"
	}
}, {
	timestamps: true
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = {Transaction}
