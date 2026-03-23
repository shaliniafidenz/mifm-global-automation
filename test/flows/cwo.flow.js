const cwoPage = require('../pages/cwo.page');
const headerPage = require('../pages/header.page');
const footerPage = require('../pages/footer.page');

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

}

module.exports = new CWOFlow();