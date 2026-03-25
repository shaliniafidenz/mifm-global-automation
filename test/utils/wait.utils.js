class WaitUtils{

    async waitForDisplayed(element, timeout = 5000){
        await element.waitForDisplayed({
            timeout,
            timeoutMsg: 'Element not displayed after ' + timeout + ' ms'
        });

       // await element.waitForExist({ timeout });
    }

    async waitForClickable(element, timeout=10000){
        await element.waitForClickable({
            timeout,
            timeoutMsg: 'Clickable Element not clickable after ' + timeout + ' ms'
        })
    }

    async waitForText(element, expectedText, timeout=10000){
        await browser.waitUntil(async() => {
            const text = await element.getText();
            return text.includes(expectedText);
        }, {
            timeout,
            timeoutMsg: 'Expected text "' + expectedText + '" not found after ' + timeout + ' ms'
        });
    }
}

module.exports = new WaitUtils();