const action = require('../utils/action.utils');

class HeaderPage{

    get menuDrawerBtn(){ return $('android=new UiSelector().resourceId("header_menu_button")');}
    get cwoDrawerOption(){ return $('android=new UiSelector().resourceId("drawer_cwo_button")');}
    get ppmDrawerOption(){ return $('android=new UiSelector().resourceId("drawer_ppm_button")');}
    get homeDrawerOption(){ return $('android=new UiSelector().resourceId("drawer_home_button")');}

    async openMenuDrawer(){
        await action.click(this.menuDrawerBtn);
    }

    async selectOptionFromDrawer(option){
        switch(option){
            case 'Dashboard':
                await action.click(this.homeDrawerOption);
                break;
            case 'CWO':
                await action.click(this.cwoDrawerOption);
                break;
            case 'PPM':
                await action.click(this.ppmDrawerOption);
                break;
            default:
                throw new Error(`Option ${option} not found in drawer`);
        }
    }
}

module.exports = new HeaderPage();