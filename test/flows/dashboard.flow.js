const footerPage = require('../pages/footer.page');
const headerPage = require('../pages/header.page');
const waitUtils = require('../utils/wait.utils');

class DashboardFlow{

    async navigateToDashboardFromFooter(){
        await footerPage.tapFooterHome();
    }

    async navigateToDashboardFromRightDrawer(){
        await headerPage.openMenuDrawer();
        await headerPage.selectOptionFromDrawer('Dashboard');
    }

    async navigateToDashboardFromFooterMenu(){
        await footerPage.tapFooterMenu();
        await footerPage.selectOptionFromFooterMenu('Dashboard');
    }


}

module.exports = new DashboardFlow();