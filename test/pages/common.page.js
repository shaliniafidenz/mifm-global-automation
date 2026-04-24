const action = require('../utils/action.utils');
const waitUtils = require('../utils/wait.utils');

class CommonPage{

    get backButton(){ return $('~Back');}
    get loader(){ return $('android=new UiSelector().resourceId("dashboard_loader")');}

    async tapBack(){
        await action.click(this.backButton);
    }
    
    async waitForLoaderToDisappear(timeout = 10000){
        try{
            await waitUtils.waitForDisplayed(this.loader);

            await this.loader.waitForDisplayed({
                reverse: true,
                timeout: timeout,
                timeoutMsg: 'Loader did not disappear after ' + timeout + ' ms'
            });
        }
        catch(error){
            console.error('Error waiting for loader to disappear:', error);
        }
    }


    async selectOptionByTextAndIndex(selector, option, index  = 0 ){
        await browser.waitUntil(
            async() => (await $$(selector)).length > 0,
            {
                timeout: 5000,
                interval: 500,
                timeoutMsg: `No options found for selector ${selector} after 5 seconds`
            }
        );
        const elements = await $$(selector);

        const matches =[];

        //console.log(`Total elements found: ${elements}`);

        for(let el of elements){
            const desc = await el.getAttribute('content-desc');
            if(desc && desc.includes(option)){
                matches.push(el);
            }
        }

        //console.log(`Matches found for option ${option}: ${matches.length}`);

        if(matches.length == 0){
            throw new Error(`No elements found with option ${option}`);
        }
        if(!matches[index]){    
            throw new Error(`No element found at index ${index} for option ${option}`);
        }

        await action.click(matches[index]);
    }

    async selectRandomOption(selector){

        await browser.waitUntil(
            async() => (await $$(selector)).length > 0,
            {
                timeout: 5000,
                interval: 500,
                timeoutMsg: `No options found for selector ${selector} after 5 seconds`
            }
        );

        const elements = await $$(selector);

        console.log(`Selecting random option from ${elements.length} elements`);
      //  const matches = [];

        const randomIndex = Math.floor(Math.random() * elements.length);
        await action.click(elements[randomIndex]);
    }

    

    async getWOHeaderText(element){
        await waitUtils.waitForDisplayed(element);
        const value = await element.getAttribute('content-desc');
        return value.split('\n');
    }
 

}


module.exports = new CommonPage();