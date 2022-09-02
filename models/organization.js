const mongoose = require('mongoose');

const {Schema} = mongoose;

const OrganizationSchema = new Schema({
	name: {
		type: String
	},
	url: {
		type: String
	}
}, {
	timestamps: true
});

const Organization = mongoose.model('Organization', OrganizationSchema);
module.exports = {Organization};
