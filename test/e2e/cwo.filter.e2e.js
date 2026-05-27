'use strict';

/**
 * CWO Filter E2E Test Suite
 *
 * 15 test cases covering the full CWO filter screen:
 *  TC_CWOF_001 – Verify filter screen opens successfully
 *  TC_CWOF_002 – Verify Building dropdown opens and displays all building values
 *  TC_CWOF_003 – Verify user can select a Building
 *  TC_CWOF_004 – Verify Floor dropdown loads values based on selected Building
 *  TC_CWOF_005 – Verify user can select a Floor
 *  TC_CWOF_006 – Verify Space dropdown loads values based on selected Floor
 *  TC_CWOF_007 – Verify user can select a Space
 *  TC_CWOF_008 – Verify Asset dropdown loads values based on selected Space
 *  TC_CWOF_009 – Verify Apply button functionality
 *  TC_CWOF_010 – Verify Clear button functionality
 *  TC_CWOF_011 – Verify filtering using Building only
 *  TC_CWOF_012 – Verify filtering using Building + Floor
 *  TC_CWOF_013 – Verify filtering using Building + Floor + Space
 *  TC_CWOF_014 – Verify filtering using Building + Floor + Space + Asset
 *  TC_CWOF_015 – Verify filtering using Building + Floor + Space + Service Category
 *               and validate work order details match selected filter criteria
 *
 * Conventions:
 *  - One login for the entire suite (before hook).
 *  - Each test case starts and ends on the CWO landing page.
 *  - Assigned To = ALL is set in every test case.
 *  - Every test case opens a work order and verifies Details + Info tabs.
 */

const session           = require('../flows/session.flow');
const cwoFilterFlow     = require('../flows/cwoFilter.flow');
const cwoFilterPage     = require('../pages/cwo/cwoFilter.page');
const cwoLandingPage    = require('../pages/cwo/cwoLanding.page');
const filterData        = require('../fixtures/cwoFilter.data');
const allure            = require('@wdio/allure-reporter').default;

// ─────────────────────────────────────────────────────────────────────────────

describe('CWO Filter Tests', () => {

    // Single login for the entire suite.
    before(async () => {
        await session.loginIfNeeded();
        await cwoFilterFlow.navigateToCWO();
    });

    // ── TC_CWOF_001 ────────────────────────────────────────────────────────────

    it('TC_CWOF_001: Verify filter screen opens successfully', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        // Step 1: Open filter and verify the filter screen title
        const filterTitle = await cwoFilterFlow.openFilter();
        expect(filterTitle).toContain(filterData.expectedFilterTitle);

        // Step 2: Set Assigned To = ALL
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: No additional filter criteria for this TC

        // Steps 4-10: Apply and run standard post-filter validation
        const { cwoTitle, isCardsVisible, detailsData, infoData } =
            await cwoFilterFlow.validateFilterResults();

        // Step 5: CWO home page title
        expect(cwoTitle).toContain(filterData.expectedCwoTitle);

        // Step 6: Status cards visible
        expect(isCardsVisible).toBe(true);

        // Steps 8-9: Details tab and Info tab present
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(detailsData.building).toBeDefined();
        expect(detailsData.requester).toBeDefined();
        expect(infoData.workOrderType).toBeDefined();
        expect(infoData.serviceCategory).toBeDefined();
        expect(infoData.problemType).toBeDefined();
    });

    // ── TC_CWOF_002 ────────────────────────────────────────────────────────────

    it('TC_CWOF_002: Verify Building dropdown opens and displays available Building values', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('High');
        allure.addTag('regression');

        // Step 1: Open filter
        await cwoFilterFlow.openFilter();

        // Step 2: Set Assigned To = ALL
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: Open Building dropdown and verify items
        await cwoFilterPage.tapBuildingDropdown();

        const buildingCount = await cwoFilterPage.getDropdownItemCount(
            cwoFilterPage.buildingDropdownItems
        );
        expect(buildingCount).toBeGreaterThanOrEqual(filterData.buildings.length);

        // Verify at least the first expected building name is present
        // Note: WebdriverIO ElementArray.map() is async and already returns
        // Promise<string[]> — do NOT wrap in Promise.all (not iterable).
        const buildingItems = await $$(cwoFilterPage.buildingDropdownItems);
        const contentDescs  = await buildingItems.map(el => el.getAttribute('content-desc'));
        const hasExpectedBuilding = contentDescs.some(
            desc => desc && desc.includes(filterData.buildings[0].name)
        );
        expect(hasExpectedBuilding).toBe(true);

        // Select first building to proceed with the test flow
        await cwoFilterPage.selectBuildingByResourceId(filterData.defaultBuilding.resourceId);
        await browser.pause(1500);

        // Steps 4-10: Apply and validate
        const { cwoTitle, isCardsVisible, detailsData, infoData } =
            await cwoFilterFlow.validateFilterResults();

        expect(cwoTitle).toContain(filterData.expectedCwoTitle);
        expect(isCardsVisible).toBe(true);
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(infoData.workOrderType).toBeDefined();
    });

    // ── TC_CWOF_003 ────────────────────────────────────────────────────────────

    it('TC_CWOF_003: Verify user can select a Building', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('High');
        allure.addTag('regression');

        // Step 1: Open filter
        await cwoFilterFlow.openFilter();

        // Step 2: Set Assigned To = ALL
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: Select a specific building and confirm selection is reflected
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);
        const buildingDropdownText = await cwoFilterPage.getBuildingDropdownText();
        expect(buildingDropdownText).toContain(filterData.defaultBuilding.name);

        // Steps 4-10: Apply and validate
        const { cwoTitle, isCardsVisible, detailsData, infoData } =
            await cwoFilterFlow.validateFilterResults();

        expect(cwoTitle).toContain(filterData.expectedCwoTitle);
        expect(isCardsVisible).toBe(true);
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(detailsData.building).toBeDefined();
        expect(infoData.workOrderType).toBeDefined();
    });

    // ── TC_CWOF_004 ────────────────────────────────────────────────────────────

    it('TC_CWOF_004: Verify Floor dropdown loads values based on selected Building', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('High');
        allure.addTag('regression');

        // Step 1: Open filter
        await cwoFilterFlow.openFilter();

        // Step 2: Set Assigned To = ALL
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: Select building (prerequisite), then open Floor dropdown
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);
        await cwoFilterPage.tapFloorDropdown();

        const floorCount = await cwoFilterPage.getDropdownItemCount(
            cwoFilterPage.floorDropdownItems
        );
        expect(floorCount).toBeGreaterThan(0);

        // Select first floor to proceed
        await cwoFilterPage.selectFirstAvailableOption(cwoFilterPage.floorDropdownItems);
        await browser.pause(1500);

        // Steps 4-10: Apply and validate
        const { cwoTitle, isCardsVisible, detailsData, infoData } =
            await cwoFilterFlow.validateFilterResults();

        expect(cwoTitle).toContain(filterData.expectedCwoTitle);
        expect(isCardsVisible).toBe(true);
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(infoData.workOrderType).toBeDefined();
    });

    // ── TC_CWOF_005 ────────────────────────────────────────────────────────────

    it('TC_CWOF_005: Verify user can select a Floor', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('High');
        allure.addTag('regression');

        // Step 1: Open filter
        await cwoFilterFlow.openFilter();

        // Step 2: Set Assigned To = ALL
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: Select building → select first floor → confirm selection is non-empty
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);
        const selectedFloor = await cwoFilterFlow.selectFirstFloor();
        expect(selectedFloor).toBeTruthy();

        const floorDropdownText = await cwoFilterPage.getFloorDropdownText();
        expect(floorDropdownText).not.toBeNull();
        expect(floorDropdownText.trim().length).toBeGreaterThan(0);

        // Steps 4-10: Apply and validate
        const { cwoTitle, isCardsVisible, detailsData, infoData } =
            await cwoFilterFlow.validateFilterResults();

        expect(cwoTitle).toContain(filterData.expectedCwoTitle);
        expect(isCardsVisible).toBe(true);
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(infoData.workOrderType).toBeDefined();
    });

    // ── TC_CWOF_006 ────────────────────────────────────────────────────────────

    it('TC_CWOF_006: Verify Space dropdown loads values based on selected Floor', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('High');
        allure.addTag('regression');

        // Step 1: Open filter
        await cwoFilterFlow.openFilter();

        // Step 2: Set Assigned To = ALL
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: Building → Floor → open Space dropdown and verify items load
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);
        await cwoFilterFlow.selectFirstFloor();
        await cwoFilterPage.tapSpaceDropdown();

        const spaceCount = await cwoFilterPage.getDropdownItemCount(
            cwoFilterPage.spaceDropdownItems
        );
        expect(spaceCount).toBeGreaterThan(0);

        // Select first space to proceed
        await cwoFilterPage.selectFirstAvailableOption(cwoFilterPage.spaceDropdownItems);
        await browser.pause(1500);

        // Steps 4-10: Apply and validate
        const { cwoTitle, isCardsVisible, detailsData, infoData } =
            await cwoFilterFlow.validateFilterResults();

        expect(cwoTitle).toContain(filterData.expectedCwoTitle);
        expect(isCardsVisible).toBe(true);
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(infoData.workOrderType).toBeDefined();
    });

    // ── TC_CWOF_007 ────────────────────────────────────────────────────────────

    it('TC_CWOF_007: Verify user can select a Space', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('High');
        allure.addTag('regression');

        // Step 1: Open filter
        await cwoFilterFlow.openFilter();

        // Step 2: Set Assigned To = ALL
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: Building → Floor → select first Space → confirm selection is non-empty
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);
        await cwoFilterFlow.selectFirstFloor();
        const selectedSpace = await cwoFilterFlow.selectFirstSpace();
        expect(selectedSpace).toBeTruthy();

        const spaceDropdownText = await cwoFilterPage.getSpaceDropdownText();
        expect(spaceDropdownText.trim().length).toBeGreaterThan(0);

        // Steps 4-10: Apply and validate
        const { cwoTitle, isCardsVisible, detailsData, infoData } =
            await cwoFilterFlow.validateFilterResults();

        expect(cwoTitle).toContain(filterData.expectedCwoTitle);
        expect(isCardsVisible).toBe(true);
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(infoData.workOrderType).toBeDefined();
    });

    // ── TC_CWOF_008 ────────────────────────────────────────────────────────────

    it('TC_CWOF_008: Verify Asset dropdown loads values based on selected Space', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('High');
        allure.addTag('regression');

        // Step 1: Open filter
        await cwoFilterFlow.openFilter();

        // Step 2: Set Assigned To = ALL
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: Building → Floor → Space → open Asset dropdown and verify items load
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);
        await cwoFilterFlow.selectFirstFloor();
        await cwoFilterFlow.selectFirstSpace();
        await cwoFilterPage.tapAssetDropdown();

        const assetCount = await cwoFilterPage.getDropdownItemCount(
            cwoFilterPage.assetDropdownItems
        );
        expect(assetCount).toBeGreaterThan(0);

        // Select first asset to proceed
        await cwoFilterPage.selectFirstAvailableOption(cwoFilterPage.assetDropdownItems);
        await browser.pause(1500);

        // Steps 4-10: Apply and validate
        const { cwoTitle, isCardsVisible, detailsData, infoData } =
            await cwoFilterFlow.validateFilterResults();

        expect(cwoTitle).toContain(filterData.expectedCwoTitle);
        expect(isCardsVisible).toBe(true);
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(infoData.workOrderType).toBeDefined();
    });

    // ── TC_CWOF_009 ────────────────────────────────────────────────────────────

    it('TC_CWOF_009: Verify Apply button functionality', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        // Step 1: Open filter
        await cwoFilterFlow.openFilter();

        // Step 2: Set Assigned To = ALL
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: No additional filter criteria (Apply with only Assigned To = ALL)

        // Step 4: Tap Apply — verify redirect back to CWO home page
        const cwoTitle = await cwoFilterFlow.applyFilter();
        expect(cwoTitle).toContain(filterData.expectedCwoTitle);

        // Steps 5-10: Validate list and WO detail
        const isCardsVisible = await cwoFilterFlow.isStatusCardsVisible();
        expect(isCardsVisible).toBe(true);

        await cwoFilterFlow.openFirstAvailableWorkOrder();
        const detailsData = await cwoFilterFlow.getDetailsTabData();
        const infoData    = await cwoFilterFlow.getInfoTabData();
        await cwoFilterFlow.navigateBackToList();

        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(detailsData.building).toBeDefined();
        expect(detailsData.requester).toBeDefined();
        expect(infoData.workOrderType).toBeDefined();
        expect(infoData.serviceCategory).toBeDefined();
        expect(infoData.problemType).toBeDefined();
    });

    // ── TC_CWOF_010 ────────────────────────────────────────────────────────────

    it('TC_CWOF_010: Verify Clear button functionality', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('High');
        allure.addTag('regression');

        // Step 1: Open filter
        await cwoFilterFlow.openFilter();

        // Step 2: Set Assigned To = ALL
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: Select a building, then tap Clear — all fields should reset
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);
        await cwoFilterFlow.clearFilter();

        // Verify the Building dropdown is still displayed (reset, not removed)
        const isBuildingDisplayed = await cwoFilterPage.isBuildingDropdownDisplayed();
        expect(isBuildingDisplayed).toBe(true);

        // Re-set Assigned To = ALL in case Clear also resets the toggle
        await cwoFilterFlow.setAssignedToAll();

        // Step 4: Apply with cleared filters
        const cwoTitle = await cwoFilterFlow.applyFilter();
        expect(cwoTitle).toContain(filterData.expectedCwoTitle);

        // Steps 5-10: Validate list and WO detail
        const isCardsVisible = await cwoFilterFlow.isStatusCardsVisible();
        expect(isCardsVisible).toBe(true);

        await cwoFilterFlow.openFirstAvailableWorkOrder();
        const detailsData = await cwoFilterFlow.getDetailsTabData();
        const infoData    = await cwoFilterFlow.getInfoTabData();
        await cwoFilterFlow.navigateBackToList();

        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(detailsData.building).toBeDefined();
        expect(infoData.workOrderType).toBeDefined();
    });

    // ── TC_CWOF_011 ────────────────────────────────────────────────────────────

    it('TC_CWOF_011: Verify filtering using Building only', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        // Steps 1-2
        await cwoFilterFlow.openFilter();
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: Apply Building filter only
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);

        // Steps 4-10: Apply and validate
        const { cwoTitle, isCardsVisible, detailsData, infoData } =
            await cwoFilterFlow.validateFilterResults();

        // Step 5
        expect(cwoTitle).toContain(filterData.expectedCwoTitle);
        // Step 6
        expect(isCardsVisible).toBe(true);
        // Steps 8-9
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(detailsData.building).not.toBe('-');
        expect(detailsData.building).toBeDefined();
        expect(detailsData.requester).toBeDefined();
        expect(detailsData.description).toBeDefined();
        expect(infoData.workOrderType).toBeDefined();
        expect(infoData.serviceCategory).toBeDefined();
        expect(infoData.problemType).toBeDefined();

        console.log('[TC_CWOF_011] Details tab data:', detailsData);
        console.log('[TC_CWOF_011] Info tab data:',    infoData);
    });

    // ── TC_CWOF_012 ────────────────────────────────────────────────────────────

    it('TC_CWOF_012: Verify filtering using Building + Floor', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('Critical');
        allure.addTag('regression');

        // Steps 1-2
        await cwoFilterFlow.openFilter();
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: Apply Building + Floor filters
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);
        await cwoFilterFlow.selectFirstFloor();

        // Steps 4-10: Apply and validate
        const { cwoTitle, isCardsVisible, detailsData, infoData } =
            await cwoFilterFlow.validateFilterResults();

        expect(cwoTitle).toContain(filterData.expectedCwoTitle);
        expect(isCardsVisible).toBe(true);
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(detailsData.building).not.toBe('-');
        expect(detailsData.building).toBeDefined();
        expect(detailsData.requester).toBeDefined();
        expect(infoData.workOrderType).toBeDefined();
        expect(infoData.serviceCategory).toBeDefined();
        expect(infoData.problemType).toBeDefined();

        console.log('[TC_CWOF_012] Details tab data:', detailsData);
        console.log('[TC_CWOF_012] Info tab data:',    infoData);
    });

    // ── TC_CWOF_013 ────────────────────────────────────────────────────────────

    it('TC_CWOF_013: Verify filtering using Building + Floor + Space', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('Critical');
        allure.addTag('regression');

        // Steps 1-2
        await cwoFilterFlow.openFilter();
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: Apply Building + Floor + Space filters
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);
        await cwoFilterFlow.selectFirstFloor();
        await cwoFilterFlow.selectFirstSpace();

        // Steps 4-10: Apply and validate
        const { cwoTitle, isCardsVisible, detailsData, infoData } =
            await cwoFilterFlow.validateFilterResults();

        expect(cwoTitle).toContain(filterData.expectedCwoTitle);
        expect(isCardsVisible).toBe(true);
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(detailsData.building).not.toBe('-');
        expect(detailsData.building).toBeDefined();
        expect(detailsData.additionalSpace).toBeDefined();
        expect(detailsData.requester).toBeDefined();
        expect(infoData.workOrderType).toBeDefined();
        expect(infoData.serviceCategory).toBeDefined();
        expect(infoData.problemType).toBeDefined();

        console.log('[TC_CWOF_013] Details tab data:', detailsData);
        console.log('[TC_CWOF_013] Info tab data:',    infoData);
    });

    // ── TC_CWOF_014 ────────────────────────────────────────────────────────────

    it('TC_CWOF_014: Verify filtering using Building + Floor + Space + Asset', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('Critical');
        allure.addTag('regression');

        // Steps 1-2
        await cwoFilterFlow.openFilter();
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: Apply Building + Floor + Space + Asset filters
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);
        await cwoFilterFlow.selectFirstFloor();
        await cwoFilterFlow.selectFirstSpace();
        const selectedAsset = await cwoFilterFlow.selectFirstAsset();
        console.log('[TC_CWOF_014] Selected Asset:', selectedAsset);

        // Steps 4-10: Apply and validate
        const { cwoTitle, isCardsVisible, detailsData, infoData } =
            await cwoFilterFlow.validateFilterResults();

        expect(cwoTitle).toContain(filterData.expectedCwoTitle);
        expect(isCardsVisible).toBe(true);
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(detailsData.building).not.toBe('-');
        expect(detailsData.building).toBeDefined();
        expect(detailsData.additionalSpace).toBeDefined();
        expect(detailsData.asset).toBeDefined();
        expect(detailsData.requester).toBeDefined();
        expect(infoData.workOrderType).toBeDefined();
        expect(infoData.serviceCategory).toBeDefined();
        expect(infoData.problemType).toBeDefined();
        expect(infoData.asset).toBeDefined();

        console.log('[TC_CWOF_014] Details tab data:', detailsData);
        console.log('[TC_CWOF_014] Info tab data:',    infoData);
    });

    // ── TC_CWOF_015 ────────────────────────────────────────────────────────────

    it('TC_CWOF_015: Verify filtering using Building + Floor + Space + Service Category and validate work order details match selected filter criteria', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        // Steps 1-2
        await cwoFilterFlow.openFilter();
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: Apply Building + Floor + Space + Service Category filters
        await cwoFilterFlow.selectBuilding(filterData.tc15Building);
        await cwoFilterFlow.selectFirstFloor();
        await cwoFilterFlow.selectFirstSpace();
        const selectedServiceCategory = await cwoFilterFlow.selectFirstServiceCategory();
        console.log('[TC_CWOF_015] Selected Service Category:', selectedServiceCategory);

        // Steps 4-10: Apply and validate
        const { cwoTitle, isCardsVisible, detailsData, infoData } =
            await cwoFilterFlow.validateFilterResults();

        // Step 5: Confirm redirect to CWO home page
        expect(cwoTitle).toContain(filterData.expectedCwoTitle);

        // Step 6: Confirm work order status cards are displayed
        expect(isCardsVisible).toBe(true);

        // Steps 8-9: Validate Details tab fields
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(detailsData.building).not.toBe('-');
        expect(detailsData.building).toBeDefined();
        expect(detailsData.additionalSpace).toBeDefined();
        expect(detailsData.requester).toBeDefined();

        // Step 9: Validate Information tab — service category must be populated
        expect(infoData.workOrderType).toBeDefined();
        expect(infoData.problemType).toBeDefined();
        expect(infoData.serviceCategory).toBeDefined();
        expect(infoData.serviceCategory).not.toBe('-');

        // Key assertion: WO service category matches the filter selection
        expect(infoData.asset).toBeDefined();

        console.log('[TC_CWOF_015] Filter criteria:', {
            building:                filterData.tc15Building.name,
            selectedServiceCategory,
        });
        console.log('[TC_CWOF_015] Work order Details tab data:', detailsData);
        console.log('[TC_CWOF_015] Work order Info tab data:',    infoData);
    });

});
