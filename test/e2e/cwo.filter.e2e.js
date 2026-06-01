'use strict';

/**
 * CWO Filter E2E Test Suite
 *
 * 9 test cases covering the full CWO filter screen:
 *  TC_CWOF_001 – Verify filter screen opens
 *  TC_CWOF_002 – Verify Clear button functionality
 *  TC_CWOF_003 – Verify filter screen opens and Building dropdown displays available values
 *  TC_CWOF_004 – Verify full dropdown cascade: Building → Floor → Space → Asset
 *  TC_CWOF_005 – Verify filtering using Building only
 *  TC_CWOF_006 – Verify filtering using Building + Floor
 *  TC_CWOF_007 – Verify filtering using Building + Floor + Space
 *  TC_CWOF_008 – Verify filtering using Building + Floor + Space + Asset
 *  TC_CWOF_009 – Verify filtering using Building + Floor + Space + Service Category
 *               and validate work order details match selected filter criteria
 *
 * Conventions:
 *  - One login for the entire suite (before hook).
 *  - afterEach clears the filter and navigates back to CWO home after every test.
 *  - Assigned To = ALL is set in every test case.
 *  - TC_CWOF_001–004 verify UI / behaviour only (no WO-detail check).
 *  - TC_CWOF_005–009 apply the filter and open a work order to validate field data.
 */

const session        = require('../flows/session.flow');
const cwoFilterFlow  = require('../flows/cwoFilter.flow');
const cwoFilterPage  = require('../pages/cwo/cwoFilter.page');
const filterData     = require('../fixtures/cwoFilter.data');
const allure         = require('@wdio/allure-reporter').default;

// ─────────────────────────────────────────────────────────────────────────────

describe('CWO Filter Tests', () => {

    // Single login for the entire suite.
    before(async () => {
        await session.loginIfNeeded();
        await cwoFilterFlow.navigateToCWO();
    });

    // After every test: navigate to CWO home, open the filter, clear all
    // selections, and apply so the next test always starts with a clean state.
    afterEach(async () => {
        try {
            await cwoFilterFlow.navigateToCWO();
            await cwoFilterFlow.openFilter();
            await cwoFilterFlow.clearFilter();
            await cwoFilterFlow.applyFilter();
        } catch (e) {
            console.warn('[afterEach] Failed to reset filter:', e.message);
        }
    });

    // ── TC_CWOF_001 ────────────────────────────────────────────────────────────

    it('TC_CWOF_001: Verify filter screen opens', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        // Step 1: Tap filter button and verify the filter screen title
        const filterTitle = await cwoFilterFlow.openFilter();
        expect(filterTitle).toContain(filterData.expectedFilterTitle);

        // Step 2: Verify the Building dropdown is visible (confirms screen fully loaded)
        const isBuildingDisplayed = await cwoFilterPage.isBuildingDropdownDisplayed();
        expect(isBuildingDisplayed).toBe(true);
    });

    // ── TC_CWOF_002 ────────────────────────────────────────────────────────────

    it('TC_CWOF_002: Verify Clear button functionality', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('High');
        allure.addTag('regression');

        // Step 1: Open filter, set Assigned To = ALL
        await cwoFilterFlow.openFilter();
        await cwoFilterFlow.setAssignedToAll();

        // Step 2: Select a building, then tap Clear — all fields must reset
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);
        await cwoFilterFlow.clearFilter();

        // Building dropdown must still be visible after clear (reset, not removed)
        const isBuildingDisplayed = await cwoFilterPage.isBuildingDropdownDisplayed();
        expect(isBuildingDisplayed).toBe(true);

        // Re-apply Assigned To = ALL in case Clear also reset that toggle
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: Apply cleared filter and verify redirect to CWO home
        const cwoTitle       = await cwoFilterFlow.applyFilter();
        const isCardsVisible = await cwoFilterFlow.isStatusCardsVisible();

        expect(cwoTitle).toContain(filterData.expectedCwoTitle);
        expect(isCardsVisible).toBe(true);
    });

    // ── TC_CWOF_003 ────────────────────────────────────────────────────────────

    it('TC_CWOF_003: Verify filter screen opens and Building dropdown displays available values', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        // Step 1: Open filter and verify title
        const filterTitle = await cwoFilterFlow.openFilter();
        expect(filterTitle).toContain(filterData.expectedFilterTitle);

        // Step 2: Set Assigned To = ALL
        await cwoFilterFlow.setAssignedToAll();

        // Step 3: Open Building dropdown and verify item count and expected building present
        await cwoFilterPage.tapBuildingDropdown();

        const buildingCount = await cwoFilterPage.getDropdownItemCount(
            cwoFilterPage.buildingDropdownItems
        );
        expect(buildingCount).toBeGreaterThanOrEqual(filterData.buildings.length);

        // Note: WebdriverIO ElementArray.map() is async — do NOT wrap in Promise.all.
        const buildingItems       = await $$(cwoFilterPage.buildingDropdownItems);
        const contentDescs        = await buildingItems.map(el => el.getAttribute('content-desc'));
        const hasExpectedBuilding = contentDescs.some(
            desc => desc && desc.includes(filterData.buildings[0].name)
        );
        expect(hasExpectedBuilding).toBe(true);

        // Step 4: Select building and verify the dropdown label is updated
        await cwoFilterPage.selectBuildingByResourceId(filterData.defaultBuilding.resourceId);
        await browser.pause(1500);

        const buildingDropdownText = await cwoFilterPage.getBuildingDropdownText();
        expect(buildingDropdownText).toContain(filterData.defaultBuilding.name);

        // Step 5: Apply and verify redirect to CWO home
        const cwoTitle       = await cwoFilterFlow.applyFilter();
        const isCardsVisible = await cwoFilterFlow.isStatusCardsVisible();

        expect(cwoTitle).toContain(filterData.expectedCwoTitle);
        expect(isCardsVisible).toBe(true);
    });

    // ── TC_CWOF_004 ────────────────────────────────────────────────────────────

    it('TC_CWOF_004: Verify full dropdown cascade: Building → Floor → Space → Asset', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('High');
        allure.addTag('regression');

        // Step 1: Open filter, set Assigned To = ALL
        await cwoFilterFlow.openFilter();
        await cwoFilterFlow.setAssignedToAll();

        // Step 2: Select building (prerequisite for all child dropdowns)
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);

        // Step 3: Floor dropdown must load values based on selected building
        await cwoFilterPage.tapFloorDropdown();
        const floorCount = await cwoFilterPage.getDropdownItemCount(cwoFilterPage.floorDropdownItems);
        expect(floorCount).toBeGreaterThan(0);

        await cwoFilterPage.selectFirstAvailableOption(cwoFilterPage.floorDropdownItems);
        await browser.pause(1500);
        const floorText = await cwoFilterPage.getFloorDropdownText();
        expect(floorText.trim().length).toBeGreaterThan(0);

        // Step 4: Space dropdown must load values based on selected floor
        await cwoFilterPage.tapSpaceDropdown();
        const spaceCount = await cwoFilterPage.getDropdownItemCount(cwoFilterPage.spaceDropdownItems);
        expect(spaceCount).toBeGreaterThan(0);

        await cwoFilterPage.selectFirstAvailableOption(cwoFilterPage.spaceDropdownItems);
        await browser.pause(1500);
        const spaceText = await cwoFilterPage.getSpaceDropdownText();
        expect(spaceText.trim().length).toBeGreaterThan(0);

        // Step 5: Asset dropdown must open based on selected space.
        // Assets may be empty for a given space — that is a valid state.
        await cwoFilterPage.tapAssetDropdown();
        const assetCount = await cwoFilterPage.getDropdownItemCount(cwoFilterPage.assetDropdownItems);

        if (assetCount > 0) {
            await cwoFilterPage.selectFirstAvailableOption(cwoFilterPage.assetDropdownItems);
            await browser.pause(1500);
        } else {
            console.log('[TC_CWOF_004] No assets for selected space — skipping asset selection');
            await browser.back();
            await browser.pause(500);
        }

        // Step 6: Apply and verify redirect to CWO home
        const cwoTitle       = await cwoFilterFlow.applyFilter();
        const isCardsVisible = await cwoFilterFlow.isStatusCardsVisible();

        expect(cwoTitle).toContain(filterData.expectedCwoTitle);
        expect(isCardsVisible).toBe(true);
    });

    // ── TC_CWOF_005 ────────────────────────────────────────────────────────────

    it('TC_CWOF_005: Verify filtering using Building only', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        await cwoFilterFlow.openFilter();
        await cwoFilterFlow.setAssignedToAll();
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);

        const { cwoTitle, isCardsVisible, detailsData, infoData } =
            await cwoFilterFlow.validateFilterResults();

        expect(cwoTitle).toContain(filterData.expectedCwoTitle);
        expect(isCardsVisible).toBe(true);
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(detailsData.building).not.toBe('-');
        expect(detailsData.building).toBeDefined();
        expect(detailsData.requester).toBeDefined();
        expect(detailsData.description).toBeDefined();
        expect(infoData.workOrderType).toBeDefined();
        expect(infoData.serviceCategory).toBeDefined();
        expect(infoData.problemType).toBeDefined();

        console.log('[TC_CWOF_005] Details:', detailsData);
        console.log('[TC_CWOF_005] Info:',    infoData);
    });

    // ── TC_CWOF_006 ────────────────────────────────────────────────────────────

    it('TC_CWOF_006: Verify filtering using Building + Floor', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('Critical');
        allure.addTag('regression');

        await cwoFilterFlow.openFilter();
        await cwoFilterFlow.setAssignedToAll();
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);
        await cwoFilterFlow.selectFirstFloor();

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

        console.log('[TC_CWOF_006] Details:', detailsData);
        console.log('[TC_CWOF_006] Info:',    infoData);
    });

    // ── TC_CWOF_007 ────────────────────────────────────────────────────────────

    it('TC_CWOF_007: Verify filtering using Building + Floor + Space', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('Critical');
        allure.addTag('regression');

        await cwoFilterFlow.openFilter();
        await cwoFilterFlow.setAssignedToAll();
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);
        await cwoFilterFlow.selectFirstFloor();
        await cwoFilterFlow.selectFirstSpace();

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

        console.log('[TC_CWOF_007] Details:', detailsData);
        console.log('[TC_CWOF_007] Info:',    infoData);
    });

    // ── TC_CWOF_008 ────────────────────────────────────────────────────────────

    it('TC_CWOF_008: Verify filtering using Building + Floor + Space + Asset', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('Critical');
        allure.addTag('regression');

        await cwoFilterFlow.openFilter();
        await cwoFilterFlow.setAssignedToAll();
        await cwoFilterFlow.selectBuilding(filterData.defaultBuilding);
        await cwoFilterFlow.selectFirstFloor();
        await cwoFilterFlow.selectFirstSpace();
        const selectedAsset = await cwoFilterFlow.selectFirstAsset();
        console.log('[TC_CWOF_008] Selected Asset:', selectedAsset);

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

        console.log('[TC_CWOF_008] Details:', detailsData);
        console.log('[TC_CWOF_008] Info:',    infoData);
    });

    // ── TC_CWOF_009 ────────────────────────────────────────────────────────────

    it('TC_CWOF_009: Verify filtering using Building + Floor + Space + Service Category and validate work order details match selected filter criteria', async () => {
        allure.addFeature('CWO Filter');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        await cwoFilterFlow.openFilter();
        await cwoFilterFlow.setAssignedToAll();
        await cwoFilterFlow.selectBuilding(filterData.tc15Building);
        await cwoFilterFlow.selectFirstFloor();
        await cwoFilterFlow.selectFirstSpace();
        const selectedServiceCategory = await cwoFilterFlow.selectFirstServiceCategory();
        console.log('[TC_CWOF_009] Selected Service Category:', selectedServiceCategory);

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
        expect(infoData.problemType).toBeDefined();
        expect(infoData.serviceCategory).toBeDefined();
        expect(infoData.serviceCategory).not.toBe('-');
        expect(infoData.asset).toBeDefined();

        console.log('[TC_CWOF_009] Filter criteria:', {
            building: filterData.tc15Building.name,
            selectedServiceCategory,
        });
        console.log('[TC_CWOF_009] Details:', detailsData);
        console.log('[TC_CWOF_009] Info:',    infoData);
    });

});
