const action = require('../utils/action.utils');
const commonPage = require('./common.page');

class CWOPage{

    get cwoTitle(){ return $('android=new UiSelector().resourceId("cwo_title_label")');}
    get cwoFilterButton(){ return $('android=new UiSelector().resourceId("cwo_filter_button")');}
    get assignedToAllToggle(){ return $('android=new UiSelector().resourceId("cwo_filter_assignedTo_all_button")');}
    get applyFilterButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_filter_apply_button"))'); 
    }

    get noResultsFoundMessage(){ return $('android=new UiSelector().resourceId("cwo_noResults_label")');}

    get cardByStatus(){ return $(
            `android=new UiScrollable(new UiSelector().className("android.widget.HorizontalScrollView"))` +
            `.setAsHorizontalList()` +
            `.scrollIntoView(new UiSelector().resourceId("${resourceId}"))`
    );}

    get newCard(){ return $(
        'android=new UiScrollable(new UiSelector().className("android.widget.HorizontalScrollView"))' +
        '.setAsHorizontalList()' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_new_card"))'
    )}

    get assignmentCard(){ return $(
        'android=new UiScrollable(new UiSelector().className("android.widget.HorizontalScrollView"))' +
        '.setAsHorizontalList()' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_assignment_card"))'
    )}
    
    get acknowledgementCard(){ return $(
        'android=new UiScrollable(new UiSelector().className("android.widget.HorizontalScrollView"))' +
        '.setAsHorizontalList()' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_acknowledgement_card"))'
    )}
    
    get inProgressCard(){ return $(
        'android=new UiScrollable(new UiSelector().className("android.widget.HorizontalScrollView"))' +
        '.setAsHorizontalList()' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_inprogress_card"))'
    )}
    
    get completedCard(){ return $(
        'android=new UiScrollable(new UiSelector().className("android.widget.HorizontalScrollView"))' +
        '.setAsHorizontalList()' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_completed_card"))'
    )}

    //Fast — single lookup, used for list visibility check
    get newWOFirstListItem()             { return $('android=new UiSelector().resourceId("cwo_new_list_item_01")'); }
    get assignmentWOFirstListItem()      { return $('android=new UiSelector().resourceId("cwo_assignment_list_item_01")'); }
    get acknowledgementWOFirstListItem() { return $('android=new UiSelector().resourceId("cwo_acknowledgement_list_item_01")'); }
    get inProgressWOFirstListItem()      { return $('android=new UiSelector().resourceId("cwo_inprogress_list_item_01")'); }
    get completedWOFirstListItem()       { return $('android=new UiSelector().resourceId("cwo_completed_list_item_01")'); }

    //Full list — reserved for future test cases that need all items
    get newWOListItems(){ return 'android=new UiSelector().resourceIdMatches(".*cwo_new_list_item_.*")';}
    get assignmentWOListItems(){ return 'android=new UiSelector().resourceIdMatches(".*cwo_assignment_list_item_.*")';}
    get acknowledgementWOListItems(){ return 'android=new UiSelector().resourceIdMatches(".*cwo_acknowledgement_list_item_.*")';}
    get inProgressWOListItems(){ return 'android=new UiSelector().resourceIdMatches(".*cwo_inprogress_list_item_.*")';}
    get completedWOListItems(){ return 'android=new UiSelector().resourceIdMatches(".*cwo_completed_list_item_.*")';}

    get horizontalScrollContainer() {return $('//android.widget.HorizontalScrollView');}
  
    get cwoCreateButton(){ return $('android=new UiSelector().resourceId("cwo_createCwo_button")');}


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

    //CWO Details elements
    get cwoDetailsHeader(){ return $('android=new UiSelector().resourceId("cwoItemDetailAppBar_view_text_02")');}

    get cwoSupervisorSelectAllFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skillSelector_button_01"))'); 
    }

    get cwoSupervisorIgnoreSkillsFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skillSelector_button_02"))'); 
    }

    get cwoSupervisorDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_checklist_new_supervisor_dropdown"))'); 
    }

    get cwoSupervisorDropdownItems(){ return 'android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_checklist_new_supervisor_dropdown_list_item_.*"))'; 
    }

    get cwoAssignButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_checklist_new_assign_button"))'); 
    }

    get cwoInfoTab(){ return $('android=new UiSelector().resourceId("navigationItemInactive_Information_tab")');}

    get cwoInfoSupervisorValue(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwoAdditionalInformationTab_supervisor_value"))'); 
    }

    

    async getCWOTitle(){
        return await action.getTextMultiPart(this.cwoTitle);
    }

    async tapCreateCWO(){
        await action.click(this.cwoCreateButton);
    }


    async isCWOStatusCardVisible(status){
        switch(status){
            case 'New': 
                return await action.isDisplayed(this.newCard);
            case 'Assignment':
                return await action.isDisplayed(this.assignmentCard);
            case 'Acknowledgement':
                return await action.isDisplayed(this.acknowledgementCard);
            case 'In-Progress':
                return await action.isDisplayed(this.inProgressCard);
            case 'Completed':
                return await action.isDisplayed(this.completedCard);
            default:
                throw new Error(`Unsupported CWO status: ${status}`);
        }
    }

    async isCWOCreateButtonVisible(){
        return await action.isDisplayed(this.cwoCreateButton);
    }

    async isNoResultsFoundMessageVisible(){
        return await action.isDisplayed(this.noResultsFoundMessage);
    }

    async getStatusCard(status) {
        const resourceIdMap = {
            'New': 'cwo_new_card',
            'Assignment': 'cwo_assignment_card',
            'Acknowledgement': 'cwo_acknowledgement_card',
            'In-Progress': 'cwo_inprogress_card',
            'Completed': 'cwo_completed_card'
        };

        const resourceId = resourceIdMap[status];
        if (!resourceId) throw new Error(`Unsupported CWO status: ${status}`);

        // Single UiScrollable call per status instead of multiple getter calls
        return $(
            `android=new UiScrollable(new UiSelector().className("android.widget.HorizontalScrollView"))` +
            `.setAsHorizontalList()` +
            `.scrollIntoView(new UiSelector().resourceId("${resourceId}"))`
        );
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

    async tapFilterButton(){
        await action.click(this.cwoFilterButton);
    }

    async tapAssignedToToggle(filterOption){
        if(filterOption === 'All'){
            await action.click(this.assignedToAllToggle);
        }
    }

    async tapApplyFilterButton(){
        await action.click(this.applyFilterButton); 
    }

    async tapNewCard(){
        await action.click(this.newCard);
        await browser.pause(3000); // Pause to allow UI to update after tapping the card
    }

    async tapAssignmentCard(){
        await action.click(this.assignmentCard);
        await browser.pause(3000);
    }

    async tapAcknowledgementCard(){
        await action.click(this.acknowledgementCard);
        await browser.pause(3000); 
    }

    async tapInProgressCard(){
        await action.click(this.inProgressCard);
        await browser.pause(3000);
    }

    async tapCompletedCard(){
        await action.click(this.completedCard);
        await browser.pause(3000);
    }

    async getTotalWOCount(statusCard){
        const contentText = await action.getContentDescription(statusCard);

        //const contentText = await statusCard.getText();
        
        //console.log('Content Text from the Card:', contentText);
        const totalCount = contentText.split('\n')[5]; // Assuming the count is in the 5th line

        //console.log(`Total count extracted for status card: ${totalCount}`);
        return parseInt(totalCount);
    }

    async getCWOListCountByStatus(items){
        const listItems = await items;
        //console.log(`Total list items found: ${listItems.length}`);
        return listItems.length;
    }

    async isCWOListVisible(firstListItem) {
        try {
            return await firstListItem.isExisting();
        } catch {
            return false;
        }
    }

    async getCWODetailsHeaderText(){
       // await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_create_building_dropdown_list_item.*"))');
        return await commonPage.getWOHeaderText(this.cwoDetailsHeader);
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

    async tapSupervisorSelectAllFilter(){
        await action.click(this.cwoSupervisorSelectAllFilter);
    }

    async tapSupervisorIgnoreSkillsFilter(){
        await action.click(this.cwoSupervisorIgnoreSkillsFilter);
    }

    async tapSupervisorDropdown(){
        await action.click(this.cwoSupervisorDropdown);
    }

    async tapAssignButton(){
        await action.click(this.cwoAssignButton);
    }

    async tapInfoTab(){
        await action.click(this.cwoInfoTab);    
    }
}

module.exports = new CWOPage();