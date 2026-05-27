const action = require('../../utils/action.utils');
const waitUtils = require('../../utils/wait.utils');
const commonPage = require('../common.page');

class CWODetailPage{

    //CWO Details elements
    get cwoNumber(){ return $('android=new UiSelector().resourceId("cwoItemDetailAppBar_cwoNumber_text")');}
    get cwoStatus(){ return $('android=new UiSelector().resourceId("cwoItemDetailAppBar_cwoStatus_text")');}

    get cwoSelectAllFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_show_all_button"))'); 
    }

    get cwoIgnoreSkillsFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_ignore_skills_button"))'); 
    }

    get cwoOnlineOnlyFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_online_only_button"))'); 
    }

    get cwoIncludeAssignedFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_include_assigned_button"))'); 
    }

    get cwoSupervisorDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_supervisor_dropdown"))'); 
    }

    get cwoSupervisorDropdownItems(){ return 'android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_supervisor_dropdown_list_item_.*"))'; 
    }

    get cwoTechnicianDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_technician_dropdown"))'); 
    }

    get cwoTechnicianDropdownItems(){ return 'android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_technician_dropdown_list_item_.*"))'; 
    }

    get cwoNewAssignButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_assign_button"))'); 
    }

    get cwoAssignmentAssignButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_assign_button"))'); 
    }

    get cwoInfoTab(){ return $('android=new UiSelector().resourceId("navigationItemInactive_Information_tab")');}

    get cwoAttachmentTab(){ return $('android=new UiSelector().resourceId("navigationItemInactive_Attachments_tab")');}

    get cwoSignatureCard(){ return $('android=new UiScrollable(new UiSelector().className("android.widget.ScrollView"))' +
        '.scrollIntoView(new UiSelector().resourceId("displaySignatureBox_tap_gesture_05"))'); 
    }

    get cwoAcknowledgeButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_acknowledge_button"))');
    }

    get cwoAcknowledgeButtonByText(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_acknowledge_button"))');
    }

    // Reject button — visible on Assignment-status CWOs; requires scrolling to reach
    get cwoRejectButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_reject_button"))');
    }

    // App-bar Back button on the CWO detail screen (android.widget.Button, content-desc="Back").
    // More specific than commonPage.backButton (~Back) which can match other views.
    get detailBackButton(){
        return $('android=new UiSelector().className("android.widget.Button").description("Back")');
    }

    get signatureDoneButton(){ return $('android=new UiSelector().resourceId("cwo_acknowledgement_signatureDialog_done_button").text("DONE")');}

    get signatureDoneButtonByText(){ return $('android=new UiSelector().resourceId("cwo_acknowledgement_signatureDialog_done_button").descriptionContains("DONE")');}

    get processingBannerTitle(){ return $('android=new UiSelector().resourceId("flashBanner_processing_view_title")');}

    get successBannerTitle(){ return $('android=new UiSelector().resourceId("flashBanner_success_view_title")');}


    // Plain selectors — used AFTER scrollToBottomOfInfoTab() has already
    // scrolled the inner android.widget.ScrollView to the bottom.
    // Keeping scroll and lookup separate avoids the two-UiScrollable conflict
    // that caused the "only scrolls halfway" failure.
    get cwoInfoSupervisorValue(){
        return 'android=new UiSelector().resourceId("cwoAdditionalInformationTab_supervisor_value")';
    }

    get cwoInfoTechnicianValue(){
        return 'android=new UiSelector().resourceId("cwoAdditionalInformationTab_technician_value")';
    }

    get cwoAttachmentBox(){
        return $('android=new UiSelector().resourceId("attachmentItem_tap_inkwell_09")');
    }

    get cwoImageNameFromImageHeader(){
        return $('android=new UiSelector().resourceId("generalAppBar_view_text_01")');
    }

    async getCWONumberFromHeader(){
       // await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_create_building_dropdown_list_item.*"))');
        return await action.getContentDescription(this.cwoNumber);
    }

    async getCWOStatusFromHeader(){
        return (await action.getContentDescription(this.cwoStatus)).split('\n')[1]; // get only the status
    }

    async tapSelectAllFilter(){
        await action.click(this.cwoSelectAllFilter);
    }

    async tapIgnoreSkillsFilter(){
        await action.click(this.cwoIgnoreSkillsFilter);
    }

    async tapIncludeAssignedFilter(){
        await action.click(this.cwoIncludeAssignedFilter);
    }

    async tapSupervisorDropdown(){
        await action.click(this.cwoSupervisorDropdown);
    }

    async tapTechnicianDropdown(){
        await action.click(this.cwoTechnicianDropdown);
    }

    async tapNewAssignButton(){
        await action.click(this.cwoNewAssignButton);
    }

    async tapAssignmentAssignButton(){
        await action.click(this.cwoAssignmentAssignButton);
    }

    async tapInfoTab(){
        await action.click(this.cwoInfoTab);    
    }

    async tapAttachmentsTab(){
        await action.click(this.cwoAttachmentTab);
    }

    async isSignatureCardVisible(){
        console.log('Checking if signature card is visible...');
        return await action.isDisplayedSafe(this.cwoSignatureCard);
    }

    async tapSignatureCard(){
        await action.click(this.cwoSignatureCard);
    }

    async drawSignatureLine(){
        const size = await driver.getWindowSize();
        const y = Math.floor(size.height * 0.55);
        const startX = Math.floor(size.width * 0.25);
        const endX = Math.floor(size.width * 0.75);

        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: startX, y },
                { type: 'pointerDown', button: 0 },
                { type: 'pointerMove', duration: 600, x: endX, y },
                { type: 'pointerUp', button: 0 }
            ]
        }]);
        await driver.releaseActions();
    }

    async tapSignatureDoneButton(){
        if(await action.isDisplayedSafe(this.signatureDoneButton)){
            await action.click(this.signatureDoneButton);
            return;
        }

        await action.click(this.signatureDoneButtonByText);
    }

    async tapAcknowledgeButton(){
        if(await action.isDisplayedSafe(this.cwoAcknowledgeButton)){
            await action.click(this.cwoAcknowledgeButton);
            return;
        }

        await action.click(this.cwoAcknowledgeButtonByText);
    }

    async tapRejectButton(){
        await action.click(this.cwoRejectButton);
    }

    async tapDetailBackButton(){
        await action.click(this.detailBackButton);
    }

    // Returns true when the status chip in the app bar shows "NEW".
    // Used to detect the auto-navigation the app performs after a rejection.
    async isNewStatusVisible(){
        try{
            const desc = await action.getContentDescription(this.cwoStatus);
            return desc.includes('NEW');
        }
        catch(e){
            return false;
        }
    }

    async waitForProcessingBanner(timeout = 3000){
        try{
            await this.processingBannerTitle.waitForDisplayed({
                timeout,
                timeoutMsg: 'Processing banner did not display'
            });
            return await this.processingBannerTitle.isDisplayed();
        }
        catch(error){
            console.error('Error waiting for processing banner:', error);
            return false;
        }     
    }

    async waitForSuccessBanner(timeout = 15000){
        try{
            await this.successBannerTitle.waitForDisplayed({
            timeout,
            timeoutMsg: 'Success banner did not display'
            });
            return await this.successBannerTitle.isDisplayed();
        }
        catch(error){
            console.error('Error waiting for success banner:', error);
            return false;
        }
    }

    async scrollToBottomOfInfoTab() {
        // Two scroll passes are required: the first pass scrolls through the
        // main content; the second ensures the supervisor / technician row
        // (which may be dynamically rendered after the first scroll settles)
        // is fully in view.
        const scrollCmd =
            'android=new UiScrollable(new UiSelector().className("android.widget.ScrollView"))' +
            '.scrollToEnd(20)';

        try {
            await $(scrollCmd);           // first pass
            await browser.pause(800);
            await $(scrollCmd);           // second pass — brings the supervisor row into view
            await browser.pause(1000);
        } catch (e) {
            console.warn('Info tab scroll-to-end failed, continuing...', e.message);
        }
    }
}

module.exports = new CWODetailPage();
