const dashboardFlow = require('../flows/dashboard.flow');
const ppmFlow = require('../flows/ppm.flow');
const ppmLandingPage = require('../pages/ppm/ppmLanding.page');
const commonPage = require('../pages/common.page');
const ppmData = require('../fixtures/ppm.data');
const session = require('../flows/session.flow');
const allure = require('@wdio/allure-reporter').default;

describe('PPM E2E Tests', ()=>{

    before(async()=>{
        await session.loginIfNeeded();
    })

    it.skip('TC_PPM_001: Verify user can navigate to PPM List from bottom navigation', async ()=>{
        allure.addFeature('PPM');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        const ppmTitle = await ppmFlow.navigateToPPMFromBottomNav();
        expect(ppmTitle).toContain('PPM Work Order');

        await browser.pause(2000);
        await dashboardFlow.navigateToDashboardFromFooter();

    });

    it.skip('TC_PPM_002: Verify user can navigate to PPM List from the right side drawer', async ()=>{
        allure.addFeature('PPM');
        allure.addSeverity('Critical');
        allure.addTag('smoke');

        const ppmTitle = await ppmFlow.navigateToPPMFromRightMenuDrawer();
        expect(ppmTitle).toContain('PPM Work Order');

        console.log('PPM List title verified successfully from 002.');

        await browser.pause(2000);
        await dashboardFlow.navigateToDashboardFromFooter();

    });

    it.skip('TC_PPM_003: Verify user can navigate to PPM List from the bottom menu', async()=>{
        allure.addFeature('PPM');
        allure.addSeverity('Critical');
        allure.addTag('smoke');

        const ppmTitle = await ppmFlow.navigateToPPMFromBottomMenu();
        expect(ppmTitle).toContain('PPM Work Order');

        await browser.pause(2000);
        await dashboardFlow.navigateToDashboardFromFooterMenu();

    });

    it.skip('TC_PPM_005: Verify PPM list loads correctly', async()=>{
        allure.addFeature('PPM');
        allure.addSeverity('Critical');
        allure.addTag('regression');

        await ppmFlow.navigateToPPMFromBottomNav();

        await browser.pause(2000);

        //validate PPM Cards are Visible, List is visible for each status if there are work orders and "No results found" message is visible if there are no work orders for a given status.
        //This will cover TC_PPM_005 and TC_PPM_007

        const statusArray = ['New', 'Assignment', 'Acknowledgement', 'In-Progress', 'Completed'];

        for(const status of statusArray){
            const ppmCountData = await ppmFlow.getWorkOrderDataForGivenStatus(status);
            console.log(`Status: ${status}, Card Visible: ${ppmCountData.isCardVisible}, Total Work Orders: ${ppmCountData.totalNoOfWorkOrders}, List Visible: ${ppmCountData.isListVisible}`);

            expect(ppmCountData.isCardVisible).toBe(true);

            if(ppmCountData.totalNoOfWorkOrders > 0){
                expect(ppmCountData.isListVisible).toBe(true);
            }
            else{
                //This will cover TC_PPM_007
                const isNoResultsMessageVisible = await ppmFlow.isNoResultsFoundMessageVisible();
                expect(isNoResultsMessageVisible).toBe(true);
                expect(ppmCountData.isListVisible).toBe(false);
            }

        }
    });

    it.skip('TC_PPM_004: Create a new PPM', async()=>{
        allure.addFeature('PPM');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        await ppmFlow.navigateToPPMFromBottomNav();

        //Assert Create PPM Button is visible
        const isPPMCreateButtonVisible = await ppmLandingPage.isPPMCreateButtonVisible();
        expect(isPPMCreateButtonVisible).toBe(true);

        //Create PPM if the button is visible
        if(isPPMCreateButtonVisible){
            const ppmDetailsHeader = await ppmFlow.createPPM();
            console.log('PPM Details Header Text:', ppmDetailsHeader);

            expect(ppmDetailsHeader.ppmNumber).toContain('PPM');
            expect(ppmDetailsHeader.status).toContain('NEW');

            await commonPage.tapBack();
            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        }

    });

    it.skip('TC_CREATE_PPM_002: Mandatory field validation', async()=>{
        allure.addFeature('PPM');
        allure.addSeverity('Critical');
        allure.addTag('regression');

        await ppmFlow.navigateToPPMFromBottomNav();
        await browser.pause(2000);

        const errorMessagesArray = await ppmFlow.returnErrorMessageForCreatingPPMWithEmptyFields();

        // Validate error messages for each required field
        expect(errorMessagesArray.masterWORequired).toBe(true);
        expect(errorMessagesArray.checklistRequired).toBe(true);
        expect(errorMessagesArray.frequencyRequired).toBe(true);

        await commonPage.tapBack();
        await browser.pause(2000);
        await dashboardFlow.navigateToDashboardFromFooter();

    });

    it.skip('TC_PPM_008: Reset PPM creation', async()=>{
        allure.addFeature('PPM');
        allure.addTag('regression');

        await ppmFlow.navigateToPPMFromBottomNav();
        const ppmValuesAfterReset = await ppmFlow.resetPPM();

        console.log('PPM Values after Reset:', ppmValuesAfterReset);
        expect(ppmValuesAfterReset.building).toBe('-');
        expect(ppmValuesAfterReset.location).toBe('-');
        expect(ppmValuesAfterReset.masterWOValue).toBe('-');
        expect(ppmValuesAfterReset.checklistValue).toBe('-');
        expect(ppmValuesAfterReset.frequency).toBe('-');

        await commonPage.tapBack();
        await browser.pause(2000);
        await dashboardFlow.navigateToDashboardFromFooter();

    });

    it.skip('TC_PPM_011: Assign a Supervisor to a New PPM', async()=>{
        allure.addFeature('PPM');
        allure.addTag('regression');
        allure.addTag('smoke');
        allure.addSeverity('Critical');

        await ppmFlow.navigateToPPMFromBottomNav();

        //Get all PPMs to ensure we have a predictable list of Pending PPMs
        await ppmFlow.getAllPPMs();

        //Tap on a random visible Pending PPM card
        await ppmFlow.tapWorkOrderFromTheListByStatus('New');

        //Assign a supervisor to it. Validate the supervisor is assigned successfully by checking the assigned supervisor name on the PPM details screen and also validate the status of the PPM changes to "In-Progress"
        const selectedSupervisor = await ppmFlow.assignSupervisorToPendingPPM();

        await browser.pause(5000);
        await commonPage.tapBack();

        await browser.pause(2000);
        await dashboardFlow.navigateToDashboardFromFooter();
    });

    it('TC_PPM_012: Assign a Technician to an Assignment PPM', async()=>{
        allure.addFeature('PPM');
        allure.addTag('regression');
        allure.addTag('smoke');
        allure.addSeverity('Critical');

        await ppmFlow.navigateToPPMFromBottomNav();

        //Get all PPMs to ensure we have a predictable list of In-Progress PPMs
        await ppmFlow.getAllPPMs();

        //Tap on a random visible In-Progress PPM card
        await ppmFlow.tapWorkOrderFromTheListByStatus('Assignment');

        //Assign a technician to it. Validate the technician is assigned successfully by checking the assigned technician name on the PPM details screen
        const selectedTechnician = await ppmFlow.assignTechnicianToInProgressPPM();
        console.log('Selected Technician:', selectedTechnician);

        await browser.pause(5000);
        await commonPage.tapBack();

        await browser.pause(2000);
        await dashboardFlow.navigateToDashboardFromFooter();
    });
});
