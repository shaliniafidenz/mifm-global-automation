const action = require('../../utils/action.utils');
const commonPage = require('../common.page');

class CWOCreatePage{

    //CWO Create form elements
    get cwoRequesterDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_requester_dropdown"))'); 
    }
    get cwoRequesterDropdownOptions(){ 
        return 'android=new UiSelector().resourceIdMatches(".*cwo_create_requester_dropdown_list_item.*")';
    }
    
    get cwoBuildingDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_building_dropdown"))'); 
    }
    get cwoBuildingDropdownOptions(){ 
        return 'android=new UiSelector().resourceIdMatches(".*cwo_create_building_dropdown_list_item.*")';
    }
    
    get cwoLocationDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_location_dropdown"))'); 
    }
    get cwoLocationDropdownOptions(){ 
        return 'android=new UiSelector().resourceIdMatches(".*cwo_create_location_dropdown_list_item.*")';
    }

    get cwoWorkOrderTypeDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_workOrderType_dropdown"))'); 
    }
    get cwoWorkOrderTypeClearButton(){ return $('android=new UiSelector().resourceId("cwo_create_workOrderType_clear_button")');}

    get cwoProblemTypeDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_problemType_dropdown"))'); 
    }
    get cwoProblemTypeDropdownOptions(){ 
        return 'android=new UiSelector().resourceIdMatches("cwo_create_problemType_dropdown_list_item.*")';
    }

    get cwoServiceCategoryDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_serviceCategory_dropdown"))'); 
    }
    get cwoServiceCategoryDropdownOptions(){ 
        return 'android=new UiSelector().resourceIdMatches(".*cwo_create_serviceCategory_dropdown_list_item.*")';
    }

    get cwoPriorityLevelDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_priorityLevel_dropdown"))'); 
    }
    get cwoPriorityLevelDropdownOptions(){ 
        return 'android=new UiSelector().resourceIdMatches(".*cwo_create_priorityLevel_dropdown_list_item.*")';
    }

    get cwoAssetDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_asset_dropdown"))'); 
    }
    get cwoAssetDropdownOptions(){ 
        return 'android=new UiSelector().resourceIdMatches(".*cwo_create_asset_dropdown_list_item.*")';
    }

    get cwoDescription(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_description_txt"))'); 
    }

    get cwoSubmitButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_submit_button"))'); 
    }

    get cwoResetButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_reset_button"))'); 
    }

    get cwoBuildingRequiredErrorMessage(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_building_required_error"))'); 
    }

    get cwoLocationRequiredErrorMessage(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_location_required_error"))'); 
    }

    get cwoWorkOrderTypeRequiredErrorMessage(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_workOrderType_required_error"))'); 
    }

    get cwoProblemTypeRequiredErrorMessage(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_problemType_required_error"))'); 
    }

    get cwoServiceCategoryRequiredErrorMessage(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_serviceCategory_required_error"))'); 
    }

    get cwoPriorityLevelRequiredErrorMessage(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_priorityLevel_required_error"))'); 
    }

    async tapRequesterDropdown(){
        await action.click(this.cwoRequesterDropdown);
    }

    async tapBuildingDropdown(){
        await action.click(this.cwoBuildingDropdown);
    }

    async tapLocationDropdown(){
        await action.click(this.cwoLocationDropdown);
    }

    async tapWorkOrderTypeDropdown(){
        await action.click(this.cwoWorkOrderTypeDropdown);
    }

    async tapWorkOrderTypeClearButton(){
        await action.click(this.cwoWorkOrderTypeClearButton);
    }

    async tapProblemTypeDropdown(){
        await action.click(this.cwoProblemTypeDropdown);
    }

    async tapAssetDropdown(){
        await action.click(this.cwoAssetDropdown);
    }

    async tapDescriptionField(){
        await action.click(this.cwoDescription);
    }

    async enterDescription(description){
        await action.type(this.cwoDescription, description);
    }

    async tapSubmitButton(){
        await action.click(this.cwoSubmitButton);
    }

    async tapResetCWOButton(){
        await action.click(this.cwoResetButton);
    }

    
    async selectOptionByTextAndIndex(dropdownName,option){

        console.log(`Selecting option "${option}" from dropdown "${dropdownName}"`);

        switch(dropdownName){
            case 'Requester':
                await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_create_requester_dropdown_list_item.*"))');
                await commonPage.selectRandomOption(await this.cwoRequesterDropdownOptions);
                break;
            case 'Building':      
                await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_create_building_dropdown_list_item.*"))');
                await commonPage.selectOptionByTextAndIndex(await this.cwoBuildingDropdownOptions, option);
                break;
            case 'Location':
                await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_create_location_dropdown_list_item.*"))');
                await commonPage.selectOptionByTextAndIndex(await this.cwoLocationDropdownOptions, option);
                break;
            case 'ProblemType':
                await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_create_problmeType_dropdownItems.*"))');
                await commonPage.selectOptionByTextAndIndex(await this.cwoProblemTypeDropdownOptions, option);
                break;
            case 'Asset':
                await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_create_asset_dropdown_list_item.*"))');
                await commonPage.selectRandomOption(await this.cwoAssetDropdownOptions);
                break;
            default:
                throw new Error(`Unsupported dropdown name: ${dropdownName}`);
        }

    }

}

module.exports = new CWOCreatePage();