const dashboardFlow = require('../flows/dashboard.flow');
const cwoFlow = require('../flows/cwo.flow');
const cwoData = require('../fixtures/cwo.data');
const session = require('../flows/session.flow');
const allure = require('@wdio/allure-reporter').default;

describe('CWO E2E Tests', ()=>{

    before(async()=>{
        await session.loginIfNeeded();
    })

    it('TC_CWO_001: Verify user can navigate to CWO List from bottom navigation', async ()=>{

        allure.addFeature('CWO');
        allure.addSeverity('Critiical');
        allure.addTag('smoke');
        allure.addTag('regression');

        const cwoTitle = await cwoFlow.navigateToCWOFromBottomNav();
        expect(cwoTitle).toContain('Corrective Work Order');

        await dashboardFlow.navigateToDashboardFromFooter();
    
    });

    it('TC_CWO_002: Verify user can navigate to CWO List from the right side drawer', async ()=>{

        allure.addFeature('CWO');
        allure.addSeverity('Critiical');
        allure.addTag('smoke');

        const cwoTitle = await cwoFlow.navigateToCWOFromRightMenuDrawer();
        expect(cwoTitle).toContain('Corrective Work Order');

        console.log('CWO List title verified successfully from 002.');

        await dashboardFlow.navigateToDashboardFromFooter();
        //await dashboardFlow.navigateToDashboardFromRightDrawer();
    
    });

    it('TC_CWO_003: Verify user can navigate to CWO List from the bottom menu', async()=>{
        allure.addFeature('CWO');
        allure.addSeverity('Critiical');
        allure.addTag('smoke');

        const cwoTitle = await cwoFlow.navigateToCWOFromBottomMenu();
        expect(cwoTitle).toContain('Corrective Work Order');

        await dashboardFlow.navigateToDashboardFromFooterMenu();
       
    });
});
