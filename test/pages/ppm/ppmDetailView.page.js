'use strict';

const action = require('../../utils/action.utils');

/**
 * Page Object for the PPM Work Order Detail / Information view.
 *
 * Used by the PPM Filter flow to validate that the work order opened
 * after applying a filter contains the expected field values.
 *
 * Covers:
 *   • Details tab   – building, additional space, asset, requester, description
 *   • Information tab – work order type, service category, problem type, asset
 */
class PPMDetailViewPage {

    // ── Tab navigation ──────────────────────────────────────────────────────────
    get detailsTab() {
        return $('android=new UiSelector().resourceId("navigationItemActive_Details_tab")');
    }

    get informationTab() {
        return $('android=new UiSelector().resourceId("navigationItemInactive_Information_tab")');
    }

    // ── Details tab fields ──────────────────────────────────────────────────────
    get buildingField() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppm_building_dropdown"))'
        );
    }

    get additionalSpaceField() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppm_additional_space"))'
        );
    }

    get assetField() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppm_asset_dropdown"))'
        );
    }

    get requesterField() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppm_requestor"))'
        );
    }

    get descriptionField() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppm_description"))'
        );
    }

    // ── Information tab fields ──────────────────────────────────────────────────
    get workOrderTypeValue() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppmAdditionalInformationTab_workOrderType_value"))'
        );
    }

    get serviceCategoryValue() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppmAdditionalInformationTab_serviceCategory_value"))'
        );
    }

    get problemTypeValue() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppmAdditionalInformationTab_problemType_value"))'
        );
    }

    get assetInfoLabel() {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            '.scrollIntoView(new UiSelector().resourceId("ppmAdditionalInformationTab_asset_label"))'
        );
    }

    // ── Interaction methods ─────────────────────────────────────────────────────

    async isDetailsTabActive() {
        return await action.isDisplayed(this.detailsTab);
    }

    async tapInformationTab() {
        await action.click(this.informationTab);
        await browser.pause(2000);
    }

    // ── Field-value readers ─────────────────────────────────────────────────────

    async _readDropdownField(element) {
        const raw   = await action.getText(element);
        const parts = raw.split('\n');
        return (parts[2] ?? parts[0] ?? '').trim();
    }

    async _safeRead(fn) {
        try {
            return await fn();
        } catch (_) {
            return '-';
        }
    }

    async getBuildingValue()        { return await this._readDropdownField(this.buildingField); }
    async getAdditionalSpaceValue() { return await this._readDropdownField(this.additionalSpaceField); }
    async getAssetValue()           { return await this._readDropdownField(this.assetField); }
    async getRequesterValue()       { return await this._readDropdownField(this.requesterField); }

    async getDescriptionValue() {
        return (await action.getText(this.descriptionField)).trim();
    }

    async getWorkOrderTypeValue() {
        return (await action.getText(this.workOrderTypeValue)).trim();
    }

    async getServiceCategoryValue() {
        return (await action.getText(this.serviceCategoryValue)).trim();
    }

    async getProblemTypeValue() {
        return (await action.getText(this.problemTypeValue)).trim();
    }

    async getAssetInfoValue() {
        return (await action.getText(this.assetInfoLabel)).trim();
    }

    // ── Aggregate data collectors ───────────────────────────────────────────────

    /**
     * Returns all visible field values from the Details tab.
     * Fields that do not exist for this WO type/status are returned as '-'.
     */
    async getDetailsTabData() {
        const isDetailsTabActive = await this.isDetailsTabActive();
        const building           = await this._safeRead(() => this.getBuildingValue());
        const additionalSpace    = await this._safeRead(() => this.getAdditionalSpaceValue());
        const asset              = await this._safeRead(() => this.getAssetValue());
        const requester          = await this._safeRead(() => this.getRequesterValue());
        const description        = await this._safeRead(() => this.getDescriptionValue());

        return { isDetailsTabActive, building, additionalSpace, asset, requester, description };
    }

    /**
     * Switches to the Information tab and returns all visible field values.
     * Fields that do not exist for this WO type/status are returned as '-'.
     */
    async getInfoTabData() {
        await this.tapInformationTab();

        const workOrderType   = await this._safeRead(() => this.getWorkOrderTypeValue());
        const serviceCategory = await this._safeRead(() => this.getServiceCategoryValue());
        const problemType     = await this._safeRead(() => this.getProblemTypeValue());
        const asset           = await this._safeRead(() => this.getAssetInfoValue());

        return { workOrderType, serviceCategory, problemType, asset };
    }
}

module.exports = new PPMDetailViewPage();
