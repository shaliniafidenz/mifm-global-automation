const cwoLandingPage = require('../pages/cwo/cwoLanding.page');
const cwoCreatePage = require('../pages/cwo/cwoCreate.page');
const cwoDetailsPage = require('../pages/cwo/cwoDetail.page');
const headerPage = require('../pages/header.page');
const footerPage = require('../pages/footer.page');
const commonPage = require('../pages/common.page');
const action = require('../utils/action.utils');
const waitUtils = require('../utils/wait.utils');

class CWOFlow{

    async navigateToCWOFromBottomNav(){
        await footerPage.tapCWOFooterIcon();
        return await cwoLandingPage.getCWOTitle();
    }

    async navigateToCWOFromRightMenuDrawer(){
        await headerPage.openMenuDrawer();
        await headerPage.selectOptionFromDrawer('CWO');

        return await cwoLandingPage.getCWOTitle();
    }

    async navigateToCWOFromBottomMenu(){

        await footerPage.tapFooterMenu();
        await footerPage.selectOptionFromFooterMenu('CWO');

        return await cwoLandingPage.getCWOTitle();
    }

    async createCWO(){
        //creating a new CWO with minimal details
        await cwoLandingPage.tapCreateCWO();

        await cwoCreatePage.tapBuildingDropdown();
        await commonPage.selectOptionByTextAndIndex(cwoCreatePage.cwoBuildingDropdownOptions, '10 MBC');

        await cwoCreatePage.tapLocationDropdown();
        await commonPage.selectOptionByTextAndIndex(cwoCreatePage.cwoLocationDropdownOptions, '10 MBC L5');

        await cwoCreatePage.tapProblemTypeDropdown();
        await commonPage.selectOptionByTextAndIndex(cwoCreatePage.cwoProblemTypeDropdownOptions, 'Aircon is not cold');

        await cwoCreatePage.tapSubmitButton();
        await commonPage.waitForLoaderToDisappear();

        const cwoNumber = await cwoDetailsPage.getCWONumberFromHeader();
        const status = await cwoDetailsPage.getCWOStatusFromHeader();

        return { cwoNumber, status };
        
    }

    async createCWOWithImageUpload(){
        //creating a new CWO with image upload
        await cwoLandingPage.tapCreateCWO();

        await cwoCreatePage.tapBuildingDropdown();
        await commonPage.selectOptionByTextAndIndex(cwoCreatePage.cwoBuildingDropdownOptions, '10 MBC');

        await cwoCreatePage.tapLocationDropdown();
        await commonPage.selectOptionByTextAndIndex(cwoCreatePage.cwoLocationDropdownOptions, '10 MBC L5');

        await cwoCreatePage.tapProblemTypeDropdown();
        await commonPage.selectOptionByTextAndIndex(cwoCreatePage.cwoProblemTypeDropdownOptions, 'Aircon is not cold');

        await cwoCreatePage.tapAddPhotoTile();
        await cwoCreatePage.tapUploadFromGalleryOption();
        await cwoCreatePage.selectFirstImageFromGallery();

        await browser.pause(2000);
        await cwoCreatePage.confirmPreview();

        await browser.pause(2000);

        const imageName = (await action.getContentDescription(cwoCreatePage.uploadedImageThumbBox)).split('\n')[2];
        
        await cwoCreatePage.tapSubmitButton();
        await commonPage.waitForLoaderToDisappear();

        await browser.pause(5000); // this is the replacement to validate success banner of image upload

        const cwoNumber = await cwoDetailsPage.getCWONumberFromHeader();
        const status = await cwoDetailsPage.getCWOStatusFromHeader();

        return { cwoNumber, status, imageName };
        
    }

    async getImageNameFromAttachmentsTab(){

        await cwoDetailsPage.tapAttachmentsTab();

        try{
            await action.click(cwoDetailsPage.cwoAttachmentBox);
            const imageBox = await action.getContentDescription(cwoDetailsPage.cwoImageNameFromImageHeader);
            const imageName = await imageBox.split('\n')[1];
            console.log('Image name ' + imageName);

            return imageName;
        }
        catch(error){
            throw new Error('No Images display in the attachment tab ' + error);
        }
        
    }

    async returnErrorMessageForCreatingCWOWithEmptyFields(){
        await cwoLandingPage.tapCreateCWO();
        
        //clear the default selections for the Work Order Type which is a requried field
        await cwoCreatePage.tapWorkOrderTypeDropdown();
        await cwoCreatePage.tapWorkOrderTypeClearButton();

        await cwoCreatePage.tapSubmitButton();

        //Validate availability of error messages for required fields
        const buildingRequiredMessageVisible = await action.isDisplayed(cwoCreatePage.cwoBuildingRequiredErrorMessage);
        const locationRequiredMessageVisible = await action.isDisplayed(cwoCreatePage.cwoLocationRequiredErrorMessage);
        const problemTypeRequiredMessageVisible = await action.isDisplayed(cwoCreatePage.cwoProblemTypeRequiredErrorMessage);
        const workOrderTypeRequiredMessageVisible = await action.isDisplayed(cwoCreatePage.cwoWorkOrderTypeRequiredErrorMessage);
        const serviceCategoryRequiredMessageVisible = await action.isDisplayed(cwoCreatePage.cwoServiceCategoryRequiredErrorMessage);
        const priorityLevelRequiredMessageVisible = await action.isDisplayed(cwoCreatePage.cwoPriorityLevelRequiredErrorMessage);

        return {
            buildingRequired: buildingRequiredMessageVisible,
            locationRequired: locationRequiredMessageVisible,
            problemTypeRequired: problemTypeRequiredMessageVisible,
            workOrderTypeRequired: workOrderTypeRequiredMessageVisible,
            serviceCategoryRequired: serviceCategoryRequiredMessageVisible,
            priorityLevelRequired: priorityLevelRequiredMessageVisible
        };

    }

    async resetCWO(){
        
        await cwoLandingPage.tapCreateCWO();

        //select values for all input fields
        await cwoCreatePage.tapRequesterDropdown();
        await commonPage.selectRandomOption(cwoCreatePage.cwoRequesterDropdownOptions);

        await cwoCreatePage.tapBuildingDropdown();
        await commonPage.selectOptionByTextAndIndex(cwoCreatePage.cwoBuildingDropdownOptions, 'CW');

        await cwoCreatePage.tapLocationDropdown();
        await commonPage.selectOptionByTextAndIndex(cwoCreatePage.cwoLocationDropdownOptions, 'CW');

        await cwoCreatePage.tapProblemTypeDropdown();
        await commonPage.selectOptionByTextAndIndex(cwoCreatePage.cwoProblemTypeDropdownOptions, 'Audio Visual');
        
        await cwoCreatePage.tapAssetDropdown();
        await commonPage.selectRandomOption(cwoCreatePage.cwoAssetDropdownOptions);

        await cwoCreatePage.tapDescriptionField();
        await cwoCreatePage.enterDescription('This is a description for resetting CWO creation');
        await driver.hideKeyboard();

        await cwoCreatePage.tapResetCWOButton();

        //get the values of the fields after reset and return in an object
        const requesterValue = (await action.getText(cwoCreatePage.cwoRequesterDropdown)).split('\n')[2]; // get only visible text
        const buildingValue = (await action.getText(cwoCreatePage.cwoBuildingDropdown)).split('\n')[2];
        const locationValue = (await action.getText(cwoCreatePage.cwoLocationDropdown)).split('\n')[2];
        const workOrderTypeValue = (await action.getText(cwoCreatePage.cwoWorkOrderTypeDropdown)).split('\n')[2];
        const problemTypeValue = (await action.getText(cwoCreatePage.cwoProblemTypeDropdown)).split('\n')[2];
        const serviceCategoryValue = (await action.getText(cwoCreatePage.cwoServiceCategoryDropdown)).split('\n')[2];
        const priorityLevelValue = (await action.getText(cwoCreatePage.cwoPriorityLevelDropdown)).split('\n')[2];
        const assetValue = (await action.getText(cwoCreatePage.cwoAssetDropdown)).split('\n')[2];
        const descriptionValue = await action.getText(cwoCreatePage.cwoDescription);

        return {
            requester: requesterValue.trim(), //removing any extra spaces or newline characters
            building: buildingValue.trim(),
            location: locationValue.trim(),
            workOrderType: workOrderTypeValue.trim(),
            problemType: problemTypeValue.trim(),
            serviceCategory: serviceCategoryValue.trim(),
            priorityLevel: priorityLevelValue.trim(),
            asset: assetValue.trim(),
            description: descriptionValue.trim()
        };
        
    }

    async isNoResultsFoundMessageVisible(){
        return await cwoLandingPage.isNoResultsFoundMessageVisible();
    }

    async getAllCWOs(){
        await cwoLandingPage.tapFilterButton();
        await cwoLandingPage.tapAssignedToToggle('All');
        await cwoLandingPage.tapApplyFilterButton();
        await browser.pause(3000); // Pause to allow the list to refresh with all CWOs
    }

    async isNewCardVisibleInCWOList(){
        return await cwoLandingPage.isCWOStatusCardVisible('New');
    }

    async isAssignmentCardVisibleInCWOList(){
        return await cwoLandingPage.isCWOStatusCardVisible('Assignment');
    }

    async isAcknowledgementCardVisibleInCWOList(){
        return await cwoLandingPage.isCWOStatusCardVisible('Acknowledgement');
    }

    async isInProgressCardVisibleInCWOList(){
        return await cwoLandingPage.isCWOStatusCardVisible('In-Progress');
    }

    async isCompletedCardVisibleInCWOList(){
        return await cwoLandingPage.isCWOStatusCardVisible('Completed');
    }

    async getWokOrderDataForGivenStatus(status){
        // Implementation for checking if the list is visible for a specific status, WO count, and returning the data in an object
        
        let element, isCardVisible, totalNoOfWorkOrders, isListVisible; 

        switch (status) {
            case 'New':
                element = await cwoLandingPage.newCard;
                isCardVisible = await action.isDisplayed(element);
                await element.click();
                totalNoOfWorkOrders = await cwoLandingPage.getTotalWOCountByStatus(element);
                await browser.pause(2000);
                isListVisible = await cwoLandingPage.isCWOListVisible(cwoLandingPage.newWOFirstListItem);
                break;

            case 'Assignment':
                element = await cwoLandingPage.assignmentCard;
                isCardVisible = await action.isDisplayed(element);
                await element.click();
                totalNoOfWorkOrders = await cwoLandingPage.getTotalWOCountByStatus(element);
                await browser.pause(2000);
                isListVisible = await cwoLandingPage.isCWOListVisible(cwoLandingPage.assignmentWOFirstListItem);
                break;

            case 'Acknowledgement':
                element = await cwoLandingPage.acknowledgementCard;
                isCardVisible = await action.isDisplayed(element);
                await element.click();
                totalNoOfWorkOrders = await cwoLandingPage.getTotalWOCountByStatus(element);
                await browser.pause(2000);
                isListVisible = await cwoLandingPage.isCWOListVisible(cwoLandingPage.acknowledgementWOFirstListItem);
                break;

            case 'In-Progress':
                element = await cwoLandingPage.inProgressCard;
                isCardVisible = await action.isDisplayed(element);
                await element.click();
                totalNoOfWorkOrders = await cwoLandingPage.getTotalWOCountByStatus(element);
                await browser.pause(2000);
                isListVisible = await cwoLandingPage.isCWOListVisible(cwoLandingPage.inProgressWOFirstListItem);
                break;

            case 'Completed':
                element = await cwoLandingPage.completedCard;
                isCardVisible = await action.isDisplayed(element);
                await element.click();
                totalNoOfWorkOrders = await cwoLandingPage.getTotalWOCountByStatus(element);
                await browser.pause(2000);
                isListVisible = await cwoLandingPage.isCWOListVisible(cwoLandingPage.completedWOFirstListItem);
                break;

            default:
                throw new Error(`Unsupported CWO status: ${status}`);
        }

        return { isCardVisible, totalNoOfWorkOrders, isListVisible };
    }

    async tapWorkOrderFromTheListByStatus(status){
        // Implementation for tapping any visible work order card for a given status
        let cardElement;
        let listItemsElements;

        switch (status) {
            case 'New':
                cardElement = await cwoLandingPage.newCard;
                listItemsElements = cwoLandingPage.newWOListItems;
                break;
            case 'Assignment':
                cardElement = await cwoLandingPage.assignmentCard;
                listItemsElements = cwoLandingPage.assignmentWOListItems;
                break;
            case 'Acknowledgement':
                cardElement = await cwoLandingPage.acknowledgementCard;
                listItemsElements = cwoLandingPage.acknowledgementWOListItems;
                break;
            default:
                throw new Error(`Unsupported CWO status for tapping work order card: ${status}`);
        }

        await action.click(cardElement); // Click on the status card to view the list
        await browser.pause(2000);
        const totalNoOfWorkOrders = await cwoLandingPage.getTotalWOCountByStatus(cardElement);

        if(totalNoOfWorkOrders > 0){
            // Tap on a random work order from the list
           // await commonPage.selectRandomOption(listItemsElements);

            //select the first WO from the list
            const listItems = await $$(listItemsElements);
            await action.click(listItems[0]);
            await browser.pause(2000);
        }
        else{
            throw new Error(`No work orders available for status: ${status}`);
        }
    }

    async acknowledgeCWO(){
        await browser.pause(3000);

        const isSignatureCardVisible = await cwoDetailsPage.isSignatureCardVisible();
        if(isSignatureCardVisible){
            await cwoDetailsPage.tapSignatureCard();
            await browser.pause(1000);
            await cwoDetailsPage.drawSignatureLine();
            await cwoDetailsPage.tapSignatureDoneButton();
            await browser.pause(1000);
        }
        else{
            console.log('Signature card is not visible, proceeding without signing');
        }
        await cwoDetailsPage.tapAcknowledgeButton();

        const isProcessingBannerVisible = await cwoDetailsPage.waitForProcessingBanner();
        await browser.pause(5000);
        
        const isSuccessBannerVisible = await cwoDetailsPage.waitForSuccessBanner();
        await browser.pause(5000); // Pause to allow any potential UI updates after banners
        const status = await cwoDetailsPage.getCWOStatusFromHeader();

            return {
                isProcessingBannerVisible,
                isSuccessBannerVisible,
                status
            }
    }

    async createCWOAndMoveToInProgress(){
        const createdCWO = await this.createCWO();

        const supervisorAssignment = await this.assignSupervisorToNewCWO();

        const technicianAssignment = await this.assignTechnicianToAssignmentCWO();

        const acknowledgement = await this.acknowledgeCWO();

        return {
            createdCWO,
            supervisorAssignment,
            technicianAssignment,
            acknowledgement
        };
    }

    async assignSupervisorToNewCWO(){
        //Find the Supervisor element and apply filters to load supervisors in the dropdown, then select a random supervisor from the list and assign to the CWO
        await cwoDetailsPage.tapSelectAllFilter();
        await cwoDetailsPage.tapIgnoreSkillsFilter();
        await cwoDetailsPage.tapSupervisorDropdown();
        await browser.pause(7000);
        await commonPage.selectRandomOption(cwoDetailsPage.cwoSupervisorDropdownItems); 

        const supervisorName = (await action.getContentDescription(cwoDetailsPage.cwoSupervisorDropdown)).split('\n')[2];;
        console.log(`Selected Supervisor: ${supervisorName}`);
        await cwoDetailsPage.tapNewAssignButton();
    
        //Asserting the Please Wait banner and Success Message after assigning supervisor to the CWO
        //For Now I'm keeping a blind wait after tapping assign button to wait for the Please Wait banner to appear and disappear as I'm facing issues in locating the banner element. Will replace the blind wait with an explicit wait once the locator issue is resolved.
        await browser.pause(5000);
        
        const status = await cwoDetailsPage.getCWOStatusFromHeader();

        return {supervisorName, status};
    }

    async getNameByRoleFromCWOInfoTab(role){

        let username=null;
        let elementName;

        //Goto Info screen and validate supervisor name
        await cwoDetailsPage.tapInfoTab();
        await browser.pause(2000);

        switch(role){
            case 'Supervisor':
                elementName = cwoDetailsPage.cwoInfoSupervisorValue;
                break;
            case 'Technician':
                elementName = cwoDetailsPage.cwoInfoTechnicianValue;
                break;
            default:
                throw new Error(`Unsupported role for fetching name from CWO Info tab: ${role}`);
        }

       // console.log(`End of scrolling. Fetching name for role: ${role} using element: ${elementName}`);
       // await browser.pause(5000); // Pause to allow any potential UI updates after scrolling
       
        await cwoDetailsPage.scrollToBottomOfInfoTab(); 
        const element = await $(elementName);
       
        //username = (await action.getText(elementName)).split('\n')[1];
        await browser.pause(3000);
        username = (await action.getText(element)).split('\n')[1];
        console.log(`Fetched name for role: ${role} is: ${username}`);
        return username;

    }

    async assignTechnicianToAssignmentCWO(){

        //Find the Supervisor element and apply filters to load supervisors in the dropdown, then select a random supervisor from the list and assign to the CWO
        await cwoDetailsPage.tapSelectAllFilter();
        await cwoDetailsPage.tapIgnoreSkillsFilter();
        await cwoDetailsPage.tapIncludeAssignedFilter();
        await cwoDetailsPage.tapTechnicianDropdown();
        await browser.pause(7000);
        await commonPage.selectRandomOption(cwoDetailsPage.cwoTechnicianDropdownItems);

        const technicianName = (await action.getContentDescription(cwoDetailsPage.cwoTechnicianDropdown)).split('\n')[2];;
        console.log(`Selected Technician: ${technicianName}`);
        await cwoDetailsPage.tapAssignmentAssignButton();
    
        //Asserting the Please Wait banner and Success Message after assigning supervisor to the CWO
        //For Now I'm keeping a blind wait after tapping assign button to wait for the Please Wait banner to appear and disappear as I'm facing issues in locating the banner element. Will replace the blind wait with an explicit wait once the locator issue is resolved.
        await browser.pause(5000);
        
        const status = await cwoDetailsPage.getCWOStatusFromHeader();

        return {technicianName, status};
    }

    

    

}

module.exports = new CWOFlow();    
