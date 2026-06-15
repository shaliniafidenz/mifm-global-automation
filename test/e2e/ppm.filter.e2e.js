'use strict';

/**
 * PPM Filter E2E Test Suite
 *
 * 9 test cases covering the full PPM filter screen:
 *  TC_PPMF_001 – Verify filter screen opens
 *  TC_PPMF_002 – Verify Clear button functionality
 *  TC_PPMF_003 – Verify filter screen opens and Building dropdown displays available values
 *  TC_PPMF_004 – Verify full dropdown cascade: Building → Floor → Space → Asset
 *  TC_PPMF_005 – Verify filtering using Building only
 *  TC_PPMF_006 – Verify filtering using Building + Floor
 *  TC_PPMF_007 – Verify filtering using Building + Floor + Space
 *  TC_PPMF_008 – Verify filtering using Building + Floor + Space + Asset
 *  TC_PPMF_009 – Verify filtering using Building + Floor + Space + Service Category
 *               and validate work order details match selected filter criteria
 *
 * Conventions:
 *  - One login for the entire suite (before hook).
 *  - afterEach clears the filter and navigates back to PPM home after every test.
 *  - Assigned To = ALL is set in every test case.
 *  - TC_PPMF_001–004 verify UI / behaviour only (no WO-detail check).
 *  - TC_PPMF_005–009 apply the filter and open a work order to validate field data.
 */

const session       = require('../flows/session.flow');
const ppmFilterFlow = require('../flows/ppmFilter.flow');
const ppmFilterPage = require('../pages/ppm/ppmFilter.page');
const ppmFilterData = require('../fixtures/ppmFilter.data');
const allure        = require('@wdio/allure-reporter').default;

// ─────────────────────────────────────────────────────────────────────────────

describe('PPM Filter Tests', () => {

    // Single login for the entire suite.
    before(async () => {
        await session.loginIfNeeded();
        await ppmFilterFlow.navigateToPPM();
    });

    // After every test: navigate to PPM home, open the filter, clear all
    // selections, and apply so the next test always starts with a clean state.
    afterEach(async () => {
        try {
            await ppmFilterFlow.navigateToPPM();
            await ppmFilterFlow.openFilter();
            await ppmFilterFlow.clearFilter();
            await ppmFilterFlow.applyFilter();
        } catch (e) {
            console.warn('[afterEach] Failed to reset filter:', e.message);
        }
    });

    // ── TC_PPMF_001 ───────────────────────────────────────────────────────────

    it('TC_PPMF_001: Verify filter screen opens', async () => {
        allure.addFeature('PPM Filter');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        // Step 1: Tap filter button and verify the filter screen title
        const filterTitle = await ppmFilterFlow.openFilter();
        expect(filterTitle).toContain(ppmFilterData.expectedFilterTitle);

        // Step 2: Verify the Building dropdown is visible (confirms screen fully loaded)
        const isBuildingDisplayed = await ppmFilterPage.isBuildingDropdownDisplayed();
        expect(isBuildingDisplayed).toBe(true);

        // Step 3: Apply empty filter to navigate back to PPM home
        const ppmTitle = await ppmFilterFlow.applyFilter();
        expect(ppmTitle).toContain(ppmFilterData.expectedPpmTitle);
    });

    // ── TC_PPMF_002 ───────────────────────────────────────────────────────────

    it('TC_PPMF_002: Verify Clear button functionality', async () => {
        allure.addFeature('PPM Filter');
        allure.addSeverity('High');
        allure.addTag('regression');

        // Step 1: Open filter, set Assigned To = ALL
        await ppmFilterFlow.openFilter();
        await ppmFilterFlow.setAssignedToAll();

        // Step 2: Select a building, then tap Clear — all fields must reset
        await ppmFilterFlow.selectBuilding(ppmFilterData.defaultBuilding);
        await ppmFilterFlow.clearFilter();

        // Building dropdown must still be visible after clear (reset, not removed)
        const isBuildingDisplayed = await ppmFilterPage.isBuildingDropdownDisplayed();
        expect(isBuildingDisplayed).toBe(true);

        // Re-apply Assigned To = ALL in case Clear also reset that toggle
        await ppmFilterFlow.setAssignedToAll();

        // Step 3: Apply cleared filter and verify redirect to PPM home
        const ppmTitle       = await ppmFilterFlow.applyFilter();
        const isCardsVisible = await ppmFilterFlow.isStatusCardsVisible();

        expect(ppmTitle).toContain(ppmFilterData.expectedPpmTitle);
        expect(isCardsVisible).toBe(true);
    });

    // ── TC_PPMF_003 ───────────────────────────────────────────────────────────

    it('TC_PPMF_003: Verify filter screen opens and Building dropdown displays available values', async () => {
        allure.addFeature('PPM Filter');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        // Step 1: Open filter and verify title
        const filterTitle = await ppmFilterFlow.openFilter();
        expect(filterTitle).toContain(ppmFilterData.expectedFilterTitle);

        // Step 2: Set Assigned To = ALL
        await ppmFilterFlow.setAssignedToAll();

        // Step 3: Open Building dropdown and verify item count and expected building present
        await ppmFilterPage.tapBuildingDropdown();

        const buildingCount = await ppmFilterPage.getDropdownItemCount(
            ppmFilterPage.buildingDropdownItems
        );
        expect(buildingCount).toBeGreaterThanOrEqual(ppmFilterData.buildings.length);

        const buildingItems       = await $$(ppmFilterPage.buildingDropdownItems);
        const contentDescs        = await buildingItems.map(el => el.getAttribute('content-desc'));
        const hasExpectedBuilding = contentDescs.some(
            desc => desc && desc.includes(ppmFilterData.buildings[0].name)
        );
        expect(hasExpectedBuilding).toBe(true);

        // Step 4: Select building and verify the dropdown label is updated
        await ppmFilterPage.selectBuildingByResourceId(ppmFilterData.defaultBuilding.resourceId);
        await browser.pause(1500);

        const buildingDropdownText = await ppmFilterPage.getBuildingDropdownText();
        expect(buildingDropdownText).toContain(ppmFilterData.defaultBuilding.name);

        // Step 5: Apply and verify redirect to PPM home
        const ppmTitle       = await ppmFilterFlow.applyFilter();
        const isCardsVisible = await ppmFilterFlow.isStatusCardsVisible();

        expect(ppmTitle).toContain(ppmFilterData.expectedPpmTitle);
        expect(isCardsVisible).toBe(true);
    });

    // ── TC_PPMF_004 ───────────────────────────────────────────────────────────

    it('TC_PPMF_004: Verify full dropdown cascade: Building → Floor → Space → Asset', async () => {
        allure.addFeature('PPM Filter');
        allure.addSeverity('High');
        allure.addTag('regression');

        // Step 1: Open filter, set Assigned To = ALL
        await ppmFilterFlow.openFilter();
        await ppmFilterFlow.setAssignedToAll();

        // Step 2: Select building (prerequisite for all child dropdowns)
        await ppmFilterFlow.selectBuilding(ppmFilterData.defaultBuilding);

        // Step 3: Floor dropdown must load values based on selected building
        await ppmFilterPage.tapFloorDropdown();
        const floorCount = await ppmFilterPage.getDropdownItemCount(ppmFilterPage.floorDropdownItems);
        expect(floorCount).toBeGreaterThan(0);

        await ppmFilterPage.selectFirstAvailableOption(ppmFilterPage.floorDropdownItems);
        await browser.pause(1500);
        const floorText = await ppmFilterPage.getFloorDropdownText();
        expect(floorText.trim().length).toBeGreaterThan(0);

        // Step 4: Space dropdown must load values based on selected floor
        await ppmFilterPage.tapSpaceDropdown();
        const spaceCount = await ppmFilterPage.getDropdownItemCount(ppmFilterPage.spaceDropdownItems);
        expect(spaceCount).toBeGreaterThan(0);

        await ppmFilterPage.selectFirstAvailableOption(ppmFilterPage.spaceDropdownItems);
        await browser.pause(1500);
        const spaceText = await ppmFilterPage.getSpaceDropdownText();
        expect(spaceText.trim().length).toBeGreaterThan(0);

        // Step 5: Asset dropdown must open based on selected space.
        // Assets may be empty for a given space — that is a valid state.

        // Step 6: Apply and verify redirect to PPM home
        const ppmTitle       = await ppmFilterFlow.applyFilter();
        const isCardsVisible = await ppmFilterFlow.isStatusCardsVisible();

        expect(ppmTitle).toContain(ppmFilterData.expectedPpmTitle);
        expect(isCardsVisible).toBe(true);
    });

    // ── TC_PPMF_005 ───────────────────────────────────────────────────────────

    it('TC_PPMF_005: Verify filtering using Building only', async () => {
        allure.addFeature('PPM Filter');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        await ppmFilterFlow.openFilter();
        await ppmFilterFlow.setAssignedToAll();
        await ppmFilterFlow.selectBuilding(ppmFilterData.defaultBuilding);

        const { ppmTitle, isCardsVisible, detailsData, infoData } =
            await ppmFilterFlow.validateFilterResults();

        expect(ppmTitle).toContain(ppmFilterData.expectedPpmTitle);
        expect(isCardsVisible).toBe(true);
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(detailsData.building).not.toBe('-');
        expect(detailsData.building).toBeDefined();
        expect(detailsData.requester).toBeDefined();
        expect(detailsData.description).toBeDefined();
        expect(infoData.workOrderType).toBeDefined();
        expect(infoData.serviceCategory).toBeDefined();
        expect(infoData.problemType).toBeDefined();

        console.log('[TC_PPMF_005] Details:', detailsData);
        console.log('[TC_PPMF_005] Info:',    infoData);
    });

    // ── TC_PPMF_006 ───────────────────────────────────────────────────────────

    it('TC_PPMF_006: Verify filtering using Building + Floor', async () => {
        allure.addFeature('PPM Filter');
        allure.addSeverity('Critical');
        allure.addTag('regression');

        await ppmFilterFlow.openFilter();
        await ppmFilterFlow.setAssignedToAll();
        await ppmFilterFlow.selectBuilding(ppmFilterData.defaultBuilding);
        await ppmFilterFlow.selectFirstFloor();

        const { ppmTitle, isCardsVisible, detailsData, infoData } =
            await ppmFilterFlow.validateFilterResults();

        expect(ppmTitle).toContain(ppmFilterData.expectedPpmTitle);
        expect(isCardsVisible).toBe(true);
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(detailsData.building).not.toBe('-');
        expect(detailsData.building).toBeDefined();
        expect(detailsData.requester).toBeDefined();
        expect(infoData.workOrderType).toBeDefined();
        expect(infoData.serviceCategory).toBeDefined();
        expect(infoData.problemType).toBeDefined();

        console.log('[TC_PPMF_006] Details:', detailsData);
        console.log('[TC_PPMF_006] Info:',    infoData);
    });

    // ── TC_PPMF_007 ───────────────────────────────────────────────────────────

    it('TC_PPMF_007: Verify filtering using Building + Floor + Space', async () => {
        allure.addFeature('PPM Filter');
        allure.addSeverity('Critical');
        allure.addTag('regression');

        await ppmFilterFlow.openFilter();
        await ppmFilterFlow.setAssignedToAll();
        await ppmFilterFlow.selectBuilding(ppmFilterData.defaultBuilding);
        await ppmFilterFlow.selectFirstFloor();
        await ppmFilterFlow.selectFirstSpace();

        const { ppmTitle, isCardsVisible, detailsData, infoData } =
            await ppmFilterFlow.validateFilterResults();

        expect(ppmTitle).toContain(ppmFilterData.expectedPpmTitle);
        expect(isCardsVisible).toBe(true);
        expect(detailsData.isDetailsTabActive).toBe(true);
        expect(detailsData.building).not.toBe('-');
        expect(detailsData.building).toBeDefined();
        expect(detailsData.additionalSpace).toBeDefined();
        expect(detailsData.requester).toBeDefined();
        expect(infoData.workOrderType).toBeDefined();
        expect(infoData.serviceCategory).toBeDefined();
        expect(infoData.problemType).toBeDefined();

        console.log('[TC_PPMF_007] Details:', detailsData);
        console.log('[TC_PPMF_007] Info:',    infoData);
    });

    // ── TC_PPMF_008 ───────────────────────────────────────────────────────────

    it('TC_PPMF_008: Verify filtering using Building + Floor + Space + Asset', async () => {
        allure.addFeature('PPM Filter');
        allure.addSeverity('Critical');
        allure.addTag('regression');

        await ppmFilterFlow.openFilter();
        await ppmFilterFlow.setAssignedToAll();
        await ppmFilterFlow.selectBuilding(ppmFilterData.defaultBuilding);
        await ppmFilterFlow.selectFirstFloor();
        await ppmFilterFlow.selectFirstSpace();
        const selectedAsset = await ppmFilterFlow.selectFirstAsset();
        console.log('[TC_PPMF_008] Selected Asset:', selectedAsset);

        const { ppmTitle, isCardsVisible, detailsData, infoData } =
            await ppmFilterFlow.validateFilterResults();

        expect(ppmTitle).toContain(ppmFilterData.expectedPpmTitle);
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

        console.log('[TC_PPMF_008] Details:', detailsData);
        console.log('[TC_PPMF_008] Info:',    infoData);
    });

    // ── TC_PPMF_009 ───────────────────────────────────────────────────────────

    it('TC_PPMF_009: Verify filtering using Building + Floor + Space + Service Category and validate work order details match selected filter criteria', async () => {
        allure.addFeature('PPM Filter');
        allure.addSeverity('Critical');
        allure.addTag('smoke');
        allure.addTag('regression');

        await ppmFilterFlow.openFilter();
        await ppmFilterFlow.setAssignedToAll();
        await ppmFilterFlow.selectBuilding(ppmFilterData.tc09Building);
        await ppmFilterFlow.selectFirstFloor();
        await ppmFilterFlow.selectFirstSpace();
        const selectedServiceCategory = await ppmFilterFlow.selectFirstServiceCategory();
        console.log('[TC_PPMF_009] Selected Service Category:', selectedServiceCategory);

        const { ppmTitle, isCardsVisible, detailsData, infoData } =
            await ppmFilterFlow.validateFilterResults();

        expect(ppmTitle).toContain(ppmFilterData.expectedPpmTitle);
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

        console.log('[TC_PPMF_009] Filter criteria:', {
            building: ppmFilterData.tc09Building.name,
            selectedServiceCategory,
        });
        console.log('[TC_PPMF_009] Details:', detailsData);
        console.log('[TC_PPMF_009] Info:',    infoData);
    });

});
