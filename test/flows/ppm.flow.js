const ppmLandingPage = require('../pages/ppm/ppmLanding.page');
const ppmCreatePage = require('../pages/ppm/ppmCreate.page');
const ppmDetailsPage = require('../pages/ppm/ppmDetail.page');
const headerPage = require('../pages/header.page');
const footerPage = require('../pages/footer.page');
const commonPage = require('../pages/common.page');
const action = require('../utils/action.utils');
const waitUtils = require('../utils/wait.utils');

class PPMFlow{

    async navigateToPPMFromBottomNav(){
        await footerPage.tapPPMFooterIcon();
        return await ppmLandingPage.getPPMTitle();
    }

    async navigateToPPMFromRightMenuDrawer(){
        await headerPage.openMenuDrawer();
        await headerPage.selectOptionFromDrawer('PPM');

        return await ppmLandingPage.getPPMTitle();
    }

    async navigateToPPMFromBottomMenu(){
        await footerPage.tapFooterMenu();
        await footerPage.selectOptionFromFooterMenu('PPM');

        return await ppmLandingPage.getPPMTitle();
    }

    async createPPM(){
        //creating a new PPM with minimal details
        await ppmLandingPage.tapCreatePPM();

        await ppmCreatePage.tapBuildingDropdown();
        await commonPage.selectOptionByTextAndIndex(ppmCreatePage.ppmBuildingDropdownOptions, '10 MBC');

        await ppmCreatePage.tapLocationDropdown();
        await commonPage.selectOptionByTextAndIndex(ppmCreatePage.ppmLocationDropdownOptions, '10 MBC');

        await ppmCreatePage.tapChecklistDropdown();
        await commonPage.selectRandomOption(ppmCreatePage.ppmChecklistDropdownOptions);

        await ppmCreatePage.tapSubmitButton();
        await commonPage.waitForLoaderToDisappear();

        const ppmNumber = await ppmDetailsPage.getPPMNumberFromHeader();
        const status = await ppmDetailsPage.getPPMStatusFromHeader();

        return { ppmNumber, status };
    }

    async returnErrorMessageForCreatingPPMWithEmptyFields(){
        await ppmLandingPage.tapCreatePPM();

        await ppmCreatePage.tapSubmitButton();

        //Validate availability of error messages for required fields
        const masterWorkOrderRequiredMessageVisible = await action.isDisplayed(ppmCreatePage.ppmMasterWORequiredErrorMessage);
        const checklistRequiredMessageVisible = await action.isDisplayed(ppmCreatePage.ppmChecklistRequiredErrorMessage);
        const frequencyRequiredMessageVisible = await action.isDisplayed(ppmCreatePage.ppmFrequencyRequiredErrorMessage);

        return {
            masterWORequired: masterWorkOrderRequiredMessageVisible,
            checklistRequired: checklistRequiredMessageVisible,
            frequencyRequired: frequencyRequiredMessageVisible
        };
    }

    async resetPPM(){

        await ppmLandingPage.tapCreatePPM();

        //select values for all input fields
        await ppmCreatePage.tapBuildingDropdown();
        await commonPage.selectOptionByTextAndIndex(ppmCreatePage.ppmBuildingDropdownOptions, '10 MBC');

        await ppmCreatePage.tapLocationDropdown();
        await commonPage.selectOptionByTextAndIndex(ppmCreatePage.ppmLocationDropdownOptions, '10 MBC');

        await ppmCreatePage.tapResetPPMButton();

        //get the values of the fields after reset and return in an object
        const buildingValue = (await action.getText(ppmCreatePage.ppmBuildingDropdown)).split('\n')[2];
        const locationValue = (await action.getText(ppmCreatePage.ppmLocationDropdown)).split('\n')[2];
        const masterWOValue = (await action.getText(ppmCreatePage.ppmMasterWODropdown)).split('\n')[2];
        const checklistValue = (await action.getText(ppmCreatePage.ppmChecklistDropdown)).split('\n')[2];
        const frequencyValue = (await action.getText(ppmCreatePage.ppmFrequencyDropdown)).split('\n')[2];

        return {
            building: buildingValue.trim(),
            location: locationValue.trim(),
            masterWOValue: masterWOValue.trim(),
            checklistValue: checklistValue.trim(),
            frequency: frequencyValue.trim()
        };
    }

    async isNoResultsFoundMessageVisible(){
        return await ppmLandingPage.isNoResultsFoundMessageVisible();
    }

    async getAllPPMs(){
        await ppmLandingPage.tapFilterButton();
        await ppmLandingPage.tapAssignedToToggle('All');
        await ppmLandingPage.tapApplyFilterButton();
        await browser.pause(3000); // Pause to allow the list to refresh with all PPMs
    }

    async isPendingCardVisibleInPPMList(){
        return await ppmLandingPage.isPPMStatusCardVisible('Pending');
    }

    async isInProgressCardVisibleInPPMList(){
        return await ppmLandingPage.isPPMStatusCardVisible('In-Progress');
    }

    async isCompletedCardVisibleInPPMList(){
        return await ppmLandingPage.isPPMStatusCardVisible('Completed');
    }

    async isOverdueCardVisibleInPPMList(){
        return await ppmLandingPage.isPPMStatusCardVisible('Overdue');
    }

    async getWorkOrderDataForGivenStatus(status){
        // Implementation for checking if the list is visible for a specific status, WO count, and returning the data in an object

        let element, isCardVisible, totalNoOfWorkOrders, isListVisible;

        switch (status) {
            case 'New':
                element = await ppmLandingPage.newCard;
                isCardVisible = await action.isDisplayed(element);
                await element.click();
                totalNoOfWorkOrders = await ppmLandingPage.getTotalWOCountByStatus(element);
                await browser.pause(2000);
                isListVisible = await ppmLandingPage.isPPMListVisible(ppmLandingPage.newWOFirstListItem);
                break;

            case 'Assignment':
                element = await ppmLandingPage.assignmentCard;
                isCardVisible = await action.isDisplayed(element);
                await element.click();
                totalNoOfWorkOrders = await ppmLandingPage.getTotalWOCountByStatus(element);
                await browser.pause(2000);
                isListVisible = await ppmLandingPage.isPPMListVisible(ppmLandingPage.assignmentWOFirstListItem);
                break;

            case 'Acknowledgement':
                element = await ppmLandingPage.acknowledgementCard;
                isCardVisible = await action.isDisplayed(element);
                await element.click();
                totalNoOfWorkOrders = await ppmLandingPage.getTotalWOCountByStatus(element);
                await browser.pause(2000);
                isListVisible = await ppmLandingPage.isPPMListVisible(ppmLandingPage.acknowledgementWOFirstListItem);
                break;

            case 'In-Progress':
                element = await ppmLandingPage.inProgressCard;
                isCardVisible = await action.isDisplayed(element);
                await element.click();
                totalNoOfWorkOrders = await ppmLandingPage.getTotalWOCountByStatus(element);
                await browser.pause(2000);
                isListVisible = await ppmLandingPage.isPPMListVisible(ppmLandingPage.inProgressWOFirstListItem);
                break;

            case 'Completed':
                element = await ppmLandingPage.completedCard;
                isCardVisible = await action.isDisplayed(element);
                await element.click();
                totalNoOfWorkOrders = await ppmLandingPage.getTotalWOCountByStatus(element);
                await browser.pause(2000);
                isListVisible = await ppmLandingPage.isPPMListVisible(ppmLandingPage.completedWOFirstListItem);
                break;

            default:
                throw new Error(`Unsupported PPM status: ${status}`);
        }

        return { isCardVisible, totalNoOfWorkOrders, isListVisible };
    }

    async tapWorkOrderFromTheListByStatus(status){
        // Implementation for tapping any visible work order card for a given status
        let cardElement;
        let listItemsElements;

        switch (status) {
            case 'New':
                cardElement = await ppmLandingPage.newCard;
                listItemsElements = ppmLandingPage.newWOListItems;
                break;
            case 'Assignment':
                cardElement = await ppmLandingPage.assignmentCard;
                listItemsElements = ppmLandingPage.assignmentWOListItems;
                break;
            case 'Acknowledgement':
                cardElement = await ppmLandingPage.acknowledgementCard;
                listItemsElements = ppmLandingPage.acknowledgementWOListItems;
                break;
            case 'In-Progress':
                cardElement = await ppmLandingPage.inProgressCard;
                listItemsElements = ppmLandingPage.inProgressWOListItems;
                break;
            default:
                throw new Error(`Unsupported PPM status for tapping work order card: ${status}`);
        }

        await action.click(cardElement); // Click on the status card to view the list
        await browser.pause(2000);
        const totalNoOfWorkOrders = await ppmLandingPage.getTotalWOCountByStatus(cardElement);

        if(totalNoOfWorkOrders > 0){
            //select the first WO from the list
            const listItems = await $$(listItemsElements);
            await action.click(listItems[0]);
            await browser.pause(2000);
        }
        else{
            throw new Error(`No work orders available for status: ${status}`);
        }
    }

    async assignSupervisorToPendingPPM(){
        //Find the Supervisor element and apply filters to load supervisors in the dropdown, then select a random supervisor from the list and assign to the PPM
        await ppmDetailsPage.tapIgnoreSkillsFilter();
        await ppmDetailsPage.tapSupervisorDropdown();
        await browser.pause(7000);
        await commonPage.selectRandomOption(ppmDetailsPage.ppmSupervisorDropdownItems);

        const supervisorName = (await action.getContentDescription(ppmDetailsPage.ppmSupervisorDropdown)).split('\n')[2];
        console.log(`Selected Supervisor: ${supervisorName}`);
        await ppmDetailsPage.tapAssignButton();

        //Asserting the Please Wait banner and Success Message after assigning supervisor to the PPM
        //For Now I'm keeping a blind wait after tapping assign button to wait for the Please Wait banner to appear and disappear as I'm facing issues in locating the banner element. Will replace the blind wait with an explicit wait once the locator issue is resolved.
        await browser.pause(5000);

        return supervisorName;
    }

    async acknowledgePPM(){
        await browser.pause(3000);

        // this is to swipe down to make the signature card visible as the acknowledge and signature buttons are located at the bottom of the PPM details screen and might not be visible without scrolling/swiping down
        const acknowledgeButton = await ppmDetailsPage.ppmAcknowledgeButton;

        const isSignatureCardVisible = await ppmDetailsPage.isSignatureCardVisible();
        if(isSignatureCardVisible){
            await ppmDetailsPage.tapSignatureCard();
            await browser.pause(1000);
            await ppmDetailsPage.drawSignatureLine();
            await ppmDetailsPage.tapSignatureDoneButton();
            await browser.pause(1000);
        }
        else{
            console.log('Signature card is not visible, proceeding without signing');
        }

        //await ppmDetailsPage.tapAcknowledgeButton();
        await acknowledgeButton.click();

        const isProcessingBannerVisible = await ppmDetailsPage.waitForProcessingBanner();
        await browser.pause(5000);

        const isSuccessBannerVisible = await ppmDetailsPage.waitForSuccessBanner();
        await browser.pause(5000);
        const status = await ppmDetailsPage.getPPMStatusFromHeader();

        return {
            isProcessingBannerVisible,
            isSuccessBannerVisible,
            status
        };
    }

    async getNameByRoleFromPPMInfoTab(role){

        let username = null;
        let elementName;

        //Goto Info screen and validate supervisor/technician name
        await ppmDetailsPage.tapInfoTab();
        await browser.pause(2000);

        switch(role){
            case 'Supervisor':
                elementName = ppmDetailsPage.ppmInfoSupervisorValue;
                break;
            case 'Technician':
                elementName = ppmDetailsPage.ppmInfoTechnicianValue;
                break;
            default:
                throw new Error(`Unsupported role for fetching name from PPM Info tab: ${role}`);
        }

        await ppmDetailsPage.scrollToBottomOfInfoTab();
        const element = await $(elementName);

        await browser.pause(3000);
        username = (await action.getText(element)).split('\n')[1];
        console.log(`Fetched name for role: ${role} is: ${username}`);
        return username;
    }

    async assignTechnicianToInProgressPPM(){

        //Find the Technician element and apply filters to load technicians in the dropdown, then select a random technician from the list and assign to the PPM
        await ppmDetailsPage.tapIgnoreSkillsFilter();
        await ppmDetailsPage.tapTechnicianDropdown();
        await browser.pause(7000);
        await commonPage.selectRandomOption(ppmDetailsPage.ppmTechnicianDropdownItems);
        await ppmDetailsPage.tapTechnicianDropdownOkButton();

        await browser.pause(2000);
        const technicianName = (await action.getContentDescription(ppmDetailsPage.ppmTechnicianDropdown)).split('\n')[2];
        console.log(`Selected Technician: ${technicianName}`);

        await ppmDetailsPage.tapAssignButton();

        //Asserting the Please Wait banner and Success Message after assigning technician to the PPM
        //For Now I'm keeping a blind wait after tapping assign button to wait for the Please Wait banner to appear and disappear as I'm facing issues in locating the banner element. Will replace the blind wait with an explicit wait once the locator issue is resolved.
        await browser.pause(3000);

        return technicianName;
    }

    async uploadImageFromAttachmentsTab(){
        await ppmDetailsPage.tapAttachmentsTab();
        await browser.pause(2000);

        await ppmDetailsPage.tapAddImageButton();
        await ppmDetailsPage.tapUploadFromGalleryOption();
        await ppmDetailsPage.selectFirstImageFromGallery();

        await browser.pause(2000);
        await ppmDetailsPage.confirmPreview();

        await browser.pause(5000); // wait for upload to complete
    }

    async getImageNameFromPPMAttachmentsTab(){
        try {
            await action.click(ppmDetailsPage.ppmAttachmentBox);
            const imageBox = await action.getContentDescription(ppmDetailsPage.ppmImageNameFromImageHeader);
            const imageName = imageBox.split('\n')[1];
            console.log('PPM attachment image name: ' + imageName);
            return imageName;
        } catch(error) {
            throw new Error('No images displayed in PPM attachment tab: ' + error);
        }
    }

}

module.exports = new PPMFlow();
