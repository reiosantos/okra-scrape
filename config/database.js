const mongoose = require("mongoose");
const { config } = require('./index');

class MongoClient {
	options = {
		keepAlive: true
	};
	
	instance;
	exists;
	
	async getClient() {
		const DB_URL = config.DATABASE_URL;
		try {
			await mongoose.connect(DB_URL, this.options);
			mongoose.Promise = global.Promise;
			
			const { connection } = mongoose;
			
			connection.on('error', (error) => {
				console.error(`Error occurred: ${error}`);
			});
			
			this.instance = connection;
			this.exists = true;
			
			return this.instance;
		} catch (e) {
			console.error(e);
			throw Error(`Unable to connect to database: ${e}`);
		}
	}
}

module.exports = { MongoClient };
