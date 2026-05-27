'use strict';

const cwoLandingPage    = require('../pages/cwo/cwoLanding.page');
const cwoFilterPage     = require('../pages/cwo/cwoFilter.page');
const cwoDetailViewPage = require('../pages/cwo/cwoDetailView.page');
const commonPage        = require('../pages/common.page');
const footerPage        = require('../pages/footer.page');
const action            = require('../utils/action.utils');

/**
 * CWO Filter Flow
 *
 * Provides reusable, composable methods for:
 *  - Navigating to the CWO landing page
 *  - Opening and configuring the filter screen
 *  - Applying / clearing filters
 *  - Opening the first available work order after filtering
 *  - Collecting Details tab and Information tab data for assertions
 *  - Navigating back to the CWO list
 *
 * Every test case in cwo.filter.e2e.js uses these building-blocks.
 */
class CWOFilterFlow {

    // ── Navigation ──────────────────────────────────────────────────────────────

    /**
     * Navigates to the CWO landing page via the footer icon.
     * @returns {Promise<string>} CWO page title text
     */
    async navigateToCWO() {
        await footerPage.tapCWOFooterIcon();
        await browser.pause(2000);
        return await cwoLandingPage.getCWOTitle();
    }

    // ── Filter screen control ───────────────────────────────────────────────────

    /**
     * Taps the Filter button on the CWO landing page and waits for the
     * filter screen to appear.
     * @returns {Promise<string>} filter screen title
     */
    async openFilter() {
        await action.click(cwoLandingPage.cwoFilterButton);
        await browser.pause(1500);
        return await cwoFilterPage.getFilterPageTitle();
    }

    /**
     * Selects the "Assigned To = ALL" toggle on the filter screen.
     * Must be called for every test case per specification.
     */
    async setAssignedToAll() {
        await cwoFilterPage.tapAssignedToAll();
    }

    /**
     * Opens the Building dropdown and selects a building by its resource ID.
     * @param {{ resourceId: string, name: string }} building
     */
    async selectBuilding(building) {
        await cwoFilterPage.tapBuildingDropdown();
        await cwoFilterPage.selectBuildingByResourceId(building.resourceId);
        await browser.pause(1500);
    }

    /**
     * Opens the Floor dropdown and selects the first available option.
     * Requires a building to have been selected first.
     * @returns {Promise<string>} content-desc of the selected floor item
     */
    async selectFirstFloor() {
        await cwoFilterPage.tapFloorDropdown();
        const selected = await cwoFilterPage.selectFirstAvailableOption(cwoFilterPage.floorDropdownItems);
        await browser.pause(1500);
        return selected;
    }

    /**
     * Opens the Space dropdown and selects the first available option.
     * Requires building + floor to have been selected first.
     * @returns {Promise<string>} content-desc of the selected space item
     */
    async selectFirstSpace() {
        await cwoFilterPage.tapSpaceDropdown();
        const selected = await cwoFilterPage.selectFirstAvailableOption(cwoFilterPage.spaceDropdownItems);
        await browser.pause(1500);
        return selected;
    }

    /**
     * Opens the Asset dropdown and selects the first available option.
     * Requires building + floor + space to have been selected first.
     * @returns {Promise<string>} content-desc of the selected asset item
     */
    async selectFirstAsset() {
        await cwoFilterPage.tapAssetDropdown();
        const selected = await cwoFilterPage.selectFirstAvailableOption(cwoFilterPage.assetDropdownItems);
        await browser.pause(1500);
        return selected;
    }

    /**
     * Opens the Service Category dropdown and selects the first available option.
     * @returns {Promise<string>} content-desc of the selected service category item
     */
    async selectFirstServiceCategory() {
        await cwoFilterPage.tapServiceCategoryDropdown();
        const selected = await cwoFilterPage.selectFirstAvailableOption(cwoFilterPage.serviceCategoryDropdownItems);
        await browser.pause(1500);
        return selected;
    }

    /**
     * Taps the Apply button and waits for the CWO landing page to reload.
     * @returns {Promise<string>} CWO landing page title (confirms redirect)
     */
    async applyFilter() {
        await cwoFilterPage.tapApply();
        await browser.pause(3000);
        return await cwoLandingPage.getCWOTitle();
    }

    /**
     * Taps the Clear button on the filter screen (resets all filter fields).
     */
    async clearFilter() {
        await cwoFilterPage.tapClear();
        await browser.pause(1000);
    }

    // ── CWO list interactions ───────────────────────────────────────────────────

    /**
     * Returns true when the horizontal status-card scroll container is visible,
     * indicating that at least one status row is rendered on the CWO list.
     */
    async isStatusCardsVisible() {
        return await action.isDisplayed(cwoLandingPage.horizontalScrollContainer);
    }

    /**
     * Iterates through CWO status cards (New → Assignment → Acknowledgement →
     * In-Progress → Completed) and opens the first list item of the first
     * status that has at least one work order.
     *
     * @returns {Promise<boolean>} true when a work order was successfully opened
     * @throws {Error} when no work orders are found in any status after filtering
     */
    async openFirstAvailableWorkOrder() {
        const cards = [
            { card: cwoLandingPage.newCard,             firstItemId: 'cwo_new_list_item_01' },
            { card: cwoLandingPage.assignmentCard,      firstItemId: 'cwo_assignment_list_item_01' },
            { card: cwoLandingPage.acknowledgementCard, firstItemId: 'cwo_acknowledgement_list_item_01' },
            { card: cwoLandingPage.inProgressCard,      firstItemId: 'cwo_inprogress_list_item_01' },
            { card: cwoLandingPage.completedCard,       firstItemId: 'cwo_completed_list_item_01' },
        ];

        for (const { card, firstItemId } of cards) {
            try {
                const count = await cwoLandingPage.getTotalWOCountByStatus(card);
                if (count > 0) {
                    await action.click(card);
                    await browser.pause(2000);
                    const firstListItem = await $(`android=new UiSelector().resourceId("${firstItemId}")`);
                    await action.click(firstListItem);
                    await browser.pause(2000);
                    return true;
                }
            } catch (_) {
                // Card not visible for this status — try next
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
     * @returns {Promise<object>} { isDetailsTabActive, building, additionalSpace, asset, requester, description }
     */
    async getDetailsTabData() {
        return await cwoDetailViewPage.getDetailsTabData();
    }

    /**
     * Switches to the Information tab and reads all visible field values.
     * @returns {Promise<object>} { workOrderType, serviceCategory, problemType, asset }
     */
    async getInfoTabData() {
        return await cwoDetailViewPage.getInfoTabData();
    }

    /**
     * Taps the Back button to return from the WO detail screen to the CWO list.
     */
    async navigateBackToList() {
        await commonPage.tapBack();
        await browser.pause(2000);
    }

    // ── Compound validation helper ──────────────────────────────────────────────

    /**
     * Executes the standard post-apply validation sequence (test steps 5 – 10):
     *
     *   5. Tap Apply and read the CWO landing page title (confirms redirect)
     *   6. Check that status cards are visible
     *   7. Open the first available work order
     *   8. Collect Details tab data
     *   9. Collect Information tab data
     *  10. Navigate back to the CWO list
     *
     * @returns {Promise<{
     *   cwoTitle: string,
     *   isCardsVisible: boolean,
     *   detailsData: object,
     *   infoData: object,
     * }>}
     */
    async validateFilterResults() {
        const cwoTitle       = await this.applyFilter();   // taps Apply, waits, returns CWO page title
        const isCardsVisible = await this.isStatusCardsVisible();

        await this.openFirstAvailableWorkOrder();

        const detailsData = await this.getDetailsTabData();
        const infoData    = await this.getInfoTabData();

        await this.navigateBackToList();

        return { cwoTitle, isCardsVisible, detailsData, infoData };
    }
}

module.exports = new CWOFilterFlow();
