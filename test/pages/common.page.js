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


    async selectOptionByTextAndIndex(elements, option, index  = 0 ){
        //const elements = await $$('android.widget.ImageView');
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

    async selectRandomOption(elements, option){
        const matches = [];

        for(let el of elements){
            const desc = await el.getAttribute('content-desc');

            if(!desc){
                continue;
            }
            else{
                matches.push(el);
            }
        }
        
        if(matches.length == 0){
            throw new Error(`No elements found with option ${option}`);
        }

        const randomIndex = Math.floor(Math.random() * matches.length);
        await action.click(matches[randomIndex]);
    }

    

    async getWOHeaderText(element){
        await waitUtils.waitForDisplayed(element);
        const value = await element.getAttribute('content-desc');
        return value.split('\n');
    }
 

}


module.exports = new CommonPage();