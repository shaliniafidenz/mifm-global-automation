const loginPage = require('../pages/login.page');
const loginData = require('../fixtures/login.data');
const loginFlow = require('./login.flow');
const headerPage = require('../pages/header.page');
const footerPage = require('../pages/footer.page');
const commonPage = require('../pages/common.page');
const waitUtils = require('../utils/wait.utils');
const action = require('../utils/action.utils');
const appLauncher = require('../utils/appLauncher.utils');

class SessionFlow{

    async waitForAppToLoad(timeout = 60000){
        try{
            await browser.waitUntil(
                async () => {
                    const loginVisible = await action.isDisplayedSafe(loginPage.loginButton);
                    if (loginVisible) return true;
                    const dashVisible = await action.isDisplayedSafe(footerPage.homeFooterIcon);
                    return dashVisible;
                },
                { timeout, interval: 1000, timeoutMsg: 'App did not reach a stable state after ' + timeout + ' ms' }
            );
            console.log('App reached a stable state.');
        }
        catch(error){
            console.error('Error waiting for app to reach stable state:', error);
        }
    }

    async isLoginPageDisplayed(){
        try{
            //await waitUtils.waitForDisplayed(loginPage.loginButton);
            return await action.isDisplayed(loginPage.loginButton);
        }
        catch(error){
            console.error('Error checking if login page is displayed:', error);
            return false;
        }
    }

    async isDashboardDisplayed(){
        try{
            let homeFooterIcon = await footerPage.homeFooterIcon;
            //await waitUtils.waitForDisplayed(homeFooterIcon);
            return await action.isDisplayed(homeFooterIcon);
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
            await this.waitForDashboard();

            if(!(await this.isDashboardDisplayed())){
                throw new Error('Login failed, dashboard is not displayed after login attempt.');
            }

            console.log('Login successful, dashboard is displayed.');
            return;
        }

        
        throw new Error('Unknown app state: neither login page nor dashboard is displayed.');
       
    }

    async waitForDashboard(timeout = 60000){
        try{
            const homeFooterIcon = footerPage.homeFooterIcon;
            await homeFooterIcon.waitForDisplayed({
                timeout,
                timeoutMsg: 'Dashboard home footer did not appear after ' + timeout + ' ms'
            });
            console.log('Dashboard is ready.');
        }
        catch(error){
            console.error('Error waiting for dashboard:', error);
        }
    }

    async logoutIfNeeded(){
        try{
            console.log('Session check initiated. Checking if logout is required.');
            await this.waitForAppToLoad();

            if(await this.isLoginPageDisplayed()){
                console.log('Already logged out, login page is displayed.');
                return;
            }

            if(await this.isDashboardDisplayed()){
                console.log('Logged in, dashboard is displayed. Calling the logout flow.');

                await loginFlow.logout();

                const loader = await commonPage.loader;
                await waitUtils.waitToDisappear(loader,10000);
            }

        }
        catch(error){
            console.error('Error during logout process:', error);
        }
    }

    async ensureAppReady() {
        await appLauncher.launchApp();
    }
}

module.exports = new SessionFlow();