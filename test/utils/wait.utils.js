class WaitUtils{

    async waitForDisplayed(element, timeout = 5000){
        await element.waitForDisplayed({
            timeout,
            timeoutMsg: 'Element not displayed after ' + timeout + ' ms'
        });

       // await element.waitForExist({ timeout });
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