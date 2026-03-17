const waitUtils = require('./wait.utils');

class ActionUtils{

    async click(element){
        //await waitUtils.waitForClickable(element);
        await waitUtils.waitForDisplayed(element);
        await element.click();
    }

    async type(element, text){
        await waitUtils.waitForDisplayed(element);
        await element.setValue(text);
    }

    async getText(element){
        await waitUtils.waitForDisplayed(element);
        //return await element.getText();
        return await element.getAttribute('content-desc');
    }
}

module.exports = new ActionUtils();