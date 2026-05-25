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
            return await loginPage.resetLogin();  
          }
          catch(error){
              console.error('Error when going back to login username page:', error);
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
}

module.exports = new LoginFlow();