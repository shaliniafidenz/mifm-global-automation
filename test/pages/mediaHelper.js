const path = require('path');
const fs = require('fs');

class MediaHelper {
    async pushTestImageToDevice(deviceFileName = 'test_image_upload.jpg') {

        console.log('Pushing test image to device...');
        
        // Resolves correctly whether run locally or in CI/CD pipeline
        const localImagePath = path.resolve(__dirname, '../resources', deviceFileName);
        const devicePath = `/sdcard/Pictures/${deviceFileName}`;

        if (!fs.existsSync(localImagePath)) {
            throw new Error(`Test image not found at: ${localImagePath}`);
        }

        const imageData = fs.readFileSync(localImagePath, { encoding: 'base64' });
        
        // Overwrites if already exists — no cleanup needed
        await driver.pushFile(devicePath, imageData);

        // Give the OS time to naturally index the new file
        await browser.pause(3000);
        return devicePath;
    }

    static async removeTestImage(deviceFileName = 'test_image_upload.jpg') {
        const devicePath = `/sdcard/Pictures/${deviceFileName}`;
        try {
            await driver.execute('mobile: shell', {
                command: 'rm',
                args: [devicePath]
            });
        } catch (e) {
            console.log('Could not remove test image:', e.message);
        }
    }
}

module.exports = new MediaHelper();