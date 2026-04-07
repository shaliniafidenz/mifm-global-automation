const waitUtils = require('./wait.utils');

class ActionUtils{

    async click(element, timeout = 2000){
        await waitUtils.waitForDisplayed(element);
        await element.click();
    }

    async type(element, text){
        await waitUtils.waitForDisplayed(element);
        await element.setValue(text);
    }

    
    async getContentDescription(element, timeout = 2000){
        let value = await element.getAttribute('content-desc');
        return value;
    }

    async getTextMultiPart(element){
        await waitUtils.waitForDisplayed(element);
        //return await element.getText();
        //return await element.getAttribute('content-desc');

        const value = await element.getAttribute('content-desc');
        return value.split('\n')[1]; // get only visible text
    }

    async getText(element, timeout = 2000){

        let value = await element.getAttribute('content-desc');

        if(!value){
            value = await element.getText();
        }
        return value;
    }

    async isDisplayed(element){
        try{
            //await waitUtils.waitForDisplayed(element);
            return await element.isDisplayed();
        }
        catch(error){
            console.error('Error checking if element is displayed:', error);
            return false;
        }
    }

    async isDisplayedSafe(selector) {
        try {
            const el = await selector;

            if (!(await el.isExisting())) {
                return false;
            }

            return await el.isDisplayed();
        } catch (e) {
            return false;
        }
    }

    
}

module.exports = new ActionUtils();