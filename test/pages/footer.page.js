const action = require('../utils/action.utils');

class FooterPage{

    get cwoFooterIcon(){ return $('android=new UiSelector().resourceId("footer_cwo_button")');}
    get ppmFooterIcon(){ return $('android=new UiSelector().resourceId("footer_ppm_button")');}
    get homeFooterIcon(){ return $('android=new UiSelector().resourceId("footer_home_button")');}
    
    get menuBtn(){ return $('android=new UiSelector().resourceId("footer_menu_button")');}
    get homeMenuOption(){ return $('android=new UiSelector().resourceId("footer_menu_home_button")');}
    get ppmMenuOption(){ return $('android=new UiSelector().resourceId("footer_menu_ppm_button")');}
    get cwoMenuOption(){ return $('android=new UiSelector().resourceId("footer_menu_cwo_button")');}
    

    async tapFooterHome(){
        await action.click(this.homeFooterIcon);
    }
    
    async tapFooterMenu(){
        await action.click(this.menuBtn);
        
    }

    async selectOptionFromFooterMenu(option){
        
        switch(option){
            case 'Dashboard':
                await action.click(this.homeMenuOption);
                break;
            case 'CWO':
                await action.click(this.cwoMenuOption);
                break;
            case 'PPM':
                await action.click(this.ppmMenuOption);
                break;
            default:
                throw new Error(`Option ${option} not found in footer menu`);
        }
    }

    async tapCWOFooterIcon(){
        await action.click(this.cwoFooterIcon);
    }

    async tapPPMFooterIcon(){
        await action.click(this.ppmFooterIcon);
    }
}

module.exports = new FooterPage();