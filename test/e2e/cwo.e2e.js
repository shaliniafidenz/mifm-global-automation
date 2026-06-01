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

    describe('Attachment Verification', () => {

        it('TC_CWO_017: Find a closed CWO with attachments, open it, and verify the attachment can be viewed', async () => {
            allure.addFeature('CWO');
            allure.addSeverity('Normal');
            allure.addTag('regression');

            // ── Step 1: Navigate to CWO list ────────────────────────────────────
            await cwoFlow.navigateToCWOFromBottomNav();

            // ── Step 2: Apply "All" filter so closed CWOs are visible ────────────
            await cwoFlow.getAllCWOs();

            // ── Step 3: Horizontal-scroll to Closed card and tap it ──────────────
            await cwoLandingPage.tapClosedCard();

            // ── Step 4: Iterate closed list — find first CWO that has attachments ─
            // The flow logs each CWO it checks and stops as soon as it finds one
            // with at least one attachment, leaving the attachment image view open.
            const result = await cwoFlow.findCWOWithAttachmentsInClosedTab();

            console.log(`\n[TC_CWO_017] Result → found: ${result.found}, CWO: ${result.cwoNumber}, attachments: ${result.attachmentCount}`);

            // ── Step 5: Assert we found at least one CWO with attachments ────────
            expect(result.found).toBe(true);
            expect(result.attachmentCount).toBeGreaterThan(0);

            // ── Cleanup: close attachment viewer → CWO detail → dashboard ────────
            await commonPage.tapBack(); // close attachment image viewer
            await browser.pause(1000);
            await commonPage.tapBack(); // back to closed CWO list
            await browser.pause(1000);
            await dashboardFlow.navigateToDashboardFromRightDrawer();
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

        it('TC_CWO_015: Verify supervisor name is displayed in the Information tab of an Assignment CWO', async () => {
            allure.addFeature('CWO');
            allure.addSeverity('Normal');
            allure.addTag('regression');
            allure.addTag('smoke');

            // ── Step 1: Navigate to CWO list and apply "All" filter ──────────
            await cwoFlow.navigateToCWOFromBottomNav();
            await cwoFlow.getAllCWOs();

            // ── Step 2: Open first CWO from the Assignment tab ───────────────
            await cwoFlow.tapWorkOrderFromTheListByStatus('Assignment');

            // ── Step 3: Navigate to Information tab, scroll to bottom,
            //            and read the supervisor name ─────────────────────────
            // getNameByRoleFromCWOInfoTab internally:
            //   → taps navigationItemInactive_Information_tab
            //   → scrolls to bottom of the ScrollView
            //   → scrollIntoView cwoAdditionalInformationTab_supervisor_value
            //   → returns content-desc[1] (the display name)
            const supervisorName = await cwoFlow.getNameByRoleFromCWOInfoTab('Supervisor');

            // ── Step 4: Assert and display ───────────────────────────────────
            console.log(`\n✔ Supervisor found in Information tab: "${supervisorName}"\n`);
            expect(supervisorName).toBeTruthy();
            expect(supervisorName.trim().length).toBeGreaterThan(0);

            // ── Cleanup: return to dashboard ──────────────────────────────────
            // navigateToDashboardFromFooter() is very slow here because the CWO
            // landing page is still reloading all work orders (All filter active)
            // after tapBack().  The AppBar drawer button is in a separate widget
            // tree and responds immediately regardless of list-loading state, so
            // the right-drawer path is significantly faster.
            await commonPage.tapBack();
            await dashboardFlow.navigateToDashboardFromRightDrawer();
        });

        it('TC_CWO_016: Verify supervisor name is blank in Information tab after CWO rejection', async () => {
            allure.addFeature('CWO');
            allure.addSeverity('Normal');
            allure.addTag('regression');
            allure.addTag('smoke');

            // ── Step 1: Navigate to CWO list and apply "All" filter ──────────
            await cwoFlow.navigateToCWOFromBottomNav();
            await cwoFlow.getAllCWOs();

            // ── Step 2: Open first CWO from the Assignment tab ───────────────
            await cwoFlow.tapWorkOrderFromTheListByStatus('Assignment');

            // ── Step 3: Reject the CWO — app auto-navigates to NEW status ────
            const rejectResult = await cwoFlow.rejectCWO();
            console.log('CWO rejected. Status after rejection:', rejectResult.status);
            expect(rejectResult.status).toContain('NEW');

            // ── Step 4: Navigate to Information tab, scroll to bottom twice,
            //            and verify supervisor name is blank ───────────────────
            // getNameByRoleFromCWOInfoTab:
            //   → taps navigationItemInactive_Information_tab
            //   → calls scrollToBottomOfInfoTab() (two scrollToEnd passes)
            //   → reads content-desc[1] of cwoAdditionalInformationTab_supervisor_value
            const supervisorName = await cwoFlow.getNameByRoleFromCWOInfoTab('Supervisor');

            console.log(`\n✔ Supervisor value in Information tab after rejection: "${supervisorName}"\n`);

            // After rejection the supervisor assignment is cleared — the field
            // should be empty, blank, or show the app's placeholder dash "-".
            const isBlank = !supervisorName
                || supervisorName.trim() === ''
                || supervisorName.trim() === '-';
            expect(isBlank).toBe(true);

            // ── Cleanup: return to dashboard ──────────────────────────────────
            // navigateBackFromRejectedCWO checks NEW status in the AppBar (still
            // visible on the Info tab) and taps the AppBar Back button to return
            // to the CWO list.  Use the right-drawer home for the same fast path
            // as TC_CWO_015.
            await cwoFlow.navigateBackFromRejectedCWO();
            await dashboardFlow.navigateToDashboardFromRightDrawer();
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
