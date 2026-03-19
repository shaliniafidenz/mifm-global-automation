const action = require('../utils/action.utils');

class LoginPage{

    get usernameField(){return $('android=new UiSelector().resourceId("username")');}
    get passwordField(){ return $('android=new UiSelector().resourceId("password")');}
    get loginButton(){ return $('android=new UiSelector().resourceId("kc-login")');}
    get homeTitle(){ return $('android=new UiSelector().resourceId("dashboard_title_label")');}

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
        return await action.getText(this.homeTitle);
    }
}

module.exports = new LoginPage();