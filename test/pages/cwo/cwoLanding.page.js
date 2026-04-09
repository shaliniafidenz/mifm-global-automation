const action = require('../../utils/action.utils');
const commonPage = require('../common.page');

class CWOLandingPage{

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

    async getTotalWOCountByStatus(statusCard){
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
}

module.exports = new CWOLandingPage();