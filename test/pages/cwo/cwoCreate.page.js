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

    get cwoAddPhotoTile() { return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_create_addPhoto_upload"))'); 
    }

    get uploadFromGalleryOption(){
        return $('android=new UiSelector().resourceId("createCwo_tap_listTile_27")');
    }

    get uploadedImageThumbBox(){
         return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("attachmentItem_tap_inkwell_09"))');
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

     get galleryImages() {
        // Android 13+ photo picker
        return $$('//*[@resource-id="com.google.android.providers.media.module:id/icon_thumbnail"]');
    }

    get galleryImagesLegacy() {
        // Older Android / Google Photos
        return $$('android=new UiSelector().resourceId("com.google.android.documentsui:id/icon_thumb")');
    }

    // Preview popup (your app's custom preview)
    get attachmentPreviewOkButton() {
        return $('android=new UiSelector().resourceId("attachmentPostPopup_view_text_02")');
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

    async tapAddPhotoTile(){
        await action.click(this.cwoAddPhotoTile);
    }

    async tapUploadFromGalleryOption(){
        await action.click(this.uploadFromGalleryOption);
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

    async selectFirstImageFromGallery() {
        // Wait for gallery to load
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
        await this.attachmentPreviewOkButton.waitForDisplayed({ 
            reverse: true, 
            timeout: 5000 
        });
    }

}

module.exports = new CWOCreatePage();