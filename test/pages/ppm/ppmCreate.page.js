const action = require('../../utils/action.utils');
const commonPage = require('../common.page');

class PPMCreatePage{

    //PPM Create form elements
    get ppmRequesterDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_create_requester_dropdown"))');
    }
    get ppmRequesterDropdownOptions(){
        return 'android=new UiSelector().resourceIdMatches(".*ppm_create_requester_dropdown_list_item.*")';
    }

    get ppmBuildingDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_create_building_dropdown"))');
    }
    get ppmBuildingDropdownOptions(){
        return 'android=new UiSelector().resourceIdMatches(".*ppm_create_building_dropdown_list_item.*")';
    }

    get ppmLocationDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_create_location_dropdown"))');
    }
    get ppmLocationDropdownOptions(){
        return 'android=new UiSelector().resourceIdMatches(".*ppm_create_location_dropdown_list_item.*")';
    }

    get ppmMasterWODropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_create_masterworkorder_dropdown"))');
    }
    get ppmMasterWODropdownOptions(){
        return 'android=new UiSelector().resourceIdMatches(".*ppm_create_masterworkorder_dropdown_list_item_.*")';
    }

    get ppmChecklistDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_create_dropdown"))');
    }
    get ppmChecklistDropdownOptions(){
        return 'android=new UiSelector().resourceIdMatches(".*ppm_create_dropdown_list_item_.*")';
    }

    get ppmAssetDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_create_asset_dropdown"))');
    }
    get ppmAssetDropdownOptions(){
        return 'android=new UiSelector().resourceIdMatches(".*ppm_create_asset_dropdown_list_item.*")';
    }

    get ppmServiceCategoryDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_create_serviceCategory_dropdown"))');
    }
    get ppmServiceCategoryDropdownOptions(){
        return 'android=new UiSelector().resourceIdMatches(".*ppm_create_serviceCategory_dropdown_list_item.*")';
    }

    get ppmPriorityLevelDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_create_priorityLevel_dropdown"))');
    }
    get ppmPriorityLevelDropdownOptions(){
        return 'android=new UiSelector().resourceIdMatches(".*ppm_create_priorityLevel_dropdown_list_item.*")';
    }

    get ppmFrequencyDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_create_frequency_dropdown"))');
    }
    get ppmFrequencyDropdownOptions(){
        return 'android=new UiSelector().resourceIdMatches(".*ppm_create_frequency_dropdown_list_item.*")';
    }
    get ppmFrequencyClearButton(){ return $('android=new UiSelector().resourceId("ppm_create_frequency_clear_button")');}

    get ppmDescription(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_create_description_txt"))');
    }

    get ppmSubmitButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_create_submit_button"))');
    }

    get ppmResetButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_create_reset_button"))');
    }

    get ppmMasterWORequiredErrorMessage(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_create_masterWorkOrder_required_error"))');
    }

    get ppmFrequencyRequiredErrorMessage(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_create_frequency_required_error"))');
    }

    get ppmChecklistRequiredErrorMessage(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_create_required_error"))');
    }


    async tapRequesterDropdown(){
        await action.click(this.ppmRequesterDropdown);
    }

    async tapBuildingDropdown(){
        await action.click(this.ppmBuildingDropdown);
    }

    async tapLocationDropdown(){
        await action.click(this.ppmLocationDropdown);
    }

    async tapChecklistDropdown(){
        await action.click(this.ppmChecklistDropdown);
    }

    async tapAssetDropdown(){
        await action.click(this.ppmAssetDropdown);
    }

    async tapServiceCategoryDropdown(){
        await action.click(this.ppmServiceCategoryDropdown);
    }

    async tapPriorityLevelDropdown(){
        await action.click(this.ppmPriorityLevelDropdown);
    }

    async tapFrequencyDropdown(){
        await action.click(this.ppmFrequencyDropdown);
    }

    async tapFrequencyClearButton(){
        await action.click(this.ppmFrequencyClearButton);
    }

    async tapDescriptionField(){
        await action.click(this.ppmDescription);
    }

    async enterDescription(description){
        await action.type(this.ppmDescription, description);
    }

    async tapSubmitButton(){
        await action.click(this.ppmSubmitButton);
    }

    async tapResetPPMButton(){
        await action.click(this.ppmResetButton);
    }

    async selectOptionByTextAndIndex(dropdownName, option){

        console.log(`Selecting option "${option}" from dropdown "${dropdownName}"`);

        switch(dropdownName){
            case 'Requester':
                await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceIdMatches(".*ppm_create_requester_dropdown_list_item.*"))');
                await commonPage.selectRandomOption(await this.ppmRequesterDropdownOptions);
                break;
            case 'Building':
                await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceIdMatches(".*ppm_create_building_dropdown_list_item.*"))');
                await commonPage.selectOptionByTextAndIndex(await this.ppmBuildingDropdownOptions, option);
                break;
            case 'Location':
                await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceIdMatches(".*ppm_create_location_dropdown_list_item.*"))');
                await commonPage.selectOptionByTextAndIndex(await this.ppmLocationDropdownOptions, option);
                break;
            case 'Asset':
                await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceIdMatches(".*ppm_create_asset_dropdown_list_item.*"))');
                await commonPage.selectRandomOption(await this.ppmAssetDropdownOptions);
                break;
            default:
                throw new Error(`Unsupported dropdown name: ${dropdownName}`);
        }

    }

}

module.exports = new PPMCreatePage();
