const action = require('../../utils/action.utils');
const commonPage = require('../common.page');

class PPMDetailPage{

    //PPM Details elements
    get ppmNumber(){ return $('android=new UiSelector().resourceId("ppmwoItemDetailAppBar_ppmwoNumber_text")');}
    get ppmStatus(){ return $('android=new UiSelector().resourceId("ppmwoItemDetailAppBar_ppmwoStatus_text")');}

    get ppmSelectAllFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_show_all_button"))');
    }

    get ppmIgnoreSkillsFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_ignore_skills_button"))');
    }

    get ppmOnlineOnlyFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_online_only_button"))');
    }

    get ppmIncludeAssignedFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_include_assigned_button"))');
    }

    get ppmSupervisorDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_supervisor_dropdown"))');
    }

    get ppmSupervisorDropdownItems(){ return 'android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceIdMatches(".*ppm_supervisor_dropdown_list_item_.*"))';
    }

    get ppmTechnicianDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_technicians_dropdown"))');
    }

    get ppmTechnicianDropdownItems(){ return 'android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceIdMatches("ppm_dropdown_checkbox_item_.*"))';
    }

    get ppmTechnicianDropdownOkButton(){ return $('android=new UiSelector().resourceId("ppm_dropdown_technician_ok_button")');}

    get ppmAssignButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_assign_button"))');
    }

    get ppmInfoTab(){ return $('android=new UiSelector().resourceId("navigationItemInactive_Information_tab")');}

    get ppmInfoSupervisorValue(){ return 'android=new UiScrollable(new UiSelector().className("android.widget.ScrollView"))' +
        '.scrollIntoView(new UiSelector().resourceId("ppmAdditionalInformationTab_supervisor_value"))';
    }

    get ppmInfoTechnicianValue(){ return 'android=new UiScrollable(new UiSelector().className("android.widget.ScrollView"))' +
        '.scrollIntoView(new UiSelector().resourceId("ppmWoAdditionalInformationTab_participants_assignedTechnicians_value"))';
    }

    get ppmAttachmentTab(){ return $('android=new UiSelector().resourceId("navigationItemInactive_Attachments_tab")');}

    get ppmDetailsTab(){ return $('android=new UiSelector().resourceId("navigationItemInactive_Details_tab")');}

    get ppmRejectButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_reject_button"))');
    }

    get ppmRejectReasonInput(){
        return $('android=new UiSelector().resourceId("reasonToRejectDialog_input_textField_05")');
    }

    get ppmRejectReasonInputByClass(){
        return $('android=new UiSelector().className("android.widget.EditText")');
    }

    get ppmRejectDialogOkButton(){
        return $('android=new UiSelector().resourceId("confirmationActionButton_view_text_01").text("OK")');
    }

    get ppmRejectDialogOkButtonByText(){
        return $('//android.widget.Button[contains(@content-desc, "OK")]');
    }

    get ppmSignatureCard(){ return $('android=new UiScrollable(new UiSelector().className("android.widget.ScrollView"))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_signature_box"))');
    }

    get ppmAcknowledgeButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_acknowledge_button"))');
    }

    get ppmAcknowledgeButtonByText(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().descriptionContains("Acknowledge"))');
    }

    get signatureDoneButton(){ return $('android=new UiSelector().resourceId("ppm_acknowledgement_signatureDialog_done_button").text("DONE")');}

    get signatureDoneButtonByText(){ return $('android=new UiSelector().resourceId("ppm_acknowledgement_signatureDialog_done_button").descriptionContains("DONE")');}

    get processingBannerTitle(){ return $('android=new UiSelector().resourceId("flashBanner_processing_view_title")');}

    get successBannerTitle(){ return $('android=new UiSelector().resourceId("flashBanner_success_view_title")');}

    get ppmAddImageButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_attachment_addImage_button"))');}

    get ppmUploadFromGalleryOption(){
        return $('android=new UiSelector().resourceId("ppm_attachment_tap_listTile_gallery")');
    }

    get galleryImages() {
        return $$('//*[@resource-id="com.google.android.providers.media.module:id/icon_thumbnail"]');
    }

    get galleryImagesLegacy() {
        return $$('android=new UiSelector().resourceId("com.google.android.documentsui:id/icon_thumb")');
    }

    get attachmentPreviewOkButton() {
        return $('android=new UiSelector().resourceId("attachmentPostPopup_view_text_02")');
    }

    get ppmAttachmentBox(){
        return $('android=new UiSelector().resourceId("attachmentItem_tap_inkwell_09")');
    }

    get ppmImageNameFromImageHeader(){
        return $('android=new UiSelector().resourceId("generalAppBar_view_text_01")');
    }

    async getPPMNumberFromHeader(){
        return await action.getContentDescription(this.ppmNumber);
    }

    async getPPMStatusFromHeader(){
        return await action.getContentDescription(this.ppmStatus);
    }

    async tapSelectAllFilter(){
        await action.click(this.ppmSelectAllFilter);
    }

    async tapIgnoreSkillsFilter(){
        await action.click(this.ppmIgnoreSkillsFilter);
    }

    async tapIncludeAssignedFilter(){
        await action.click(this.ppmIncludeAssignedFilter);
    }

    async tapSupervisorDropdown(){
        await action.click(this.ppmSupervisorDropdown);
    }

    async tapTechnicianDropdown(){
        await action.click(this.ppmTechnicianDropdown);
    }

    async tapAssignButton(){
        await action.click(this.ppmAssignButton);
    }

    async tapInfoTab(){
        await action.click(this.ppmInfoTab);
    }

    async scrollToBottomOfInfoTab() {
        try {
            await $('android=new UiScrollable(new UiSelector().className("android.widget.ScrollView"))' +
                    '.scrollToEnd(10)' //  max 10 swipes
            );
            await browser.pause(500);
        } catch (e) {
            console.warn('Pre-scroll failed, continuing...', e.message);
        }
    }

    async tapTechnicianDropdownOkButton(){
        await action.click(this.ppmTechnicianDropdownOkButton);
    }

    async tapAttachmentsTab(){
        await action.click(this.ppmAttachmentTab);
    }

    async tapDetailsTab(){
        await action.click(this.ppmDetailsTab);
    }

    async tapRejectButton(){
        await action.click(this.ppmRejectButton);
    }

    async enterRejectReason(reasonText){
        try{
            const input = await this.ppmRejectReasonInput;
            await action.click(input);
            await action.type(input, reasonText);
        }
        catch(e){
            console.warn('Primary reject reason selector failed, trying class fallback:', e.message);
            await action.type(this.ppmRejectReasonInputByClass, reasonText);
        }
    }

    async tapRejectDialogOkButton(){
        try{
            await action.click(this.ppmRejectDialogOkButton);
        }
        catch(e){
            console.warn('Primary reject dialog OK selector failed, trying XPath fallback:', e.message);
            await action.click(this.ppmRejectDialogOkButtonByText);
        }
    }

    async isSignatureCardVisible(){
        return await action.isDisplayedSafe(this.ppmSignatureCard);
    }

    async tapSignatureCard(){
        await action.click(this.ppmSignatureCard);
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

            console.log('Tapped signature DONE button using primary selector');
            return;
        }

        await action.click(this.signatureDoneButtonByText);
    }

    async tapAcknowledgeButton(){
        if(await action.isDisplayedSafe(this.ppmAcknowledgeButton)){
            await action.click(this.ppmAcknowledgeButton);
            return;
        }

        await action.click(this.ppmAcknowledgeButtonByText);
    }

    async waitForProcessingBanner(timeout = 30000){
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

    async tapAddImageButton(){
        await action.click(this.ppmAddImageButton);
    }

    async tapUploadFromGalleryOption(){
        await action.click(this.ppmUploadFromGalleryOption);
    }

    async selectFirstImageFromGallery() {
        await browser.pause(2000);
        let images = await this.galleryImages;
        if (images.length === 0) {
            images = await this.galleryImagesLegacy;
        }
        if (images.length === 0) {
            throw new Error('No images found in gallery. Ensure test image was pushed to device.');
        }
        await images[0].click();
    }

    async confirmPreview() {
        await this.attachmentPreviewOkButton.waitForDisplayed({ timeout: 5000 });
        await this.attachmentPreviewOkButton.click();
        await this.attachmentPreviewOkButton.waitForDisplayed({ reverse: true, timeout: 5000 });
    }
}

module.exports = new PPMDetailPage();
