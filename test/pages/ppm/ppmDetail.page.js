const action = require('../../utils/action.utils');
const commonPage = require('../common.page');

class PPMDetailPage{

    //PPM Details elements
    get ppmNumber(){ return $('android=new UiSelector().resourceId("ppmwoItemDetailAppBar_ppmwoNumber_text")');}
    get ppmStatus(){ return $('android=new UiSelector().resourceId("ppmwoItemDetailAppBar_ppmwoStatus_text")');}

    get ppmSelectAllFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_show_all_button"))');
    }

    get ppmIgnoreSkillsFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_ignore_skills_button"))');
    }

    get ppmOnlineOnlyFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_online_only_button"))');
    }

    get ppmIncludeAssignedFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_include_assigned_button"))');
    }

    get ppmSupervisorDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_supervisor_dropdown"))');
    }

    get ppmSupervisorDropdownItems(){ return 'android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceIdMatches(".*ppm_supervisor_dropdown_list_item_.*"))';
    }

    get ppmTechnicianDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_technicians_dropdown"))');
    }

    get ppmTechnicianDropdownItems(){ return 'android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceIdMatches("ppm_dropdown_checkbox_item_.*"))';
    }

    get ppmTechnicianDropdownOkButton(){ return $('android=new UiSelector().resourceId("ppm_dropdown_technication_ok_button")');}

    get ppmAssignButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("ppm_assign_button"))');
    }

    get ppmInfoTab(){ return $('android=new UiSelector().resourceId("navigationItemInactive_Information_tab")');}

    get ppmInfoSupervisorValue(){ return 'android=new UiScrollable(new UiSelector().className("android.widget.ScrollView"))' +
        '.scrollIntoView(new UiSelector().resourceId("ppmAdditionalInformationTab_supervisor_value"))';
    }

    get ppmInfoTechnicianValue(){ return 'android=new UiScrollable(new UiSelector().className("android.widget.ScrollView"))' +
        '.scrollIntoView(new UiSelector().resourceId("ppmAdditionalInformationTab_technician_value"))';
    }

    async getPPMNumberFromHeader(){
        return await action.getContentDescription(this.ppmNumber);
    }

    async getPPMStatusFromHeader(){
        return await action.getContentDescription(this.ppmStatus);
    }

    async tapSelectAllFilter(){
        await action.click(this.ppmSelectAllFilter);
    }

    async tapIgnoreSkillsFilter(){
        await action.click(this.ppmIgnoreSkillsFilter);
    }

    async tapIncludeAssignedFilter(){
        await action.click(this.ppmIncludeAssignedFilter);
    }

    async tapSupervisorDropdown(){
        await action.click(this.ppmSupervisorDropdown);
    }

    async tapTechnicianDropdown(){
        await action.click(this.ppmTechnicianDropdown);
    }

    async tapAssignButton(){
        await action.click(this.ppmAssignButton);
    }

    async tapInfoTab(){
        await action.click(this.ppmInfoTab);
    }

    async scrollToBottomOfInfoTab() {
        try {
            await $('android=new UiScrollable(new UiSelector().className("android.widget.ScrollView"))' +
                    '.scrollToEnd(10)' //  max 10 swipes
            );
            await browser.pause(500);
        } catch (e) {
            console.warn('Pre-scroll failed, continuing...', e.message);
        }
    }

    async tapTechnicianDropdownOkButton(){
        await action.click(this.ppmTechnicianDropdownOkButton);
    }
}

module.exports = new PPMDetailPage();
