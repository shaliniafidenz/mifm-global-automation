const cwoPage = require('../pages/cwo.page');
const headerPage = require('../pages/header.page');
const footerPage = require('../pages/footer.page');
const commonPage = require('../pages/common.page');
const action = require('../utils/action.utils');

class CWOFlow{

    async navigateToCWOFromBottomNav(){
        await footerPage.tapCWOFooterIcon();
        return await cwoPage.getCWOTitle();
    }

    async navigateToCWOFromRightMenuDrawer(){
        await headerPage.openMenuDrawer();
        await headerPage.selectOptionFromDrawer('CWO');

        return await cwoPage.getCWOTitle();
    }

    async navigateToCWOFromBottomMenu(){

        await footerPage.tapFooterMenu();
        await footerPage.selectOptionFromFooterMenu('CWO');

        return await cwoPage.getCWOTitle();
    }

    async createCWO(){
        //creating a new CWO with minimal details
        await cwoPage.tapCreateCWO();

        await cwoPage.tapBuildingDropdown();
        await commonPage.selectOptionByTextAndIndex(cwoPage.cwoBuildingDropdownOptions, '10 MBC');

        await cwoPage.tapLocationDropdown();
        await commonPage.selectOptionByTextAndIndex(cwoPage.cwoLocationDropdownOptions, '10 MBC L5');

        await cwoPage.tapProblemTypeDropdown();
        await commonPage.selectOptionByTextAndIndex(cwoPage.cwoProblemTypeDropdownOptions, 'Aircon is not cold');

        await cwoPage.tapSubmitButton();
        await commonPage.waitForLoaderToDisappear();

        return await cwoPage.getCWODetailsHeaderText();
        
    }

    async returnErrorMessageForCreatingCWOWithEmptyFields(){
        await cwoPage.tapCreateCWO();
        
        //clear the default selections for the Work Order Type which is a requried field
        await cwoPage.tapWorkOrderTypeDropdown();
        await cwoPage.tapWorkOrderTypeClearButton();

        await cwoPage.tapSubmitButton();

        //Validate availability of error messages for required fields
        const buildingRequiredMessageVisible = await action.isDisplayed(cwoPage.cwoBuildingRequiredErrorMessage);
        const locationRequiredMessageVisible = await action.isDisplayed(cwoPage.cwoLocationRequiredErrorMessage);
        const problemTypeRequiredMessageVisible = await action.isDisplayed(cwoPage.cwoProblemTypeRequiredErrorMessage);
        const workOrderTypeRequiredMessageVisible = await action.isDisplayed(cwoPage.cwoWorkOrderTypeRequiredErrorMessage);
        const serviceCategoryRequiredMessageVisible = await action.isDisplayed(cwoPage.cwoServiceCategoryRequiredErrorMessage);
        const priorityLevelRequiredMessageVisible = await action.isDisplayed(cwoPage.cwoPriorityLevelRequiredErrorMessage);

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
        
        await cwoPage.tapCreateCWO();

        //select values for all input fields
        await cwoPage.tapRequesterDropdown();
        await commonPage.selectRandomOption(cwoPage.cwoRequesterDropdownOptions);

        await cwoPage.tapBuildingDropdown();
        await commonPage.selectOptionByTextAndIndex(cwoPage.cwoBuildingDropdownOptions, 'CW');

        await cwoPage.tapLocationDropdown();
        await commonPage.selectOptionByTextAndIndex(cwoPage.cwoLocationDropdownOptions, 'CW');

        await cwoPage.tapProblemTypeDropdown();
        await commonPage.selectOptionByTextAndIndex(cwoPage.cwoProblemTypeDropdownOptions, 'Audio Visual');
        
        await cwoPage.tapAssetDropdown();
        await commonPage.selectRandomOption(cwoPage.cwoAssetDropdownOptions);

        await cwoPage.tapDescriptionField();
        await cwoPage.enterDescription('This is a description for resetting CWO creation');
        await driver.hideKeyboard();

        await cwoPage.tapResetCWOButton();

        //get the values of the fields after reset and return in an object
        const requesterValue = (await action.getText(cwoPage.cwoRequesterDropdown)).split('\n')[2]; // get only visible text
        const buildingValue = (await action.getText(cwoPage.cwoBuildingDropdown)).split('\n')[2];
        const locationValue = (await action.getText(cwoPage.cwoLocationDropdown)).split('\n')[2];
        const workOrderTypeValue = (await action.getText(cwoPage.cwoWorkOrderTypeDropdown)).split('\n')[2];
        const problemTypeValue = (await action.getText(cwoPage.cwoProblemTypeDropdown)).split('\n')[2];
        const serviceCategoryValue = (await action.getText(cwoPage.cwoServiceCategoryDropdown)).split('\n')[2];
        const priorityLevelValue = (await action.getText(cwoPage.cwoPriorityLevelDropdown)).split('\n')[2];
        const assetValue = (await action.getText(cwoPage.cwoAssetDropdown)).split('\n')[2];
        const descriptionValue = await action.getText(cwoPage.cwoDescription);

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
        return await cwoPage.isNoResultsFoundMessageVisible();
    }

    async isNewCardVisibleInCWOList(){
        return await cwoPage.isCWOStatusCardVisible('New');
    }

    async isAssignmentCardVisibleInCWOList(){
        return await cwoPage.isCWOStatusCardVisible('Assignment');
    }

    async isAcknowledgementCardVisibleInCWOList(){
        return await cwoPage.isCWOStatusCardVisible('Acknowledgement');
    }

    async isInProgressCardVisibleInCWOList(){
        return await cwoPage.isCWOStatusCardVisible('In-Progress');
    }

    async isCompletedCardVisibleInCWOList(){
        return await cwoPage.isCWOStatusCardVisible('Completed');
    }

    async areCWOCardsVisible(){
        const newCardVisible = await this.isNewCardVisibleInCWOList();
        const assignmentCardVisible = await this.isAssignmentCardVisibleInCWOList();
        const acknowledgementCardVisible = await this.isAcknowledgementCardVisibleInCWOList();  
        const inProgressCardVisible = await this.isInProgressCardVisibleInCWOList();
        const completedCardVisible = await this.isCompletedCardVisibleInCWOList();

        return (newCardVisible && assignmentCardVisible && acknowledgementCardVisible && inProgressCardVisible && completedCardVisible);
    }

    async displayAllCWO(){
        // Tap on the filter dropdown
        await cwoPage.tapFilterButton();

        // Tap on the "All" toggle under Assigned To filter
        await cwoPage.tapAssignedToToggle('All');
        await cwoPage.tapApplyFilterButton();
    }

    async getWokOrderDataForGivenStatus(status){
        // Implementation for checking if the list is visible for a specific status, WO count, and returning the data in an object
        
        let element, isCardVisible, totalNoOfWorkOrders, isListVisible;
      

        switch (status) {
            case 'New':
                element = await cwoPage.newCard;
                isCardVisible = await action.isDisplayed(element);
                await element.click();
                totalNoOfWorkOrders = await cwoPage.getTotalWOCount(element);
                await browser.pause(2000);
                isListVisible = await cwoPage.isCWOListVisible(cwoPage.newWOFirstListItem);
                break;

            case 'Assignment':
                element = await cwoPage.assignmentCard;
                isCardVisible = await action.isDisplayed(element);
                await element.click();
                totalNoOfWorkOrders = await cwoPage.getTotalWOCount(element);
                await browser.pause(2000);
                isListVisible = await cwoPage.isCWOListVisible(cwoPage.assignmentWOFirstListItem);
                break;

            case 'Acknowledgement':
                element = await cwoPage.acknowledgementCard;
                isCardVisible = await action.isDisplayed(element);
                await element.click();
                totalNoOfWorkOrders = await cwoPage.getTotalWOCount(element);
                await browser.pause(2000);
                isListVisible = await cwoPage.isCWOListVisible(cwoPage.acknowledgementWOFirstListItem);
                break;

            case 'In-Progress':
                element = await cwoPage.inProgressCard;
                isCardVisible = await action.isDisplayed(element);
                await element.click();
                totalNoOfWorkOrders = await cwoPage.getTotalWOCount(element);
                await browser.pause(2000);
                isListVisible = await cwoPage.isCWOListVisible(cwoPage.inProgressWOFirstListItem);
                break;

            case 'Completed':
                element = await cwoPage.completedCard;
                isCardVisible = await action.isDisplayed(element);
                await element.click();
                totalNoOfWorkOrders = await cwoPage.getTotalWOCount(element);
                await browser.pause(2000);
                isListVisible = await cwoPage.isCWOListVisible(cwoPage.completedWOFirstListItem);
                break;

            default:
                throw new Error(`Unsupported CWO status: ${status}`);
        }

        return { isCardVisible, totalNoOfWorkOrders, isListVisible };
    }

    

}

module.exports = new CWOFlow();    