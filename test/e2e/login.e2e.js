const loginFlow = require('../flows/login.flow');
const loginData = require('../fixtures/login.data');
const session = require('../flows/session.flow');
const allure = require('@wdio/allure-reporter').default;

describe('Login E2E Tests', ()=>{

    before(async()=>{
        // await session.logoutIfNeeded();
        await session.loginIfNeeded();
        
    })

    it('Verify user cannot login with invalid username', async ()=>{
        allure.addFeature('Login');
        allure.addSeverity('Critical');
        allure.addTag('negative');
        allure.addTag('regression');

        //This will cover TC_LOGIN_001, TC_LOGIN_002
        //logout if already logged in, to ensure we are on login page for negative tests
        await loginFlow.logout();

        await browser.pause(5000); // Pause to allow logout to complete and login page to load. Temporary solution.

        const isLoginPageDisplayed = await session.isLoginPageDisplayed();
        if(isLoginPageDisplayed){
            console.log('Already on login page, proceeding with negative login tests.');

            //TC_LOGIN_001: Empty username
            const emptyUsernameResult = await loginFlow.loginWithEmptyUsername();

            console.log('Result of login with empty username:', emptyUsernameResult);
            console.log('Length of result:',  emptyUsernameResult.length);
            
            expect(emptyUsernameResult.userNameVisible).toBe(true);
            expect(emptyUsernameResult.errorMessageVisible).toBe(true);
            expect(emptyUsernameResult.errorMessage).toContain('Invalid username or email');          

            //TC_LOGIN_002: Invalid username
            const invalidUsernameResult = await loginFlow.loginWithInvalidUsername();

            expect(invalidUsernameResult.userNameVisible).toBe(true);
            expect(invalidUsernameResult.errorMessageVisible).toBe(true);
            expect(invalidUsernameResult.errorMessage).toContain('Invalid username or email');
            
        }
        else{
            throw new Error('Unexpected app state: Login page is not displayed after logout. Cannot proceed with negative login tests.');
        }

    });

     it('Verify user cannot login with invalid password', async ()=>{
        allure.addFeature('Login');
        allure.addSeverity('Critical');
        allure.addTag('negative');
        allure.addTag('regression');

        //This will cover TC_LOGIN_003, TC_LOGIN_004

        const isLoginPageDisplayed = await session.isLoginPageDisplayed();

        if(isLoginPageDisplayed){

            await loginFlow.loginWithValidUsername();
            const isLoginPasswordDisplayed = await loginFlow.isLoginPasswordPageDisplayed();

            if(isLoginPasswordDisplayed){
                console.log('On login password page, proceeding with negative login tests.');

                //TC_LOGIN_003: Empty password
                const emptyPasswordResult = await loginFlow.loginWithEmptyPassword();
                expect(emptyPasswordResult.passwordVisible).toBe(true);
                expect(emptyPasswordResult.errorMessageVisible).toBe(true);
                expect(emptyPasswordResult.errorMessage).toContain('Invalid password');
                

                //TC_LOGIN_004: Invalid password
                const invalidPasswordResult = await loginFlow.loginWithInvalidPassword();
                expect(invalidPasswordResult.passwordVisible).toBe(true);
                expect(invalidPasswordResult.errorMessageVisible).toBe(true);
                expect(invalidPasswordResult.errorMessage).toContain('Invalid password');
               
            }
            else{
                throw new Error('Unexpected app state: Login password page is not displayed after entering valid username. Cannot proceed with negative login tests.');
            }
        }
        else{
            throw new Error('Unexpected app state: Login password page is not displayed after logout. Cannot proceed with negative login tests.');
        }

    });

    it('TC_LOGIN_005: Verify user can login with valid credentials', async ()=>{

        allure.addFeature('Login');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        //const appId = driver.capabilities.appPackage;
        //await driver.execute('mobile: activateApp', { appId: appId });
        const isLoginPasswordDisplayed = await loginFlow.isLoginPasswordPageDisplayed();
        if(isLoginPasswordDisplayed){
            await loginFlow.goBackToLoginUsernamePage();

            //In the login page
            await loginFlow.loginBeforeLoader();
            await session.waitForAppToLoad();
        }

        await browser.pause(3000); // Temporary pause to allow app to load after login. Replace with better wait strategy.

        const homeTitle = await loginFlow.getHomeTitle();
        expect(homeTitle).toContain('Active Work Orders');

    });
})