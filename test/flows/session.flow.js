const loginPage = require('../pages/login.page');
const loginData = require('../fixtures/login.data');
const loginFlow = require('./login.flow');
const footerPage = require('../pages/footer.page');
const waitUtils = require('../utils/wait.utils');
const appLauncher = require('../utils/appLauncher.utils');

class SessionFlow{

    async waitForAppToLoad(timeout = 60000){
        try{
            await browser.pause(5000); // Pause to allow any loader to appear
            await waitUtils.waitForDisplayed(loginPage.loader);
            console.log('Loader appeared, waiting for it to disappear.');

            await loginPage.loader.waitForDisplayed({
                reverse: true,
                timeout: timeout,
                timeoutMsg: 'Loader did not disappear after ' + timeout + ' ms'
            });
            console.log('Loader disappeared, app is ready.');
            
            
        }
        catch(error){
            console.error('Error waiting for loader to disappear:', error);
        }
    }

    async isLoginPageDisplayed(){
        try{
            await waitUtils.waitForDisplayed(loginPage.loginButton);
            return await loginPage.loginButton.isDisplayed();
        }
        catch(error){
            console.error('Error checking if login page is displayed:', error);
            return false;
        }
    }

    async isDashboardDisplayed(){
        try{
            await waitUtils.waitForDisplayed(footerPage.homeFooterIcon);
            return await footerPage.homeFooterIcon.isDisplayed();
        }
        catch(error){
            console.error('Error checking if dashboard is displayed:', error);
            return false;
        }
    }

    async loginIfNeeded(){

        console.log('Session check initiated. Checking if login is required.');
        await this.waitForAppToLoad();

        if(await this.isDashboardDisplayed()){
            console.log('Already logged in, dashboard is displayed.');
            return;
        }
        
        if(await this.isLoginPageDisplayed()){
            console.log('Login page is displayed, performing login.');

            await loginFlow.login(loginData.validUser.username, loginData.validUser.password);
            await this.waitForAppToLoad();

            if(!(await this.isDashboardDisplayed())){
                throw new Error('Login failed, dashboard is not displayed after login attempt.');
            }

            console.log('Login successful, dashboard is displayed.');
            return;
        }

        
        throw new Error('Unknown app state: neither login page nor dashboard is displayed.');
       
    }

    async ensureAppReady() {
        await appLauncher.launchApp();
    }
}

module.exports = new SessionFlow();