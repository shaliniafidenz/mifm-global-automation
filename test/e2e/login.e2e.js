const loginFlow = require('../flows/login.flow');
const loginData = require('../fixtures/login.data');
const session = require('../flows/session.flow');
const allure = require('@wdio/allure-reporter').default;

describe('Login E2E Tests', ()=>{

    before(async()=>{
      //  await session.ensureAppReady();
        await session.loginIfNeeded();
    })

    it('TC_LOGIN_001: Verify user can login with valid credentials', async ()=>{

        allure.addFeature('Login');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        //const appId = driver.capabilities.appPackage;
        //await driver.execute('mobile: activateApp', { appId: appId });
        

        const homeTitle = await loginFlow.getHomeTitle();

        expect(homeTitle).toContain('Active Work Orders');

    });
})