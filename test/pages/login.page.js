const action = require('../utils/action.utils');
const waitUtils = require('../utils/wait.utils');

class LoginPage{

    get usernameField(){return $('android=new UiSelector().resourceId("username")');}
    get passwordField(){ return $('android=new UiSelector().resourceId("password")');}
    get loginButton(){ return $('android=new UiSelector().resourceId("kc-login")');}
    get errorMessageUsername(){ return $('android=new UiSelector().resourceId("input-error-username")');}
    get errorMessagePassword(){ return $('android=new UiSelector().resourceId("input-error-password")');}
    get goBackButton(){ return $('android=new UiSelector().resourceId("reset-login")');}
    get homeTitle(){ return $('android=new UiSelector().resourceId("dashboard_title_label")');}
    get loader(){ return $('android=new UiSelector().resourceId("dashboard_loader")');}

    // Login page title shown in the Mozart WebView ("Sign in to IFM DEV")
    get loginPageTitle(){ return $('android=new UiSelector().text("Sign in to IFM DEV")');}


    async enterUsername(username){
        //await this.usernameField.setValue(username);
        await action.type(this.usernameField, username);
    }

    async enterPassword(password){
        await action.type(this.passwordField, password);
    }

    async tapLogin(){
        //await this.loginButton.click();
        await action.click(this.loginButton);
    }

    async getHomeTitle(){
        return await action.getTextMultiPart(this.homeTitle);
    }

    async getUsernameErrorMessage(){
        return await action.getText(this.errorMessageUsername);
        
    }

    async getPasswordErrorMessage(){
        return await action.getText(this.errorMessagePassword);
    }

    async isLoginButtonVisible(){
        return await action.isDisplayed(this.loginButton);
    }

    async isUsernameVisible(){
        return await action.isDisplayed(this.usernameField);
    }
    async isPasswordVisible(){
        return await action.isDisplayed(this.passwordField);
    }
   
    async isUsernameErrorMessageVisible(){
        return await action.isDisplayed(this.errorMessageUsername);
    }

    async isPasswordErrorMessageVisible(){
        return await action.isDisplayed(this.errorMessagePassword);
    }

    async isLoginPageTitleVisible(){
        return await action.isDisplayed(this.loginPageTitle);
    }

    async waitForUsernameField(timeout = 8000){
        await this.usernameField.waitForDisplayed({
            timeout,
            timeoutMsg: `Email/username field did not appear within ${timeout}ms after back navigation`,
        });
    }

    async resetLogin(){
        await action.click(this.goBackButton);
    }

    async waitForUsernameError(timeout = 10000){
        await this.errorMessageUsername.waitForDisplayed({ timeout, timeoutMsg: 'Username error message did not appear after ' + timeout + ' ms' });
    }

    async waitForPasswordError(timeout = 10000){
        await this.errorMessagePassword.waitForDisplayed({ timeout, timeoutMsg: 'Password error message did not appear after ' + timeout + ' ms' });
    }

}

module.exports = new LoginPage();