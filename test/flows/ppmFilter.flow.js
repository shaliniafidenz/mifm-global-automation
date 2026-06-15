'use strict';

const ppmLandingPage    = require('../pages/ppm/ppmLanding.page');
const ppmFilterPage     = require('../pages/ppm/ppmFilter.page');
const ppmDetailViewPage = require('../pages/ppm/ppmDetailView.page');
const commonPage        = require('../pages/common.page');
const footerPage        = require('../pages/footer.page');
const action            = require('../utils/action.utils');

/**
 * PPM Filter Flow
 *
 * Provides reusable, composable methods for:
 *  - Navigating to the PPM landing page
 *  - Opening and configuring the filter screen
 *  - Applying / clearing filters
 *  - Opening the first available work order after filtering
 *  - Collecting Details tab and Information tab data for assertions
 *  - Navigating back to the PPM list
 *
 * Every test case in ppm.filter.e2e.js uses these building-blocks.
 */
class PPMFilterFlow {

    // ── Navigation ──────────────────────────────────────────────────────────────

    /**
     * Navigates to the PPM landing page via the footer icon.
     * @returns {Promise<string>} PPM page title text
     */
    async navigateToPPM() {
        await footerPage.tapPPMFooterIcon();
        await browser.pause(2000);
        return await ppmLandingPage.getPPMTitle();
    }

    // ── Filter screen control ───────────────────────────────────────────────────

    /**
     * Taps the Filter button on the PPM landing page and waits for the
     * filter screen to appear.
     * @returns {Promise<string>} filter screen title
     */
    async openFilter() {
        await action.click(ppmLandingPage.ppmFilterButton);
        await browser.pause(1500);
        return await ppmFilterPage.getFilterPageTitle();
    }

    /**
     * Selects the "Assigned To = ALL" toggle on the filter screen.
     * Must be called for every test case per specification.
     */
    async setAssignedToAll() {
        await ppmFilterPage.tapAssignedToAll();
    }

    /**
     * Opens the Building dropdown and selects a building by its resource ID.
     * @param {{ resourceId: string, name: string }} building
     */
    async selectBuilding(building) {
        await ppmFilterPage.tapBuildingDropdown();
        await ppmFilterPage.selectBuildingByResourceId(building.resourceId);
        await browser.pause(1500);
    }

    /**
     * Opens the Floor dropdown and selects the first available option.
     * Requires a building to have been selected first.
     * @returns {Promise<string>} content-desc of the selected floor item
     */
    async selectFirstFloor() {
        await ppmFilterPage.tapFloorDropdown();
        const selected = await ppmFilterPage.selectFirstAvailableOption(ppmFilterPage.floorDropdownItems);
        await browser.pause(1500);
        return selected;
    }

    /**
     * Opens the Space dropdown and selects the first available option.
     * Requires building + floor to have been selected first.
     * @returns {Promise<string>} content-desc of the selected space item
     */
    async selectFirstSpace() {
        await ppmFilterPage.tapSpaceDropdown();
        const selected = await ppmFilterPage.selectFirstAvailableOption(ppmFilterPage.spaceDropdownItems);
        await browser.pause(1500);
        return selected;
    }

    /**
     * Opens the Service Category dropdown and selects the first available option.
     * @returns {Promise<string>} content-desc of the selected service category item
     */
    async selectFirstServiceCategory() {
        await ppmFilterPage.tapServiceCategoryDropdown();
        const selected = await ppmFilterPage.selectFirstAvailableOption(ppmFilterPage.serviceCategoryDropdownItems);
        await browser.pause(1500);
        return selected;
    }

    /**
     * Taps the Apply button and waits for the PPM landing page to reload.
     * @returns {Promise<string>} PPM landing page title (confirms redirect)
     */
    async applyFilter() {
        await ppmFilterPage.tapApply();
        await browser.pause(3000);
        return await ppmLandingPage.getPPMTitle();
    }

    /**
     * Taps the Clear button on the filter screen (resets all filter fields).
     */
    async clearFilter() {
        await ppmFilterPage.tapClear();
        await browser.pause(1000);
    }

    // ── PPM list interactions ───────────────────────────────────────────────────

    /**
     * Returns true when the horizontal status-card scroll container is visible,
     * indicating that at least one status row is rendered on the PPM list.
     */
    async isStatusCardsVisible() {
        return await action.isDisplayed(ppmLandingPage.horizontalScrollContainer);
    }

    /**
     * Iterates through PPM status cards (New → Assignment → Acknowledgement →
     * In-Progress → Completed) and opens the first list item of the first
     * status that has at least one work order.
     *
     * @returns {Promise<boolean>} true when a work order was successfully opened
     * @throws {Error} when no work orders are found in any status after filtering
     */
    async openFirstAvailableWorkOrder() {
        const cards = [
            { card: ppmLandingPage.newCard,             firstItemId: 'ppm_new_list_item_01' },
            { card: ppmLandingPage.assignmentCard,      firstItemId: 'ppm_assignment_list_item_01' },
            { card: ppmLandingPage.acknowledgementCard, firstItemId: 'ppm_acknowledgement_list_item_01' },
            { card: ppmLandingPage.inProgressCard,      firstItemId: 'ppm_inprogress_list_item_01' },
            { card: ppmLandingPage.completedCard,       firstItemId: 'ppm_completed_list_item_01' },
        ];

        for (const { card, firstItemId } of cards) {
            try {
                const count = await ppmLandingPage.getTotalWOCountByStatus(card);
                if (count > 0) {
                    await action.click(card);
                    await browser.pause(2000);
                    const firstListItem = await $(`android=new UiSelector().resourceId("${firstItemId}")`);
                    await action.click(firstListItem);
                    await browser.pause(2000);
                    return true;
                }
            } catch (_) {
                continue;
            }
        }

        throw new Error(
            'No work orders found in any status after applying filter. ' +
            'Verify filter criteria and test data.'
        );
    }

    // ── Work order detail validation ────────────────────────────────────────────

    /**
     * Reads all visible field values from the Details tab of the opened WO.
     */
    async getDetailsTabData() {
        return await ppmDetailViewPage.getDetailsTabData();
    }

    /**
     * Switches to the Information tab and reads all visible field values.
     */
    async getInfoTabData() {
        return await ppmDetailViewPage.getInfoTabData();
    }

    /**
     * Taps the Back button to return from the WO detail screen to the PPM list.
     */
    async navigateBackToList() {
        await commonPage.tapBack();
        await browser.pause(2000);
    }

    // ── Compound validation helper ──────────────────────────────────────────────

    /**
     * Executes the standard post-apply validation sequence:
     *
     *   1. Tap Apply and read the PPM landing page title (confirms redirect)
     *   2. Check that status cards are visible
     *   3. Open the first available work order
     *   4. Collect Details tab data
     *   5. Collect Information tab data
     *   6. Navigate back to the PPM list
     *
     * @returns {Promise<{
     *   ppmTitle: string,
     *   isCardsVisible: boolean,
     *   detailsData: object,
     *   infoData: object,
     * }>}
     */
    async validateFilterResults() {
        const ppmTitle       = await this.applyFilter();
        const isCardsVisible = await this.isStatusCardsVisible();

        await this.openFirstAvailableWorkOrder();

        const detailsData = await this.getDetailsTabData();
        const infoData    = await this.getInfoTabData();

        await this.navigateBackToList();

        return { ppmTitle, isCardsVisible, detailsData, infoData };
    }
}

module.exports = new PPMFilterFlow();
