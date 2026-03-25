const cwoPage = require('../pages/cwo.page');
const headerPage = require('../pages/header.page');
const footerPage = require('../pages/footer.page');
const commonPage = require('../pages/common.page');

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
        await cwoPage.selectOptionByTextAndIndex('Building', '10 MBC');

        await cwoPage.tapLocationDropdown();
        await cwoPage.selectOptionByTextAndIndex('Location', '10 MBC L5');

        
        await cwoPage.tapProblemTypeDropdown();
        await cwoPage.selectOptionByTextAndIndex('ProblemType', 'Aircon is not cold');

        await cwoPage.tapSubmitButton();
        await commonPage.waitForLoaderToDisappear();

        return await cwoPage.getCWODetailsHeaderText();
        
    }

}

module.exports = new CWOFlow();