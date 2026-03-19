const loginFlow = require('../flows/login.flow');
const loginData = require('../fixtures/login.data');
const allure = require('@wdio/allure-reporter').default;

describe('Login E2E Tests', ()=>{

    it('TC_LOGIN_001: Verify user can login with valid credentials', async ()=>{

        allure.addFeature('Login');
        allure.addSeverity('Critical');

        //const appId = driver.capabilities.appPackage;
        //await driver.execute('mobile: activateApp', { appId: appId });
        

        const homeTitle = await loginFlow.loginAndGetHomeTitle(
            loginData.validUser.username,
            loginData.validUser.password
        );

        expect(homeTitle).toContain('Active Work Orders');

    });
})