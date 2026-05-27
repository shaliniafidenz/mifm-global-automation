const action = require('../utils/action.utils');

class HeaderPage{

    get menuDrawerBtn(){ return $('android=new UiSelector().resourceId("header_menu_button")');}
    get cwoDrawerOption(){ return $('android=new UiSelector().resourceId("drawer_cwo_button")');}
    get ppmDrawerOption(){ return $('android=new UiSelector().resourceId("drawer_ppm_button")');}
    get homeDrawerOption(){ return $('android=new UiSelector().resourceId("drawer_home_button")');}
    get logoutButton(){ return $('android=new UiSelector().resourceId("drawer_logout_button")');}

    get logoutPromptOkButton() {
        return $('//android.widget.Button[contains(@content-desc, "OK")]');
    }

    // Home screen header — shows logged-in user name and role
    // content-desc: "header_username_label\napplicationBar_view_text_02\n<Name>\napplicationBar_view_text_01\n<Role>"
    get usernameLabel(){ return $('android=new UiSelector().resourceId("header_username_label")');}


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
            case 'Logout':
                await action.click(this.logoutButton);
                break;
            default:
                throw new Error(`Option ${option} not found in drawer`);
        }
    }

    async tapOkFromLogoutAlert(){
        //tap the OK button from the logout confirmation alert
        await action.click(this.logoutPromptOkButton);
    }

    // Returns the display name portion of the header label (e.g. "Pasindu K")
    async getLoggedInUsername(){
        const desc = await action.getContentDescription(this.usernameLabel);
        return desc.split('\n')[2]; // [0]=resourceId [1]=text-02 key [2]=display name [3]=text-01 key [4]=role
    }

    async isUsernameLabelVisible(){
        return await action.isDisplayed(this.usernameLabel);
    }
}

module.exports = new HeaderPage();