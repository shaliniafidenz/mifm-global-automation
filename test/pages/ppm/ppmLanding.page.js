const action = require('../../utils/action.utils');
const commonPage = require('../common.page');

class PPMLandingPage{

    get ppmTitle(){ return $('android=new UiSelector().resourceId("ppm_title_label")');}
    get ppmFilterButton(){ return $('android=new UiSelector().resourceId("ppm_filter_button")');}
    get assignedToAllToggle(){ return $('android=new UiSelector().resourceId("ppm_filter_assignedTo_all_button")');}
    get applyFilterButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_filter_apply_button"))');
    }

    get noResultsFoundMessage(){ return $('android=new UiSelector().resourceId("ppm_noResults_label")');}

    get newCard(){ return $(
        'android=new UiScrollable(new UiSelector().className("android.widget.HorizontalScrollView"))' +
        '.setAsHorizontalList()' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_new_card"))'
    )}

    get assignmentCard(){ return $(
        'android=new UiScrollable(new UiSelector().className("android.widget.HorizontalScrollView"))' +
        '.setAsHorizontalList()' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_assignment_card"))'
    )}

    get acknowledgementCard(){ return $(
        'android=new UiScrollable(new UiSelector().className("android.widget.HorizontalScrollView"))' +
        '.setAsHorizontalList()' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_acknowledgement_card"))'
    )}

    get inProgressCard(){ return $(
        'android=new UiScrollable(new UiSelector().className("android.widget.HorizontalScrollView"))' +
        '.setAsHorizontalList()' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_inprogress_card"))'
    )}

    get completedCard(){ return $(
        'android=new UiScrollable(new UiSelector().className("android.widget.HorizontalScrollView"))' +
        '.setAsHorizontalList()' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_completed_card"))'
    )}

    //Fast — single lookup, used for list visibility check
    get newWOFirstListItem()    { return $('android=new UiSelector().resourceId("ppm_new_list_item_01")'); }
    get assignmentWOFirstListItem() { return $('android=new UiSelector().resourceId("ppm_assignment_list_item_01")'); }
    get acknowledgementWOFirstListItem() { return $('android=new UiSelector().resourceId("ppm_acknowledgement_list_item_01")'); }
    get inProgressWOFirstListItem() { return $('android=new UiSelector().resourceId("ppm_inprogress_list_item_01")'); }
    get completedWOFirstListItem()  { return $('android=new UiSelector().resourceId("ppm_completed_list_item_01")'); }
    
    //Full list — reserved for future test cases that need all items
    get newWOListItems(){    return 'android=new UiSelector().resourceIdMatches(".*ppm_new_list_item_.*")';}
    get assignmentWOListItems(){ return 'android=new UiSelector().resourceIdMatches(".*ppm_assignment_list_item_.*")';}
    get acknowledgementWOListItems(){ return 'android=new UiSelector().resourceIdMatches(".*ppm_acknowledgement_list_item_.*")';}
    get inProgressWOListItems(){ return 'android=new UiSelector().resourceIdMatches(".*ppm_inprogress_list_item_.*")';}
    get completedWOListItems(){  return 'android=new UiSelector().resourceIdMatches(".*ppm_completed_list_item_.*")';}
   
    get horizontalScrollContainer() {return $('//android.widget.HorizontalScrollView');}

    get ppmCreateButton(){ return $('android=new UiSelector().resourceId("ppm_createPpm_button")');}


    async getPPMTitle(){
        return await action.getTextMultiPart(this.ppmTitle);
    }

    async tapCreatePPM(){
        await action.click(this.ppmCreateButton);
    }


    async isPPMStatusCardVisible(status){
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
                throw new Error(`Unsupported PPM status: ${status}`);
        }
    }

    async isPPMCreateButtonVisible(){
        return await action.isDisplayed(this.ppmCreateButton);
    }

    async isNoResultsFoundMessageVisible(){
        return await action.isDisplayed(this.noResultsFoundMessage);
    }

    async getStatusCard(status) {
        const resourceIdMap = {
            'New':     'ppm_new_card',
            'Assignment': 'ppm_assignment_card',
            'Acknowledgement': 'ppm_acknowledgement_card',
            'In-Progress': 'ppm_inprogress_card',
            'Completed':   'ppm_completed_card'
        };

        const resourceId = resourceIdMap[status];
        if (!resourceId) throw new Error(`Unsupported PPM status: ${status}`);

        return $(
            `android=new UiScrollable(new UiSelector().className("android.widget.HorizontalScrollView"))` +
            `.setAsHorizontalList()` +
            `.scrollIntoView(new UiSelector().resourceId("${resourceId}"))`
        );
    }

    async tapFilterButton(){
        await action.click(this.ppmFilterButton);
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
        await browser.pause(3000);
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
        const totalCount = contentText.split('\n')[5]; // Assuming the count is in the 5th line
        return parseInt(totalCount);
    }

    async getPPMListCountByStatus(items){
        const listItems = await items;
        return listItems.length;
    }

    async isPPMListVisible(firstListItem) {
        try {
            return await firstListItem.isExisting();
        } catch {
            return false;
        }
    }
}

module.exports = new PPMLandingPage();
