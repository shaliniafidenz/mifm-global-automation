'use strict';

const action = require('../../utils/action.utils');

/**
 * Page Object for the PPM Filter screen.
 *
 * Opened by tapping ppm_filter_button on the PPM landing page.
 * Contains all filter controls: dropdowns, Assigned To toggles,
 * and Apply / Clear action buttons.
 */
class PPMFilterPage {

    // ── Filter screen app-bar title ─────────────────────────────────────────────
    get filterPageTitle() {
        return $('android=new UiSelector().resourceId("generalAppBar_view_text_01")');
    }

    // ── Filter dropdowns ────────────────────────────────────────────────────────
    get buildingDropdown() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppm_filter_building_dropdown"))'
        );
    }

    get floorDropdown() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppm_filter_floor_dropdown"))'
        );
    }

    get spaceDropdown() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppm_filter_space_dropdown"))'
        );
    }

    get assetDropdown() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppm_filter_asset_dropdown"))'
        );
    }

    get serviceCategoryDropdown() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppm_filter_serviceCategory_dropdown"))'
        );
    }

    // ── Assigned To toggles ─────────────────────────────────────────────────────
    get assignedToMeButton() {
        return $('android=new UiSelector().resourceId("ppm_filter_assignedTo_me_button")');
    }

    get assignedToAllButton() {
        return $('android=new UiSelector().resourceId("ppm_filter_assignedTo_all_button")');
    }

    // ── Action buttons ──────────────────────────────────────────────────────────
    get applyButton() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppm_filter_apply_button"))'
        );
    }

    get clearButton() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppm_filter_clear_button"))'
        );
    }

    // ── Dropdown list-item selectors (used with $$) ─────────────────────────────
    // NOTE: The PPM filter screen reuses the CWO filter list-item resource IDs
    // for all dropdown options (shared component in the app).
    get buildingDropdownItems() {
        return 'android=new UiSelector().resourceIdMatches(".*cwo_filter_buildingItems_dropdown_list_item.*")';
    }

    get floorDropdownItems() {
        return 'android=new UiSelector().resourceIdMatches(".*cwo_filter_floor.*list_item.*")';
    }

    get spaceDropdownItems() {
        return 'android=new UiSelector().resourceIdMatches(".*cwo_filter_space.*list_item.*")';
    }

    get assetDropdownItems() {
        return 'android=new UiSelector().resourceIdMatches(".*cwo_filter_asset.*list_item.*")';
    }

    get serviceCategoryDropdownItems() {
        return 'android=new UiSelector().resourceIdMatches(".*cwo_filter_serviceCategory.*list_item.*")';
    }

    // ── Interaction methods ─────────────────────────────────────────────────────

    async getFilterPageTitle() {
        return await action.getTextMultiPart(this.filterPageTitle);
    }

    async tapBuildingDropdown() {
        await action.click(this.buildingDropdown);
        await browser.pause(1000);
    }

    async tapFloorDropdown() {
        await action.click(this.floorDropdown);
        await browser.pause(1000);
    }

    async tapSpaceDropdown() {
        await action.click(this.spaceDropdown);
        await browser.pause(1000);
    }

    async tapAssetDropdown() {
        await action.click(this.assetDropdown);
        await browser.pause(1000);
    }

    async tapServiceCategoryDropdown() {
        await action.click(this.serviceCategoryDropdown);
        await browser.pause(1000);
    }

    async tapAssignedToAll() {
        await action.click(this.assignedToAllButton);
        await browser.pause(500);
    }

    async tapAssignedToMe() {
        await action.click(this.assignedToMeButton);
        await browser.pause(500);
    }

    async tapApply() {
        await action.click(this.applyButton);
    }

    async tapClear() {
        await action.click(this.clearButton);
        await browser.pause(1000);
    }

    // ── Visibility helpers ──────────────────────────────────────────────────────

    async isBuildingDropdownDisplayed() {
        return await action.isDisplayed(this.buildingDropdown);
    }

    async isFloorDropdownDisplayed() {
        return await action.isDisplayed(this.floorDropdown);
    }

    async isSpaceDropdownDisplayed() {
        return await action.isDisplayed(this.spaceDropdown);
    }

    async isAssetDropdownDisplayed() {
        return await action.isDisplayed(this.assetDropdown);
    }

    async isServiceCategoryDropdownDisplayed() {
        return await action.isDisplayed(this.serviceCategoryDropdown);
    }

    // ── Selection helpers ───────────────────────────────────────────────────────

    async selectBuildingByResourceId(resourceId) {
        const el = await $(`android=new UiSelector().resourceId("${resourceId}")`);
        await action.click(el);
    }

    /**
     * Waits for at least one item to appear in an open dropdown,
     * clicks the first item, and returns its content-desc text.
     *
     * @param {string} itemsSelector - resourceIdMatches selector string
     * @returns {Promise<string>} content-desc of the selected item
     */
    async selectFirstAvailableOption(itemsSelector) {
        await browser.waitUntil(
            async () => (await $$(itemsSelector)).length > 0,
            {
                timeout:    8000,
                interval:   500,
                timeoutMsg: `No dropdown options appeared for: ${itemsSelector}`,
            }
        );

        const items = await $$(itemsSelector);
        if (items.length === 0) throw new Error('No dropdown items available');

        const firstItem   = items[0];
        const contentDesc = (await firstItem.getAttribute('content-desc')) || '';
        await action.click(firstItem);
        return contentDesc;
    }

    /**
     * Returns the count of visible items for a given dropdown selector.
     * Returns 0 if no items appear within the timeout.
     */
    async getDropdownItemCount(itemsSelector, timeout = 6000) {
        try {
            await browser.waitUntil(
                async () => (await $$(itemsSelector)).length > 0,
                { timeout, interval: 500 }
            );
            return (await $$(itemsSelector)).length;
        } catch (_) {
            return 0;
        }
    }

    // ── Text-read helpers ───────────────────────────────────────────────────────

    async getBuildingDropdownText() {
        return await action.getContentDescription(this.buildingDropdown);
    }

    async getFloorDropdownText() {
        return await action.getContentDescription(this.floorDropdown);
    }

    async getSpaceDropdownText() {
        return await action.getContentDescription(this.spaceDropdown);
    }
}

module.exports = new PPMFilterPage();
