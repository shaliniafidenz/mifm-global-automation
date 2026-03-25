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
        //return await element.getAttribute('content-desc');

        const value = await element.getAttribute('content-desc');
        return value.split('\n')[1]; // get only visible text
    }

    async isDisplayed(element){
        try{
            await waitUtils.waitForDisplayed(element);
            return await element.isDisplayed();
        }
        catch(error){
            console.error('Error checking if element is displayed:', error);
            return false;
        }
    }

    
}

module.exports = new ActionUtils();