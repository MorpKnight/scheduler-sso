const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
require('dotenv').config();

// schedule.scheduleJob('0 */5 * * *', async () => {
schedule.scheduleJob('*/1 * * * *', async () => {
    console.log(`${new Date().toLocaleTimeString()} | running job...`);
    const result = await jobToDo(process.env.SSO_USERNAME, process.env.SSO_PASSWORD);
    if(result) {
        console.log(`${new Date().toLocaleTimeString()} | job done!`);
    } else {
        console.log(`${new Date().toLocaleTimeString()} | job failed!`);
    }
});

const jobToDo = async (username, password) => {
    try {
        const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
        // const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        await page.goto('https://sso.ui.ac.id/cas/login?service=http%3A%2F%2Fgw-teknik.ui.ac.id%2Fcas%2Fgateway.php%3Fkey%3D661746a7f3928661746a7f3966%26browse%3D');

        while (await page.$('#username') === null) {
            await page.waitForTimeout(1000);
            console.log(`${new Date().toLocaleTimeString()} | waiting for page to load...`);
            await page.reload();
        }

        await page.type('#username', username);
        await page.type('#password', password);
        await page.click('button[type="submit"]');

        console.log(page.url());
        await page.waitForNavigation({ timeout: 1000 });
        
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};