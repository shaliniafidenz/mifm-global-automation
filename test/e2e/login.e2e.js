// ============================================================
// LOGIN E2E TEST SUITE
// ============================================================
//
// Test coverage map
// -----------------
// TC_LOGIN_001  Verify user cannot login with empty username
//               → stays on login page, shows "Invalid username or email"
//
// TC_LOGIN_002  Verify user cannot login with invalid username
//               → stays on login page, shows "Invalid username or email"
//
// TC_LOGIN_003  Verify user cannot login with empty password
//               → stays on password page, shows "Invalid password"
//
// TC_LOGIN_004  Verify user cannot login with invalid password
//               → stays on password page, shows "Invalid password"
//
// TC_LOGIN_005  Verify user can login with valid credentials
//               → loader appears → home screen with "Active Work Orders" title
//
// TC_LOGIN_006  Verify login page title "Sign in to IFM DEV" is displayed
//               → Mozart WebView title element visible on login page
//
// TC_LOGIN_007  Verify login page UI elements are visible
//               → username input field + Sign In button both visible
//
// TC_LOGIN_008  Verify navigation to password page after entering valid username
//               → enter valid username → tap Sign In → password field appears
//
// TC_LOGIN_009  Verify back navigation from password page returns to username page
//               → on password page → tap reset/back → username field reappears
//
// TC_LOGIN_010  Verify loading screen (dashboard_loader) is displayed during login
//               → submit valid credentials → loader is detected → home screen loads
//
// TC_LOGIN_011  Verify correct logged-in username is displayed on home screen
//               → header_username_label is visible and contains non-empty display name
//
// TC_LOGIN_012  Verify bottom navigation bar (Home button) is visible after login
//               → footer_home_button is present on home screen
//
// TC_LOGIN_013  Verify user can successfully logout
//               → open drawer → Logout → OK → returns to login page
//
// ============================================================

const loginFlow = require('../flows/login.flow');
const loginData = require('../fixtures/login.data');
const session = require('../flows/session.flow');
const allure = require('@wdio/allure-reporter').default;

describe('Login E2E Tests', ()=>{

    before(async()=>{
        // Ensure we start every run on the sign-in page.
        // If the app is already on the home screen it logs out once; if it is
        // already on the sign-in page this is a no-op — no unnecessary login cycle.
        await session.logoutIfNeeded();
    })

    it('TC_LOGIN_001: Verify user cannot login with invalid username', async ()=>{
        allure.addFeature('Login');
        allure.addSeverity('Critical');
        allure.addTag('negative');
        allure.addTag('regression');

        // before() guarantees we start on the sign-in page.
        // Guard handles running this test in isolation (before() logs out if needed,
        // but if something is still wrong we catch it here).
        if(await session.isDashboardDisplayed()){
            await loginFlow.logout();
            await browser.pause(4000);
        }

        const isLoginPageDisplayed = await session.isLoginPageDisplayed();
        if(isLoginPageDisplayed){

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

     it('TC_LOGIN_002: Verify user cannot login with invalid password', async ()=>{
        allure.addFeature('Login');
        allure.addSeverity('Critical');
        allure.addTag('negative');
        allure.addTag('regression');

        // before() guarantees sign-in page; TC_LOGIN_001 also ends on sign-in page.
        // Guard handles running this test in isolation.
        if(await session.isDashboardDisplayed()){
            await loginFlow.logout();
            await browser.pause(4000);
        }

        const isLoginPageDisplayed = await session.isLoginPageDisplayed();

        if(isLoginPageDisplayed){

            await loginFlow.loginWithValidUsername();
            await browser.pause(3000); // wait for password page navigation to complete
            const isLoginPasswordDisplayed = await loginFlow.isLoginPasswordPageDisplayed();

            if(isLoginPasswordDisplayed){
                console.log('On login password page, proceeding with negative login tests.');

                try{
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
                finally{
                    // Always return to username page so the next test starts clean
                    if(await loginFlow.isLoginPasswordPageDisplayed()){
                        await loginFlow.goBackToLoginUsernamePage();
                        await loginFlow.waitForUsernamePageAfterBack(8000);
                    }
                }
            }
            else{
                throw new Error('Unexpected app state: Login password page is not displayed after entering valid username. Cannot proceed with negative login tests.');
            }
        }
        else{
            throw new Error('Unexpected app state: Login page is not displayed. Cannot proceed with negative login tests.');
        }

    });

    it('TC_LOGIN_005: Verify user can login with valid credentials', async ()=>{

        allure.addFeature('Login');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        //const appId = driver.capabilities.appPackage;
        //await driver.execute('mobile: activateApp', { appId: appId });
        if(await loginFlow.isLoginPasswordPageDisplayed()){
            await loginFlow.goBackToLoginUsernamePage();
            await loginFlow.waitForUsernamePageAfterBack(8000);
        }

        if(await session.isLoginPageDisplayed()){
            await loginFlow.loginBeforeLoader();
            // waitForAppToLoad() is NOT safe here — after clicking Sign In the
            // Keycloak WebView briefly still shows the kc-login button during
            // the page transition, which makes waitForAppToLoad() return early.
            // waitForDashboard() waits specifically for footer_home_button which
            // only appears after the full loading sequence completes.
            await session.waitForDashboard();
        }

        const homeTitle = await loginFlow.getHomeTitle();
        expect(homeTitle).toContain('Active Work Orders');

    });

    // ──────────────────────────────────────────────────────────────────────────
    // NEW SCENARIOS — login page UI, navigation, loader, post-login state
    // ──────────────────────────────────────────────────────────────────────────

    it('TC_LOGIN_006: Verify login page title "Sign in to IFM DEV" is displayed', async ()=>{
        allure.addFeature('Login');
        allure.addSeverity('Normal');
        allure.addTag('smoke');
        allure.addTag('regression');

        // Ensure we are on the login page (TC_LOGIN_005 ends logged in)
        if(await session.isDashboardDisplayed()){
            await loginFlow.logout();
            await browser.pause(4000);
        }

        expect(await session.isLoginPageDisplayed()).toBe(true);

        const isTitleDisplayed = await loginFlow.isLoginPageTitleDisplayed();
        expect(isTitleDisplayed).toBe(true);
    });

    it('TC_LOGIN_007: Verify login page UI elements (username field + Sign In button) are visible', async ()=>{
        allure.addFeature('Login');
        allure.addSeverity('Normal');
        allure.addTag('smoke');
        allure.addTag('regression');

        // Guard: handle isolation — start logged in
        if(await session.isDashboardDisplayed()){
            await loginFlow.logout();
            await browser.pause(4000);
        }

        expect(await session.isLoginPageDisplayed()).toBe(true);

        const isUsernameFieldVisible = await loginFlow.isUsernameFieldDisplayed();
        const isSignInButtonVisible  = await loginFlow.isSignInButtonDisplayed();

        expect(isUsernameFieldVisible).toBe(true);
        expect(isSignInButtonVisible).toBe(true);
    });

    it('TC_LOGIN_008: Verify user is navigated to password page after entering valid username', async ()=>{
        allure.addFeature('Login');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        // Guard: handle isolation — start logged in
        if(await session.isDashboardDisplayed()){
            await loginFlow.logout();
            await browser.pause(4000);
        }

        expect(await session.isLoginPageDisplayed()).toBe(true);

        // Enter valid username and tap Sign In — should navigate to password page
        await loginFlow.loginWithValidUsername();
        await browser.pause(3000); // allow WebView navigation to settle

        const isPasswordPageDisplayed = await loginFlow.isLoginPasswordPageDisplayed();
        expect(isPasswordPageDisplayed).toBe(true);
    });

    it('TC_LOGIN_009: Verify back navigation from password page returns to username page', async ()=>{
        allure.addFeature('Login');
        allure.addSeverity('Normal');
        allure.addTag('regression');

        // Should be on password page from TC_LOGIN_008; recover if not
        if(!(await loginFlow.isLoginPasswordPageDisplayed())){
            if(await session.isDashboardDisplayed()){
                await loginFlow.logout();
                await browser.pause(4000);
            }
            if(await session.isLoginPageDisplayed()){
                await loginFlow.loginWithValidUsername();
                await browser.pause(3000);
            } else {
                throw new Error('Unexpected app state: not on login page or password page');
            }
        }

        expect(await loginFlow.isLoginPasswordPageDisplayed()).toBe(true);

        // Tap the back link; fall back to KEYCODE_BACK if element tap fails
        await loginFlow.goBackToLoginUsernamePage();

        // Wait explicitly for the email/username field — avoids a race between
        // the fixed pause and WebView's variable navigation speed
        const isUsernamePageDisplayed = await loginFlow.waitForUsernamePageAfterBack(8000);
        expect(isUsernamePageDisplayed).toBe(true);
    });

    it('TC_LOGIN_010: Verify loading screen (dashboard_loader) is displayed during login', async ()=>{
        allure.addFeature('Login');
        allure.addSeverity('Normal');
        allure.addTag('smoke');
        allure.addTag('regression');

        // Ensure we are on the username login page
        if(await session.isDashboardDisplayed()){
            await loginFlow.logout();
            await browser.pause(4000);
        }
        if(await loginFlow.isLoginPasswordPageDisplayed()){
            await loginFlow.goBackToLoginUsernamePage();
            await loginFlow.waitForUsernamePageAfterBack(8000);
        }

        expect(await session.isLoginPageDisplayed()).toBe(true);

        // Submit valid credentials then immediately watch for the loader
        await loginFlow.loginBeforeLoader();
        const loaderDetected = await loginFlow.waitForLoaderToAppear(8000);
        expect(loaderDetected).toBe(true);

        // Wait for the app to fully load before the next test
        await session.waitForDashboard();
    });

    it('TC_LOGIN_011: Verify correct logged-in username is displayed on the home screen', async ()=>{
        allure.addFeature('Login');
        allure.addSeverity('Normal');
        allure.addTag('regression');

        // Guard: TC_LOGIN_010 ends logged in; handle isolation
        if(await session.isLoginPageDisplayed()){
            await loginFlow.loginBeforeLoader();
            await session.waitForDashboard();
        }

        expect(await session.isDashboardDisplayed()).toBe(true);

        // header_username_label should be visible and contain a non-empty display name
        const isLabelVisible = await loginFlow.isUsernameLabelVisible();
        expect(isLabelVisible).toBe(true);

        const displayName = await loginFlow.getLoggedInUsername();
        expect(displayName).toBeTruthy();
        expect(displayName.trim().length).toBeGreaterThan(0);
    });

    it('TC_LOGIN_012: Verify bottom navigation bar (Home button) is visible on the home screen', async ()=>{
        allure.addFeature('Login');
        allure.addSeverity('Normal');
        allure.addTag('smoke');
        allure.addTag('regression');

        // Guard: should still be logged in from TC_LOGIN_011
        if(await session.isLoginPageDisplayed()){
            await loginFlow.loginBeforeLoader();
            await session.waitForDashboard();
        }

        // isDashboardDisplayed() asserts footer_home_button is visible
        const isHomeFooterVisible = await session.isDashboardDisplayed();
        expect(isHomeFooterVisible).toBe(true);
    });

    it('TC_LOGIN_013: Verify user can successfully logout', async ()=>{
        allure.addFeature('Login');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        // Guard: should be logged in; log in if we are somehow on the login page
        if(await session.isLoginPageDisplayed()){
            await loginFlow.loginBeforeLoader();
            await session.waitForDashboard();
        }

        expect(await session.isDashboardDisplayed()).toBe(true);

        await loginFlow.logout();
        await browser.pause(4000); // allow the login page to fully render after logout

        const isLoginPageDisplayed = await session.isLoginPageDisplayed();
        expect(isLoginPageDisplayed).toBe(true);
    });

})