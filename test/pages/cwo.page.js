const action = require('../utils/action.utils');

class CWOPage{

    get cwoTitle(){ return $('android=new UiSelector().resourceId("cwo_title_label")');}
    get cwoCreateButton(){ return $('android=new UiSelector().resourceId("create_cwo_button")');}

    async getCWOTitle(){
        return await action.getText(this.cwoTitle);
    }

    async tapCreateCWO(){
        await action.click(this.cwoCreateButton);
    }

}

module.exports = new CWOPage();