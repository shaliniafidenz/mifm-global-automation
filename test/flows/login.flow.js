const loginPage = require('../pages/login.page');

class LoginFlow {
    async login(username, password){
        await loginPage.enterUsername(username);
        await loginPage.tapLogin();

        await loginPage.enterPassword(password);
        await loginPage.tapLogin();
    }

    async loginAndGetHomeTitle(username, password){
        await this.login(username, password);
        
        //await loginPage.homeTitle.waitForDisplayed({ timeout: 60000 });
        
        return await loginPage.getHomeTitle();
    }
}

module.exports = new LoginFlow();