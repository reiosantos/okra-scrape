const puppeteer = require('puppeteer');

const USER_DATA_DIR = "./user_data";
const URL = "https://bankof.okra.ng";

const auth = {
	email: "ronireiosantos@gmail.com",
	password: "testpassword",
	otp: "12345"
}

const login = async () => {
	const browser = await puppeteer.launch({ headless: true,  userDataDir: USER_DATA_DIR });
	
	const page = await browser.newPage();
	
	page.on('dialog', async dialog => {
		console.log(dialog.message())
		await dialog.dismiss()
	})
	
	page.on('console', msg => {
		// Debugging the page using consoles
		console.log('PAGE LOG:', msg.text());
	});
	
	await page.goto(URL, { waitUntil: 'domcontentloaded' });
	await page.waitForSelector("body nav a:last-child", { visible: true })
	await page.click("body nav a:last-child")
	
	await page.waitForSelector("input#email", { visible: true })
	await page.type("input#email", auth.email)
	await page.type("input#password", auth.password)
	await page.click('button[type="submit"]')
	
	await page.waitForNavigation();
	
	await page.type("input#otp", auth.otp)
	await page.click('button[type="submit"]')
	await page.waitForNavigation();
	
	const dashboard_url = page.url();
	
	await browser.close();
	
	return { dashboard_url };
}

login().then(console.log).catch(console.error);

module.exports = { login };
