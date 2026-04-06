class WaitUtils{

    async waitForDisplayed(element, timeout = 3000){

        try{
            await element.waitForDisplayed({
                timeout,
                timeoutMsg: `Element not displayed after ${timeout}ms`,
            });
        }
        catch(error){
            console.error('Error checking if element is displayed:', error);
        }
    }

    async waitForExist(element, timeout = 3000) {
        await element.waitForExist({
            timeout,
            timeoutMsg: `Element not found after ${timeout}ms`,
        });
    }

    async waitToDisappear(element, timeout){
        await element.waitForDisplayed({
            reverse: true,
            timeout: timeout,
            timeoutMsg: 'Element still displayed after ' + timeout + ' ms'
        });
    }

    async waitForClickable(element, timeout=10000){
        await element.waitForClickable({
            timeout,
            timeoutMsg: 'Clickable Element not clickable after ' + timeout + ' ms'
        })
    }


}

module.exports = new WaitUtils();