const loginPage = require('../pages/login.page');
const headerPage = require('../pages/header.page');
const commonPage = require('../pages/common.page');
const action = require('../utils/action.utils');
const loginData = require('../fixtures/login.data');

class LoginFlow {
    async login(username, password){
 
        await loginPage.enterUsername(username);
        await loginPage.tapLogin();

        await loginPage.enterPassword(password);
        await loginPage.tapLogin();
    }

    async loginBeforeLoader(){
        await loginPage.enterUsername(loginData.validUser.username);
        await loginPage.tapLogin();

        await loginPage.enterPassword(loginData.validUser.password);
        await loginPage.tapLogin();
    }

    async loginAndGetHomeTitle(username, password){
        await this.login(username, password);
        
        //await loginPage.homeTitle.waitForDisplayed({ timeout: 60000 });
        
        return await loginPage.getHomeTitle();
    }

    async loginWithValidUsername(){
        await loginPage.enterUsername(loginData.validUser.username);
        await loginPage.tapLogin();
    }

    async getHomeTitle(){ 
        return await loginPage.getHomeTitle();
    }

    async loginWithEmptyUsername(){
        try{
            await loginPage.enterUsername('');
            await loginPage.tapLogin();
            await loginPage.waitForUsernameError();

            const userNameVisible = await loginPage.isUsernameVisible();
            const errorMessageVisible = await loginPage.isUsernameErrorMessageVisible();
            const errorMessage = await loginPage.getUsernameErrorMessage();

            console.log('error message:', errorMessage);

            return {userNameVisible, errorMessageVisible, errorMessage};
        }
        catch(error){
            console.error('Error during login with empty username:', error);
            throw new Error('Login with empty username failed: ' + error.message);
        }
        
    }

    async loginWithInvalidUsername(){
        try{
            await loginPage.enterUsername(loginData.invalidUser.username);
            await loginPage.tapLogin();
            await loginPage.waitForUsernameError();

            const userNameVisible = await loginPage.isUsernameVisible();
            const errorMessageVisible = await loginPage.isUsernameErrorMessageVisible();
            const errorMessage = await loginPage.getUsernameErrorMessage();

            return {userNameVisible, errorMessageVisible, errorMessage};
        }
        catch(error){
            console.error('Error during login with invalid username:', error);
            throw new Error('Login with invalid username failed: ' + error.message);
        }
        
    }

    async loginWithEmptyPassword(){
        try{
            await loginPage.enterPassword('');
            await loginPage.tapLogin();
            await loginPage.waitForPasswordError();

            const passwordVisible = await loginPage.isPasswordVisible();
            const errorMessageVisible = await loginPage.isPasswordErrorMessageVisible();
            const errorMessage = await loginPage.getPasswordErrorMessage();

            return {passwordVisible, errorMessageVisible, errorMessage};
        }
        catch(error){
            console.error('Error during login with empty password:', error);
            throw new Error('Login with empty password failed: ' + error.message);
        }
        
    }

    async loginWithInvalidPassword(){
        try{
            await loginPage.enterPassword(loginData.invalidUser.password);
            await loginPage.tapLogin();
            await loginPage.waitForPasswordError();

            const passwordVisible = await loginPage.isPasswordVisible();
            const errorMessageVisible = await loginPage.isPasswordErrorMessageVisible();
            const errorMessage = await loginPage.getPasswordErrorMessage();

            return {passwordVisible, errorMessageVisible, errorMessage};
        }
        catch(error){
            console.error('Error during login with invalid password:', error);
            throw new Error('Login with invalid password failed: ' + error.message);
        }
        
    }

    async isLoginPasswordPageDisplayed(){
        try{
            return await loginPage.isPasswordVisible();  
          }
          catch(error){
              console.error('Error checking if login page is displayed:', error);
              return false;
          }
    }

    async goBackToLoginUsernamePage(){
        try{
            // The back button is android.view.View resource-id="reset-login"
            // (the inner android.widget.TextView text="" is just its icon child).
            await loginPage.resetLogin();
        }
        catch(error){
            // Fallback: Android KEYCODE_BACK (4) navigates the WebView back in history.
            console.warn('reset-login tap failed, falling back to KEYCODE_BACK:', error.message);
            try{
                await browser.pressKeyCode(4);
            }
            catch(fallbackError){
                console.error('KEYCODE_BACK press also failed:', fallbackError.message);
                return false;
            }
        }
        return true;
    }

    // Waits until the email/username field is visible — use this after
    // goBackToLoginUsernamePage() instead of a fixed pause + isDisplayed.
    async waitForUsernamePageAfterBack(timeout = 8000){
        try{
            await loginPage.waitForUsernameField(timeout);
            return true;
        }
        catch(error){
            console.error('Email/username field did not appear after back navigation:', error.message);
            return false;
        }
    }

    async logout(){
        await headerPage.openMenuDrawer();
        await headerPage.selectOptionFromDrawer('Logout');

        //prompts the confirmation alert, submit okay to confirm logout
        await headerPage.tapOkFromLogoutAlert();

        //waiting for login page to be displayed after logout
       // await loginPage.waitForLoginPageToDisplay();
        await commonPage.waitForLoaderToDisappear(); // wait for loader to disappear after logout, before proceeding with any further actions
    }

    // ─── UI state helpers ────────────────────────────────────────────────────

    async isLoginPageTitleDisplayed(){
        try{
            return await loginPage.isLoginPageTitleVisible();
        }
        catch(error){
            console.error('Error checking login page title visibility:', error);
            return false;
        }
    }

    async isUsernameFieldDisplayed(){
        try{
            return await loginPage.isUsernameVisible();
        }
        catch(error){
            console.error('Error checking username field visibility:', error);
            return false;
        }
    }

    async isSignInButtonDisplayed(){
        try{
            return await loginPage.isLoginButtonVisible();
        }
        catch(error){
            console.error('Error checking sign-in button visibility:', error);
            return false;
        }
    }

    // ─── Post-login header helpers ───────────────────────────────────────────

    async getLoggedInUsername(){
        try{
            return await headerPage.getLoggedInUsername();
        }
        catch(error){
            console.error('Error getting logged-in username from header:', error);
            return null;
        }
    }

    async isUsernameLabelVisible(){
        try{
            return await headerPage.isUsernameLabelVisible();
        }
        catch(error){
            console.error('Error checking username label visibility:', error);
            return false;
        }
    }

    // ─── Loading screen helper ───────────────────────────────────────────────

    /**
     * Polls until dashboard_loader becomes visible, then returns true.
     * Returns false if the loader never appears within the timeout
     * (it may have appeared and vanished before the first poll — treat as warning).
     */
    async waitForLoaderToAppear(timeout = 8000){
        try{
            await browser.waitUntil(
                async () => await action.isDisplayedSafe(commonPage.loader),
                { timeout, interval: 200, timeoutMsg: `Loader did not appear after ${timeout}ms` }
            );
            return true;
        }
        catch(error){
            console.warn('Loader was not detected within timeout — it may have appeared and disappeared before the first poll');
            return false;
        }
    }
}

module.exports = new LoginFlow();