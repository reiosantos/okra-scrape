const http = require("http");
const app = require("./index");
const { config }  = require('./config');
const { MongoClient }  = require('./config/database');

(async () => {
	// Only start the server if the mongo connection is active
	const client = new MongoClient();
	await client.getClient();
	
	const server = http.createServer(app);
	
	server.listen(config.PORT, () => {
		const address = server.address();
		if (address && typeof address !== 'string') {
			console.info(`Find me on http://localhost:${address.port}`);
		} else {
			console.error(`Unable to start server on port ${config.PORT}`);
		}
	});
})();
