const action = require('../../utils/action.utils');
const commonPage = require('../common.page');

class CWODetailPage{

    //CWO Details elements
    get cwoNumber(){ return $('android=new UiSelector().resourceId("cwoItemDetailAppBar_cwoNumber_text")');}
    get cwoStatus(){ return $('android=new UiSelector().resourceId("cwoItemDetailAppBar_cwoStatus_text")');}

    get cwoSelectAllFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_show_all_button"))'); 
    }

    get cwoIgnoreSkillsFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_ignore_skills_button"))'); 
    }

    get cwoOnlineOnlyFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_online_only_button"))'); 
    }

    get cwoIncludeAssignedFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skill_selector_filter_include_assigned_button"))'); 
    }

    get cwoSupervisorDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_supervisor_dropdown"))'); 
    }

    get cwoSupervisorDropdownItems(){ return 'android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_supervisor_dropdown_list_item_.*"))'; 
    }

    get cwoTechnicianDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_technician_dropdown"))'); 
    }

    get cwoTechnicianDropdownItems(){ return 'android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_technician_dropdown_list_item_.*"))'; 
    }

    get cwoNewAssignButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_assign_button"))'); 
    }

    get cwoAssignmentAssignButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_assign_button"))'); 
    }

    get cwoInfoTab(){ return $('android=new UiSelector().resourceId("navigationItemInactive_Information_tab")');}

    get cwoAttachmentTab(){ return $('android=new UiSelector().resourceId("navigationItemInactive_Attachments_tab")');}


    get cwoInfoSupervisorValue(){ return 'android=new UiScrollable(new UiSelector().className("android.widget.ScrollView"))' +
        '.scrollIntoView(new UiSelector().resourceId("cwoAdditionalInformationTab_supervisor_value"))'; 
    }

    get cwoInfoTechnicianValue(){ return 'android=new UiScrollable(new UiSelector().className("android.widget.ScrollView"))' +
        '.scrollIntoView(new UiSelector().resourceId("cwoAdditionalInformationTab_technician_value"))'; 
    }

    get cwoAttachmentBox(){
        return $('android=new UiSelector().resourceId("attachmentItem_tap_inkwell_09")');
    }

    get cwoImageNameFromImageHeader(){
        return $('android=new UiSelector().resourceId("generalAppBar_view_text_01")');
    }

    async getCWONumberFromHeader(){
       // await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_create_building_dropdown_list_item.*"))');
        return await action.getContentDescription(this.cwoNumber);
    }

    async getCWOStatusFromHeader(){
        return await action.getContentDescription(this.cwoStatus);
    }

    async tapSelectAllFilter(){
        await action.click(this.cwoSelectAllFilter);
    }

    async tapIgnoreSkillsFilter(){
        await action.click(this.cwoIgnoreSkillsFilter);
    }

    async tapIncludeAssignedFilter(){
        await action.click(this.cwoIncludeAssignedFilter);
    }

    async tapSupervisorDropdown(){
        await action.click(this.cwoSupervisorDropdown);
    }

    async tapTechnicianDropdown(){
        await action.click(this.cwoTechnicianDropdown);
    }

    async tapNewAssignButton(){
        await action.click(this.cwoNewAssignButton);
    }

    async tapAssignmentAssignButton(){
        await action.click(this.cwoAssignmentAssignButton);
    }

    async tapInfoTab(){
        await action.click(this.cwoInfoTab);    
    }

    async tapAttachmentsTab(){
        await action.click(this.cwoAttachmentTab);
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
}

module.exports = new CWODetailPage();