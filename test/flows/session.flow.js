const loginPage = require('../pages/login.page');
const loginData = require('../fixtures/login.data');
const loginFlow = require('./login.flow');
const waitUtils = require('../utils/wait.utils');

class SessionFlow{

    async waitForLoaderToDisappear(timeout = 60000){
        try{
            await browser.pause(5000); // Pause to allow any loader to appear

            if(await loginPage.loader.isDisplayed()){
                await loginPage.loader.waitForDisplayed({ timeout: timeout, reverse: true, timeoutMsg: 'Loader did not disappear within ' + timeout + ' milliseconds' });
            }
            else{
                return;
            }
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
            await waitUtils.waitForDisplayed(loginPage.homeTitle);
            return await loginPage.homeTitle.isDisplayed();
        }
        catch(error){
            console.error('Error checking if dashboard is displayed:', error);
            return false;
        }
    }

    async loginIfNeeded(){
        await this.waitForLoaderToDisappear();
        
        if(await this.isLoginPageDisplayed()){
            await loginFlow.login(loginData.validUser.username, loginData.validUser.password);
            await this.waitForLoaderToDisappear();

            console.log('Login performed as login page was displayed.');

           // return;
        }

       /* if(await this.isDashboardDisplayed()){
            console.log('Login successful, dashboard is displayed.');
        }*/
    }
}

module.exports = new SessionFlow();