const action = require('../../utils/action.utils');
const commonPage = require('../common.page');

class CWODetailPage{

    //CWO Details elements
    get cwoDetailsHeader(){ return $('android=new UiSelector().resourceId("cwoItemDetailAppBar_view_text_02")');}

    get cwoSelectAllFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skillSelector_button_01"))'); 
    }

    get cwoIgnoreSkillsFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skillSelector_button_02"))'); 
    }

    get cwoIncludeAssignedFilter(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("skillSelector_button_03"))'); 
    }

    get cwoSupervisorDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_checklist_new_supervisor_dropdown"))'); 
    }

    get cwoSupervisorDropdownItems(){ return 'android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_checklist_new_supervisor_dropdown_list_item_.*"))'; 
    }

    get cwoTechnicianDropdown(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_checklist_assignment_technician_dropdown"))'); 
    }

    get cwoTechnicianDropdownItems(){ return 'android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceIdMatches(".*pm_technician_dropdown_list_item_.*"))'; 
    }

    get cwoNewAssignButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_checklist_new_assign_button"))'); 
    }

    get cwoAssignmentAssignButton(){ return $('android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().resourceId("cwo_checklist_assignment_assign_button"))'); 
    }

    get cwoInfoTab(){ return $('android=new UiSelector().resourceId("navigationItemInactive_Information_tab")');}

    get cwoInfoSupervisorValue(){ return 'android=new UiScrollable(new UiSelector().className("android.widget.ScrollView"))' +
        '.scrollIntoView(new UiSelector().resourceId("cwoAdditionalInformationTab_supervisor_value"))'; 
    }

    get cwoInfoTechnicianValue(){ return 'android=new UiScrollable(new UiSelector().className("android.widget.ScrollView"))' +
        '.scrollIntoView(new UiSelector().resourceId("cwoAdditionalInformationTab_technician_value"))'; 
    }

    async getCWODetailsHeaderText(){
       // await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceIdMatches(".*cwo_create_building_dropdown_list_item.*"))');
        return await commonPage.getWOHeaderText(this.cwoDetailsHeader);
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