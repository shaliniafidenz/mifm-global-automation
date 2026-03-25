const action = require('../utils/action.utils');
const commonPage = require('./common.page');

class CWOPage{

    get cwoTitle(){ return $('android=new UiSelector().resourceId("cwo_title_label")');}
    get cwoCreateButton(){ return $('android=new UiSelector().resourceId("cwo_createCwo_button")');}
    get cwoRequesterDropdown(){ return $('android=new UiSelector().resourceId("cwo_create_requester_dropdown")');}
    
    get cwoBuildingDropdown(){ return $('android=new UiSelector().resourceId("cwo_create_building_dropdown")');}
    get cwoBuildingDropdownOptions(){ 
        return $$('android=new UiSelector().resourceIdMatches(".*cwo_create_building_dropdown_list_item.*")');
    }
    
    get cwoLocationDropdown(){ return $('android=new UiSelector().resourceId("cwo_create_location_dropdown")');}
    get cwoLocationDropdownOptions(){ 
        return $$('android=new UiSelector().resourceIdMatches(".*cwo_create_location_dropdown_list_item.*")');
    }

    get cwoProblemTypeDropdown(){ return $('android=new UiSelector().resourceId("cwo_create_problemType_dropdown")');}
    get cwoProblemTypeDropdownOptions(){ 
        return $$('android=new UiSelector().resourceIdMatches("cwo_create_problmeType_dropdownItems.*")');
    }

    //get cwoSubmitButton(){ return $('android=new UiSelector().resourceId("cwo_create_submit_button")');}

    get cwoSubmitButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_submit_button"))'); 
    }

    get cwoDetailsHeader(){ return $('android=new UiSelector().resourceId("cwoItemDetailAppBar_view_text_02")');}

    async getCWOTitle(){
        return await action.getText(this.cwoTitle);
    }

    async tapCreateCWO(){
        await action.click(this.cwoCreateButton);
    }

    async isCWOCreateButtonVisible(){
        return await action.isDisplayed(this.cwoCreateButton);
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

    async tapProblemTypeDropdown(){
        await action.click(this.cwoProblemTypeDropdown);
    }

    async tapSubmitButton(){
        await action.click(this.cwoSubmitButton);
    }

    async getCWODetailsHeaderText(){
        await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_create_building_dropdown_list_item.*"))');
        return await commonPage.getWOHeaderText(this.cwoDetailsHeader);
    }
    
    async selectOptionByTextAndIndex(dropdownName,option){

        console.log(`Selecting option "${option}" from dropdown "${dropdownName}"`);

        switch(dropdownName){
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
            default:
                throw new Error(`Unsupported dropdown name: ${dropdownName}`);
        }

    }

}

module.exports = new CWOPage();