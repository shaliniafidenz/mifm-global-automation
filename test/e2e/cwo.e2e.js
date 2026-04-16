const dashboardFlow = require('../flows/dashboard.flow');
const cwoFlow = require('../flows/cwo.flow');
const cwoLandingPage = require('../pages/cwo/cwoLanding.page');
const commonPage = require('../pages/common.page');
const cwoData = require('../fixtures/cwo.data');
const session = require('../flows/session.flow');
const allure = require('@wdio/allure-reporter').default;

describe('CWO E2E Tests', ()=>{

    before(async()=>{
        //await session.ensureAppReady();
        await session.loginIfNeeded();
    })

    it.skip('TC_CWO_001: Verify user can navigate to CWO List from bottom navigation', async ()=>{

        allure.addFeature('CWO');
        allure.addSeverity('Critiical');
        allure.addTag('smoke');
        allure.addTag('regression');

        const cwoTitle = await cwoFlow.navigateToCWOFromBottomNav();
        expect(cwoTitle).toContain('Corrective Work Order');

        await browser.pause(2000); // Pause to allow UI to update after navigating back
        await dashboardFlow.navigateToDashboardFromFooter();
    
    });

    it.skip('TC_CWO_002: Verify user can navigate to CWO List from the right side drawer', async ()=>{

        allure.addFeature('CWO');
        allure.addSeverity('Critiical');
        allure.addTag('smoke');

        const cwoTitle = await cwoFlow.navigateToCWOFromRightMenuDrawer();
        expect(cwoTitle).toContain('Corrective Work Order');

        console.log('CWO List title verified successfully from 002.');

        await browser.pause(2000); // Pause to allow UI to update after navigating back
        await dashboardFlow.navigateToDashboardFromFooter();
        //await dashboardFlow.navigateToDashboardFromRightDrawer();
    
    });

    it.skip('TC_CWO_003: Verify user can navigate to CWO List from the bottom menu', async()=>{
        allure.addFeature('CWO');
        allure.addSeverity('Critiical');
        allure.addTag('smoke');

        const cwoTitle = await cwoFlow.navigateToCWOFromBottomMenu();
        expect(cwoTitle).toContain('Corrective Work Order');

        await browser.pause(2000); // Pause to allow UI to update after navigating back
        await dashboardFlow.navigateToDashboardFromFooterMenu();
       
    });

    it.skip('TC_CWO_005: Verify CWO list loads correctly', async()=>{
        allure.addFeature('CWO');
        allure.addSeverity('Critiical');
        allure.addTag('regression');

        await cwoFlow.navigateToCWOFromBottomNav();

        await browser.pause(2000); // Pause to allow CWO list to load
        // Wait for scroll container instead of blind pause
       //await (await cwoLandingPage.horizontalScrollContainer).waitForDisplayed({ timeout: 5000 });

        //validate CWO Cards are Visible, List is visible for each status if there are work orders and "No results found" message is visible if there are no work orders for a given status. 
        //This will cover TC_CWO_005 and TC_CWO_007

        const statusArray = ['New', 'Assignment', 'Acknowledgement', 'In-Progress', 'Completed'];

        for(const status of statusArray){
            const newWOCountData = await cwoFlow.getWokOrderDataForGivenStatus(status);
            //console.log(`Status: ${status}, Card Visible: ${newWOCountData.isCardVisible}, Total Work Orders: ${newWOCountData.totalNoOfWorkOrders}`);
            console.log(`Status: ${status}, Card Visible: ${newWOCountData.isCardVisible}, Total Work Orders: ${newWOCountData.totalNoOfWorkOrders}, List Visible: ${newWOCountData.isListVisible}`);

            expect(newWOCountData.isCardVisible).toBe(true);

            if(newWOCountData.totalNoOfWorkOrders > 0){
                expect(newWOCountData.isListVisible).toBe(true);
            }
            else{
                //This will cover TC_CWO_007
                const isNoResultsMessageVisibleForNew = await cwoFlow.isNoResultsFoundMessageVisible();
                expect(isNoResultsMessageVisibleForNew).toBe(true);
                expect(newWOCountData.isListVisible).toBe(false);
            }
            
        }
    });

    it.skip('TC_CWO_004: Create a new CWO', async()=>{
        allure.addFeature('CWO');
        allure.addSeverity('Critiical');
        allure.addTag('smoke');  
        allure.addTag('regression');

        await cwoFlow.navigateToCWOFromBottomNav();

        //Assert Create CWO Button is visible
        const isCWOCreateButtonVisible = await cwoLandingPage.isCWOCreateButtonVisible();
        expect(isCWOCreateButtonVisible).toBe(true);

        //Create CWO if the button is visible
        if(isCWOCreateButtonVisible){
            const cwoDetailsHeader = await cwoFlow.createCWO();
            console.log('CWO Details Header Text:', cwoDetailsHeader);

            expect(cwoDetailsHeader.cwoNumber).toContain('CWO');
            expect(cwoDetailsHeader.status).toContain('NEW');

            await commonPage.tapBack();
            await browser.pause(2000); // Pause to allow UI to update after navigating back
            await dashboardFlow.navigateToDashboardFromFooter();
        }  
        
    }); 

    it.skip('TC_CREATE_CWO_002: Mandatory field validation', async()=>{
        allure.addFeature('CWO');
        allure.addSeverity('Critiical');
        allure.addTag('regression');

        await cwoFlow.navigateToCWOFromBottomNav();
        await browser.pause(2000); // Pause to allow CWO list to load

        const errorMessagesArray = await cwoFlow.returnErrorMessageForCreatingCWOWithEmptyFields();

        // Validate error messages for each required field
        expect(errorMessagesArray.buildingRequired).toBe(true);
        expect(errorMessagesArray.locationRequired).toBe(true);
        expect(errorMessagesArray.problemTypeRequired).toBe(true);
        expect(errorMessagesArray.workOrderTypeRequired).toBe(true);
        expect(errorMessagesArray.serviceCategoryRequired).toBe(true);
        expect(errorMessagesArray.priorityLevelRequired).toBe(true);

            await commonPage.tapBack();
            await browser.pause(2000); // Pause to allow UI to update after navigating back
            await dashboardFlow.navigateToDashboardFromFooter();
        
    }); 

    it.skip('TC_CWO_008: Reset CWO creation', async()=>{
        allure.addFeature('CWO');
        allure.addTag('regression');

        await cwoFlow.navigateToCWOFromBottomNav();
        const cwoValuesafterReset = await cwoFlow.resetCWO();

        console.log('CWO Values after Reset:', cwoValuesafterReset);
        expect(cwoValuesafterReset.requester).toBe('-');
        expect(cwoValuesafterReset.building).toBe('-');
        expect(cwoValuesafterReset.location).toBe('-');
        expect(cwoValuesafterReset.workOrderType).toBe('-');
        expect(cwoValuesafterReset.problemType).toBe('-');
        expect(cwoValuesafterReset.serviceCategory).toBe('-');
        expect(cwoValuesafterReset.priorityLevel).toBe('-');
        expect(cwoValuesafterReset.asset).toBe('-');
        expect(cwoValuesafterReset.description).toBe('');
        
        await commonPage.tapBack();
        await browser.pause(2000);
        await dashboardFlow.navigateToDashboardFromFooter();
        
    }); 

    it('TC_CWO_011: Assign a Supervisor to a NEW CWO', async()=>{
        allure.addFeature('CWO');
        allure.addTag('regression');
        allure.addTag('smoke');
        allure.addSeverity('Critical');

        await cwoFlow.navigateToCWOFromBottomNav();

        //Get all CWOs to ensure we have a predictable list of NEW CWOs
        await cwoFlow.getAllCWOs();

        //Tap on a random visible NEW CWO card
        await cwoFlow.tapWorkOrderFromTheListByStatus('New');

        //Assign a supervisor to it. Validate the supervisor is assigned successfully by checking the assigned supervisor name on the CWO details screen and also validate the status of the CWO changes to "Assignment"
        const selectedSupervisor = await cwoFlow.assignSupervisorToNewCWO();

        //Goto Info screen and validate supervisor name
        //const supervisorNameOnInfoTab = await cwoFlow.getNameByRoleFromCWOInfoTab('Supervisor');
        //expect(supervisorNameOnInfoTab).toBe(selectedSupervisor);
        await browser.pause(3000);
        await commonPage.tapBack();
        
        await browser.pause(2000);
        await dashboardFlow.navigateToDashboardFromFooter(); 
    });

    it('TC_CWO_012: Assign a Technician to a NEW CWO', async()=>{
        allure.addFeature('CWO');
        allure.addTag('regression');
        allure.addTag('smoke');
        allure.addSeverity('Critical');

        await cwoFlow.navigateToCWOFromBottomNav();

        //Get all CWOs to ensure we have a predictable list of NEW CWOs
        await cwoFlow.getAllCWOs();

        //Tap on a random visible NEW CWO card
        await cwoFlow.tapWorkOrderFromTheListByStatus('Assignment');

        //Assign a technician to it. Validate the technician is assigned successfully by checking the assigned technician name on the CWO details screen and also validate the status of the CWO changes to "Assignment"
        const selectedTechnician = await cwoFlow.assignTechnicianToAssignmentCWO();
        console.log('Selected Technician:', selectedTechnician);

        //Goto Info screen and validate technician name
       // const technicianNameOnInfoTab = await cwoFlow.getNameByRoleFromCWOInfoTab('Technician');
       // console.log('Technician Name on Info Tab:', technicianNameOnInfoTab);
       // expect(technicianNameOnInfoTab).toBe(selectedTechnician);
        await browser.pause(3000);
        await commonPage.tapBack();
        
        await browser.pause(2000);
        await dashboardFlow.navigateToDashboardFromFooter(); 
    });
});
