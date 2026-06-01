const dashboardFlow = require('../flows/dashboard.flow');
const ppmFlow = require('../flows/ppm.flow');
const ppmLandingPage = require('../pages/ppm/ppmLanding.page');
const commonPage = require('../pages/common.page');
const mediaHelper = require('../pages/mediaHelper');
const ppmData = require('../fixtures/ppm.data');
const session = require('../flows/session.flow');
const allure = require('@wdio/allure-reporter').default;

describe('PPM E2E Tests', () => {

    before(async () => {
        await session.loginIfNeeded();
    });

    describe('Navigation', () => {

        it.skip('TC_PPM_001: Verify user can navigate to PPM List from bottom navigation', async () => {
            allure.addFeature('PPM');
            allure.addSeverity('Critical');
            allure.addTag('smoke');
            allure.addTag('regression');

            const ppmTitle = await ppmFlow.navigateToPPMFromBottomNav();
            expect(ppmTitle).toContain('PPM Work Order');

            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        });

        it.skip('TC_PPM_002: Verify user can navigate to PPM List from the right side drawer', async () => {
            allure.addFeature('PPM');
            allure.addSeverity('Critical');
            allure.addTag('smoke');

            const ppmTitle = await ppmFlow.navigateToPPMFromRightMenuDrawer();
            expect(ppmTitle).toContain('PPM Work Order');

            console.log('PPM List title verified successfully from 002.');

            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        });

        it.skip('TC_PPM_003: Verify user can navigate to PPM List from the bottom menu', async () => {
            allure.addFeature('PPM');
            allure.addSeverity('Critical');
            allure.addTag('smoke');

            const ppmTitle = await ppmFlow.navigateToPPMFromBottomMenu();
            expect(ppmTitle).toContain('PPM Work Order');

            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooterMenu();
        });

    });

    describe('Work Order Management', () => {

        it.skip('TC_PPM_004: Create a new PPM', async () => {
            allure.addFeature('PPM');
            allure.addSeverity('Critical');
            allure.addTag('smoke');
            allure.addTag('regression');

            await ppmFlow.navigateToPPMFromBottomNav();

            const isPPMCreateButtonVisible = await ppmLandingPage.isPPMCreateButtonVisible();
            expect(isPPMCreateButtonVisible).toBe(true);

            if (isPPMCreateButtonVisible) {
                const ppmDetailsHeader = await ppmFlow.createPPM();
                console.log('PPM Details Header Text:', ppmDetailsHeader);

                expect(ppmDetailsHeader.ppmNumber).toContain('PPM');
                expect(ppmDetailsHeader.status).toContain('NEW');

                await commonPage.tapBack();
                await browser.pause(2000);
                await dashboardFlow.navigateToDashboardFromFooter();
            }
        });

        it.skip('TC_PPM_005: Verify PPM list loads correctly', async () => {
            allure.addFeature('PPM');
            allure.addSeverity('Critical');
            allure.addTag('regression');

            await ppmFlow.navigateToPPMFromBottomNav();
            await browser.pause(2000);

            const statusArray = ['New', 'Assignment', 'Acknowledgement', 'In-Progress', 'Completed'];

            for (const status of statusArray) {
                const ppmCountData = await ppmFlow.getWorkOrderDataForGivenStatus(status);
                console.log(`Status: ${status}, Card Visible: ${ppmCountData.isCardVisible}, Total Work Orders: ${ppmCountData.totalNoOfWorkOrders}, List Visible: ${ppmCountData.isListVisible}`);

                expect(ppmCountData.isCardVisible).toBe(true);

                if (ppmCountData.totalNoOfWorkOrders > 0) {
                    expect(ppmCountData.isListVisible).toBe(true);
                } else {
                    const isNoResultsMessageVisible = await ppmFlow.isNoResultsFoundMessageVisible();
                    expect(isNoResultsMessageVisible).toBe(true);
                    expect(ppmCountData.isListVisible).toBe(false);
                }
            }
        });

        it.skip('TC_PPM_006: Mandatory field validation', async () => {
            allure.addFeature('PPM');
            allure.addSeverity('Critical');
            allure.addTag('regression');

            await ppmFlow.navigateToPPMFromBottomNav();
            await browser.pause(2000);

            const errorMessagesArray = await ppmFlow.returnErrorMessageForCreatingPPMWithEmptyFields();

            expect(errorMessagesArray.masterWORequired).toBe(true);
            expect(errorMessagesArray.checklistRequired).toBe(true);
            expect(errorMessagesArray.frequencyRequired).toBe(true);

            await commonPage.tapBack();
            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        });

        it.skip('TC_PPM_008: Reset PPM creation', async () => {
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

        it.skip('TC_PPM_013: Upload an image to a PPM via the attachments tab', async () => {
            allure.addFeature('PPM');
            allure.addSeverity('Critical');
            allure.addTag('smoke');
            allure.addTag('regression');

            await mediaHelper.pushTestImageToDevice();

            await ppmFlow.navigateToPPMFromBottomNav();
            await ppmFlow.getAllPPMs();
            await ppmFlow.tapWorkOrderFromTheListByStatus('New');

            await ppmFlow.uploadImageFromAttachmentsTab();

            const imageName = await ppmFlow.getImageNameFromPPMAttachmentsTab();
            console.log('Uploaded image name:', imageName);
            expect(imageName).toBeTruthy();

            await commonPage.tapBack();
            await browser.pause(2000);

            await commonPage.tapBack();
            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        });

    });

    describe('Assignment & Workflow', () => {

        it.skip('TC_PPM_011: Assign a Supervisor to a New PPM', async () => {
            allure.addFeature('PPM');
            allure.addTag('regression');
            allure.addTag('smoke');
            allure.addSeverity('Critical');

            await ppmFlow.navigateToPPMFromBottomNav();
            await ppmFlow.getAllPPMs();
            await ppmFlow.tapWorkOrderFromTheListByStatus('New');

            const selectedSupervisor = await ppmFlow.assignSupervisorToPendingPPM();

            await browser.pause(5000);
            await commonPage.tapBack();

            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        });

        it.skip('TC_PPM_012: Assign a Technician to an Assignment PPM', async () => {
            allure.addFeature('PPM');
            allure.addTag('regression');
            allure.addTag('smoke');
            allure.addSeverity('Critical');

            await ppmFlow.navigateToPPMFromBottomNav();
            await ppmFlow.getAllPPMs();
            await ppmFlow.tapWorkOrderFromTheListByStatus('Assignment');

            const selectedTechnician = await ppmFlow.assignTechnicianToInProgressPPM();
            console.log('Selected Technician:', selectedTechnician);

            await browser.pause(5000);
            await commonPage.tapBack();

            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        });

        it('TC_PPM_014: Acknowledge a PPM', async () => {
            allure.addFeature('PPM');
            allure.addTag('regression');
            allure.addTag('smoke');
            allure.addSeverity('Critical');

            await ppmFlow.navigateToPPMFromBottomNav();
            await ppmFlow.getAllPPMs();
            await ppmFlow.tapWorkOrderFromTheListByStatus('Acknowledgement');

            const acknowledgementResult = await ppmFlow.acknowledgePPM();

            expect(acknowledgementResult.isProcessingBannerVisible).toBe(true);
            expect(acknowledgementResult.isSuccessBannerVisible).toBe(true);
            expect(acknowledgementResult.status).toContain('INPROGRESS');

            await commonPage.tapBack();
            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        });

        it('TC_PPM_015: Create PPM and move it to In-Progress', async () => {
            allure.addFeature('PPM');
            allure.addTag('regression');
            allure.addTag('smoke');
            allure.addSeverity('critical');

            await ppmFlow.navigateToPPMFromBottomNav();

            const workflowResult = await ppmFlow.createPPMAndMoveToInProgress();

            expect(workflowResult.createdPPM.ppmNumber).toContain('PPM');
            expect(workflowResult.createdPPM.status).toContain('NEW');
            expect(workflowResult.supervisorAssignment.status).toContain('ASSIGNMENT');
            expect(workflowResult.technicianAssignment.status).toContain('ACKNOWLEDGEMENT');
            expect(workflowResult.acknowledgement.status).toContain('INPROGRESS');

            await commonPage.tapBack();
            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        });

        it('TC_PPM_016: Reject a PPM from ACKNOWLEDGMENT stage and verify technician is cleared', async () => {
            allure.addFeature('PPM');
            allure.addSeverity('blocker');
            allure.addTag('regression');
            allure.addTag('smoke');

            // ── Step 1 & 2: Navigate to PPM, open first ACKNOWLEDGEMENT work order ──
            await ppmFlow.navigateToPPMFromBottomNav();
            await ppmFlow.getAllPPMs();
            await ppmFlow.tapWorkOrderFromTheListByStatus('Acknowledgement');

            // ── Step 3: Capture technician name from Info tab before rejection ───────
            const technicianNameBefore = await ppmFlow.getNameByRoleFromPPMInfoTab('Technician');
            console.log(`\nTechnician before rejection: "${technicianNameBefore}"\n`);
            expect(technicianNameBefore).toBeTruthy();
            expect(technicianNameBefore.trim().length).toBeGreaterThan(0);

            // ── Steps 4 & 5: Details tab → Reject button → dialog (reason + OK) ──────
            // ── Step 6: Verify status reverted to ASSIGNMENT ──────────────────────────
            const rejectResult = await ppmFlow.rejectPPMFromAcknowledgement('Testing rejection from acknowledgement stage');
            console.log('PPM rejected. Status after rejection:', rejectResult.status);
            expect(rejectResult.status).toContain('ASSIGNMENT');

            // ── Step 7: Tap Info tab, verify technician value is now '-' ─────────────
            const technicianNameAfter = await ppmFlow.getNameByRoleFromPPMInfoTab('Technician');
            console.log(`\nTechnician after rejection: "${technicianNameAfter}"\n`);

            const isCleared = !technicianNameAfter
                || technicianNameAfter.trim() === ''
                || technicianNameAfter.trim() === '-';
            expect(isCleared).toBe(true);

            // ── Steps 8 & 9: Back to PPM list, then Dashboard ────────────────────────
            await commonPage.tapBack();
            await browser.pause(2000);
            await dashboardFlow.navigateToDashboardFromFooter();
        });

    });

});
