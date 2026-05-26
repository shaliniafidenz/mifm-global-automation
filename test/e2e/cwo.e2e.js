const dashboardFlow = require('../flows/dashboard.flow');
const cwoFlow = require('../flows/cwo.flow');
const cwoLandingPage = require('../pages/cwo/cwoLanding.page');
const commonPage = require('../pages/common.page');
const mediaHelper = require('../pages/mediaHelper');
const cwoData = require('../fixtures/cwo.data');
const session = require('../flows/session.flow');
const allure = require('@wdio/allure-reporter').default;

describe('CWO E2E Tests', () => {

    before(async () => {
        await session.loginIfNeeded();
    });

    describe('Navigation', () => {

        it.skip('TC_CWO_001: Verify user can navigate to CWO List from bottom navigation', async () => {
            allure.addFeature('CWO');
            allure.addSeverity('Critical');
            allure.addTag('smoke');
            allure.addTag('regression');

            const cwoTitle = await cwoFlow.navigateToCWOFromBottomNav();
            expect(cwoTitle).toContain('Corrective Work Order');

            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        });

        it.skip('TC_CWO_002: Verify user can navigate to CWO List from the right side drawer', async () => {
            allure.addFeature('CWO');
            allure.addSeverity('Critical');
            allure.addTag('smoke');

            const cwoTitle = await cwoFlow.navigateToCWOFromRightMenuDrawer();
            expect(cwoTitle).toContain('Corrective Work Order');

            console.log('CWO List title verified successfully from 002.');

            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        });

        it.skip('TC_CWO_003: Verify user can navigate to CWO List from the bottom menu', async () => {
            allure.addFeature('CWO');
            allure.addSeverity('Critical');
            allure.addTag('smoke');

            const cwoTitle = await cwoFlow.navigateToCWOFromBottomMenu();
            expect(cwoTitle).toContain('Corrective Work Order');

            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooterMenu();
        });

    });

    describe('Work Order Management', () => {

        it.skip('TC_CWO_004: Create a new CWO', async () => {
            allure.addFeature('CWO');
            allure.addSeverity('Critical');
            allure.addTag('smoke');
            allure.addTag('regression');

            await cwoFlow.navigateToCWOFromBottomNav();

            const isCWOCreateButtonVisible = await cwoLandingPage.isCWOCreateButtonVisible();
            expect(isCWOCreateButtonVisible).toBe(true);

            if (isCWOCreateButtonVisible) {
                const cwoDetailsHeader = await cwoFlow.createCWO();
                console.log('CWO Details Header Text:', cwoDetailsHeader);

                expect(cwoDetailsHeader.cwoNumber).toContain('CWO');
                expect(cwoDetailsHeader.status).toContain('NEW');

                await commonPage.tapBack();
                await browser.pause(2000);
                await dashboardFlow.navigateToDashboardFromFooter();
            }
        });

        it.skip('TC_CWO_005: Verify CWO list loads correctly', async () => {
            allure.addFeature('CWO');
            allure.addSeverity('Critical');
            allure.addTag('regression');

            await cwoFlow.navigateToCWOFromBottomNav();
            await browser.pause(2000);

            const statusArray = ['New', 'Assignment', 'Acknowledgement', 'In-Progress', 'Completed'];

            for (const status of statusArray) {
                const newWOCountData = await cwoFlow.getWokOrderDataForGivenStatus(status);
                console.log(`Status: ${status}, Card Visible: ${newWOCountData.isCardVisible}, Total Work Orders: ${newWOCountData.totalNoOfWorkOrders}, List Visible: ${newWOCountData.isListVisible}`);

                expect(newWOCountData.isCardVisible).toBe(true);

                if (newWOCountData.totalNoOfWorkOrders > 0) {
                    expect(newWOCountData.isListVisible).toBe(true);
                } else {
                    const isNoResultsMessageVisibleForNew = await cwoFlow.isNoResultsFoundMessageVisible();
                    expect(isNoResultsMessageVisibleForNew).toBe(true);
                    expect(newWOCountData.isListVisible).toBe(false);
                }
            }
        });

        it.skip('TC_CWO_006: Mandatory field validation', async () => {
            allure.addFeature('CWO');
            allure.addSeverity('Critical');
            allure.addTag('regression');

            await cwoFlow.navigateToCWOFromBottomNav();
            await browser.pause(2000);

            const errorMessagesArray = await cwoFlow.returnErrorMessageForCreatingCWOWithEmptyFields();

            expect(errorMessagesArray.buildingRequired).toBe(true);
            expect(errorMessagesArray.locationRequired).toBe(true);
            expect(errorMessagesArray.problemTypeRequired).toBe(true);
            expect(errorMessagesArray.workOrderTypeRequired).toBe(true);
            expect(errorMessagesArray.serviceCategoryRequired).toBe(true);
            expect(errorMessagesArray.priorityLevelRequired).toBe(true);

            await commonPage.tapBack();
            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        });

        it.skip('TC_CWO_007: Create a new CWO with capturing image', async () => {
            allure.addFeature('CWO');
            allure.addSeverity('Critical');
            allure.addTag('smoke');
            allure.addTag('regression');

            await cwoFlow.navigateToCWOFromBottomNav();

            const isCWOCreateButtonVisible = await cwoLandingPage.isCWOCreateButtonVisible();
            expect(isCWOCreateButtonVisible).toBe(true);

            if (isCWOCreateButtonVisible) {
                const cwoDetailsHeader = await cwoFlow.createCWOWithCapturedImage();
                console.log('CWO Details Header Text:', cwoDetailsHeader);

                expect(cwoDetailsHeader.cwoNumber).toContain('CWO');
                expect(cwoDetailsHeader.status).toContain('NEW');

                const imageNameFromAttachmentTab = await cwoFlow.getImageNameFromAttachmentsTab();

                const stripExt = (filename) => filename.replace(/\.[^/.]+$/, '');
                expect(stripExt(imageNameFromAttachmentTab)).toBe(stripExt(cwoDetailsHeader.imageName));

                await commonPage.tapBack();
                await browser.pause(2000);

                await commonPage.tapBack();
                await browser.pause(2000);
                await dashboardFlow.navigateToDashboardFromFooter();
            }
        });

        it.skip('TC_CWO_008: Reset CWO creation', async () => {
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

    });

    describe('Assignment & Workflow', () => {

        it.skip('TC_CWO_011: Assign a Supervisor to a NEW CWO', async () => {
            allure.addFeature('CWO');
            allure.addTag('regression');
            allure.addTag('smoke');
            allure.addSeverity('Critical');

            await cwoFlow.navigateToCWOFromBottomNav();
            await cwoFlow.getAllCWOs();
            await cwoFlow.tapWorkOrderFromTheListByStatus('New');

            const selectedSupervisor = await cwoFlow.assignSupervisorToNewCWO();

            await browser.pause(3000);
            await commonPage.tapBack();

            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        });

        it.skip('TC_CWO_012: Assign a Technician to a NEW CWO', async () => {
            allure.addFeature('CWO');
            allure.addTag('regression');
            allure.addTag('smoke');
            allure.addSeverity('Critical');

            await cwoFlow.navigateToCWOFromBottomNav();
            await cwoFlow.getAllCWOs();
            await cwoFlow.tapWorkOrderFromTheListByStatus('Assignment');

            const selectedTechnician = await cwoFlow.assignTechnicianToAssignmentCWO();
            console.log('Selected Technician:', selectedTechnician);

            await browser.pause(3000);
            await commonPage.tapBack();

            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        });

        it('TC_CWO_013: Acknowledge a CWO', async () => {
            allure.addFeature('CWO');
            allure.addTag('regression');
            allure.addTag('smoke');
            allure.addSeverity('Critical');

            await cwoFlow.navigateToCWOFromBottomNav();
            await cwoFlow.getAllCWOs();
            await cwoFlow.tapWorkOrderFromTheListByStatus('Acknowledgement');

            const acknowledgementResult = await cwoFlow.acknowledgeCWO();

            expect(acknowledgementResult.isProcessingBannerVisible).toBe(true);
            expect(acknowledgementResult.isSuccessBannerVisible).toBe(true);
            expect(acknowledgementResult.status).toContain('INPROGRESS');

            await commonPage.tapBack();
            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        });

        it('TC_CWO_014: Create a CWO, assign supervisor, navigate to Assignment tab and reject', async () => {
            allure.addFeature('CWO');
            allure.addTag('regression');
            allure.addTag('smoke');
            allure.addSeverity('Critical');

            // ── Step 1: Navigate to CWO list ────────────────────────────────
            await cwoFlow.navigateToCWOFromBottomNav();

            // ── Step 2: Create a new CWO ─────────────────────────────────────
            const isCWOCreateButtonVisible = await cwoLandingPage.isCWOCreateButtonVisible();
            expect(isCWOCreateButtonVisible).toBe(true);

            const cwoDetails = await cwoFlow.createCWO();
            console.log('Created CWO:', cwoDetails.cwoNumber, '| Status:', cwoDetails.status);
            expect(cwoDetails.cwoNumber).toContain('CWO');
            expect(cwoDetails.status).toContain('NEW');

            // ── Step 3: Assign supervisor (still on the CWO detail page) ─────
            const assignResult = await cwoFlow.assignSupervisorToNewCWO();
            console.log('Supervisor assigned:', assignResult.supervisorName, '| Status:', assignResult.status);
            expect(assignResult.status).toContain('ASSIGNMENT');

            // ── Step 4: Return to CWO list and show all CWOs ─────────────────
            await commonPage.tapBack();
            await browser.pause(2000);
            await cwoFlow.getAllCWOs();

            // ── Step 5: Open the first CWO from the Assignment tab ───────────
            await cwoFlow.tapWorkOrderFromTheListByStatus('Assignment');

            // ── Step 6: Scroll down and tap the Reject button ────────────────
            const rejectResult = await cwoFlow.rejectCWO();
            console.log('Reject result | status:', rejectResult.status);

            // The app auto-navigates to the NEW-status detail page after rejection —
            // that navigation is the confirmation the rejection succeeded.
            expect(rejectResult.status).toContain('NEW');

            // ── Cleanup: return to dashboard ──────────────────────────────────
            // After rejection the app auto-navigates to the CWO detail page with
            // NEW status; navigateBackFromRejectedCWO() handles that transition
            // back to the CWO landing list before we tap the home footer button.
            await cwoFlow.navigateBackFromRejectedCWO();
            await dashboardFlow.navigateToDashboardFromFooter();
        });

    });

});
