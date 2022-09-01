const puppeteer = require('puppeteer');

const USER_DATA_DIR = './user_data';
const URL = 'https://bankof.okra.ng';

const auth = {
	email: 'ronireiosantos@gmail.com',
	password: 'testpassword',
	otp: '12345'
};

const scrape_organization = async (organization_url) => {
	const browser = await puppeteer.launch({headless: true, userDataDir: USER_DATA_DIR});
	
	const page = await browser.newPage();
	
	page.on('dialog', async dialog => {
		console.log(dialog.message());
		await dialog.dismiss();
	});
	
	page.on('console', msg => {
		// Debugging the page using consoles
		console.log('PAGE LOG:', msg.text());
	});
	
	await page.goto(organization_url, {waitUntil: 'domcontentloaded'});
	await page.waitForSelector('body nav a:last-child', {visible: true});
	await page.click('body nav a[href="/login"]');
	
	await page.waitForSelector('input#email', {visible: true});
	await page.type('input#email', auth.email);
	await page.type('input#password', auth.password);
	await page.click('button[type="submit"]');
	
	await page.waitForNavigation();
	
	await page.type('input#otp', auth.otp);
	await page.click('button[type="submit"]');
	await page.waitForNavigation();
	const url = page.url();
	const name = await page.title();
	
	
	// PART 2 scrap customer information
	await page.waitForSelector('main > section > section', {visible: true});
	const customer = await page.evaluate(() => {
		const div = document.querySelector('main > div');
		const data = {};
		div.querySelectorAll('div > p').forEach(p => {
			const name = p.firstChild.textContent.slice(0, -1).trim().toLowerCase();
			data[name] = p.lastChild.textContent.trim();
		});
		return {
			names: div.firstChild.textContent.split('Welcome back')[1].slice(0, -1),
			...data
		};
	});
	
	// PART 3, scrap accounts
	await page.waitForSelector('main > section > section', {visible: true});
	const accounts = await page.evaluate(customer => {
		const data = [];
		
		const sections = document.querySelectorAll('main > section > section');
		sections.forEach(section => {
			const accountName = section.querySelector('h3:first-of-type').innerHTML;
			const amount = section.querySelector('p:first-of-type').innerHTML;
			const ledgerBalance = section.querySelector('p:last-of-type').innerHTML;
			
			const viewAccount = section.querySelector('a:last-of-type');
			const href = viewAccount.getAttribute('href');
			const accountId = href.split('-')[1];
			
			data.push({
				customer: customer.bvn,
				accountName,
				account_balance: amount.split(' ')[1].trim(),
				currency: amount.split(' ')[0].trim(),
				ledgerBalance: ledgerBalance.split(' ')[1].trim(),
				accountId,
				href
			});
		}, customer);
		
		return data;
	}, customer);
	
	// PART 4, scrap transactions
	let transactions = [];
	for (const account of accounts) {
		console.log(`Navigating============${account.href}`);
		
		await page.click(`a[href="${account.href}"]`);
		await page.waitForSelector('main > section > div > table', {visible: true});
		
		transactions = await page.evaluate((account, customer) => {
			const tables = document.querySelector('main > section > div > table:first-of-type');
			
			// Prepare headers in that order as object attributes
			const headers = [];
			tables.querySelectorAll('thead > tr > th').forEach(th => {
				const n = th.innerHTML.trim().replaceAll(' ', '_').toLowerCase();
				if (n) {
					headers.push(n);
				}
			});
			
			// Get td attributes and assign values in the order of the headers
			const data = [];
			tables.querySelectorAll('tbody > tr').forEach(tr => {
				const tmp = {};
				tr.querySelectorAll('th, td').forEach((n, idx) => {
					tmp[headers[idx]] = n.innerHTML.trim();
				});
				
				if (Object.keys(tmp).length !== 0) {
					tmp.account_id = account.accountId;
					tmp.customer = customer.bvn;
					data.push(tmp);
				}
			});
			
			return data;
		}, account, customer);
		
		await page.goBack();
		await page.waitForSelector('main > section > section', {visible: true});
	}
	
	// PART 5 Logout
	await page.click('body nav div a:last-child');
	await page.waitForSelector('body nav a[href="/login"]', {visible: true});
	
	await browser.close();
	return { organization: { name, url }, customer, accounts, transactions, auth};
};

scrape_organization(URL).then(console.log).catch(console.error);

module.exports = {scrape_organization};
