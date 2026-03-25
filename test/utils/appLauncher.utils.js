class AppLauncher {
    constructor() {
        
        this.maxRetries = 3;
    }

    getAppId() {
        return browser.capabilities['appium:appPackage'] 
            || browser.capabilities.appPackage;
    }

    async launchApp() {

        const appId = this.getAppId();
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            console.log(`🚀 Launch attempt ${attempt}`);

            try {
                await this.startFresh(appId);
                //await this.waitForAppReady(appId);

                console.log('✅ App launched successfully');
                return;
            } catch (err) {
                console.warn(`⚠️ Launch failed on attempt ${attempt}`);

                if (attempt === this.maxRetries) {
                    throw new Error('❌ App failed to launch after retries');
                }

                await driver.pause(3000); // wait before retry
            }
        }
    }

    async startFresh(appId) {
        try {
            await driver.terminateApp(appId);
        } catch (e) {}

        await driver.pause(2000);
        await driver.activateApp(appId);
    }

    async waitForAppReady() {
        const loginEl = await $('android=new UiSelector().resourceId("kc-login")');
        const homeEl = await $('android=new UiSelector().resourceId("footer_home_button")');

        await browser.waitUntil(async () => {
            return (await loginEl.isDisplayed().catch(() => false)) ||
                   (await homeEl.isDisplayed().catch(() => false));
        }, {
            timeout: 30000,
            timeoutMsg: 'App did not reach login/dashboard screen'
        });
    }
}

module.exports = new AppLauncher();