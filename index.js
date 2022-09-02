const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {scrape_organization} = require('./utils/scrape_organization');
const {config} = require('./config');
const {Organization} = require('./models/organization');
const {Customer} = require('./models/customer');
const {Account} = require('./models/account');
const {Transaction} = require('./models/transaction');
const {Auth} = require('./models/auth');

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ credentials: true }));
app.use(router);

app.get("/", async (req, res) => {
	try{
		const response = await scrape_organization(config.SCRAPE_URL);
		const responseCopy = JSON.parse(JSON.stringify(response));
		// Save data to DB
		// Save organization
		const { organization, auth, customer } = responseCopy;
		await Organization.findOneAndUpdate(organization, organization, { upsert: true, new: true }).exec();
		await Auth.findOneAndUpdate({ email: auth.email }, auth, { upsert: true, new: true }).exec();
		// Create customer
		const accounts = customer.accounts;
		delete customer.accounts;
		
		const customerUpdated = await Customer.findOneAndUpdate({bvn: customer.bvn}, customer, { upsert: true, new: true }).exec();
		// Create all user accounts
		for (const account of accounts) {
			account.customer = customerUpdated.id;
			
			const transactions = account.transactions;
			delete account.transactions;
			
			const acc = await Account.findOneAndUpdate({accountId: account.accountId}, account, { upsert: true, new: true }).exec();
			const trans = transactions.map(tr => ({...tr, customer: customerUpdated.id, account: acc.id}));
			await Transaction.insertMany(trans);
			// Create all transactions for this account
		}
		return res.status(200).json({ data: response });
	} catch (e) {
		return res.status(500).json({ error: e.message });
	}
});

app.use((req, res) => {
	return res.status(404).json({
		isError: true,
		message: "Not Found",
		data: null
	});
});

module.exports = app;
