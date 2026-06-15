const WDIOReporter = require('@wdio/reporter').default;
const fs = require('fs');
const path = require('path');

function videoPathForTest(title) {
    const safeName = (title || 'unknown').replace(/[^a-zA-Z0-9_-]+/g, '_');
    return path.join('videos', `${safeName}.mp4`);
}

class QAHubReporter extends WDIOReporter {
    constructor(options) {
        super(options);

        this.qaHubOptions = options;
        this.results = [];
        this._isSynchronised = false;
    }

    get isSynchronised() {
        return this._isSynchronised;
    }

    onTestEnd(test) {
        const videoPath = videoPathForTest(test.title);

        this.results.push({
            testName: test.title || test.fullTitle || 'Unknown Test',
            status:
                test.state === 'passed'
                    ? 'passed'
                    : test.state === 'failed'
                    ? 'failed'
                    : 'skipped',
            durationMs: test.duration || 0,
            errorMessage: test.error?.message,
            stackTrace: test.error?.stack,
            videoPath: fs.existsSync(videoPath) ? videoPath : null
        });
    }

    async _uploadVideo(filePath, url, runId, token) {
        const data = fs.readFileSync(filePath);
        const blob = new Blob([data], { type: 'video/mp4' });
        const formData = new FormData();
        formData.append('file', blob, path.basename(filePath));

        const res = await fetch(`${url}/api/automation/${runId}/upload-video`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });

        if (!res.ok) {
            throw new Error(`${res.status}`);
        }

        const json = await res.json();
        return json.videoUrl;
    }

    async onRunnerEnd() {
        const { url, runId, token } = this.qaHubOptions;

        try {
            for (const result of this.results) {
                if (!result.videoPath) {
                    continue;
                }

                try {
                    result.videoUrl = await this._uploadVideo(result.videoPath, url, runId, token);
                } catch (err) {
                    console.warn('[QA Hub] Video upload skipped:', err.message);
                }

                delete result.videoPath;
            }

            const response = await fetch(
                `${url}/api/automation/${runId}/results`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        results: this.results
                    })
                }
            );

            if (!response.ok) {
                console.error(
                    '[QA Hub] Failed:',
                    response.status,
                    await response.text()
                );
            } else {
                console.log(
                    `[QA Hub] Submitted ${this.results.length} results`
                );
            }
        } catch (err) {
            console.error('[QA Hub] Error:', err);
        } finally {
            this._isSynchronised = true;
        }
    }
}

module.exports = QAHubReporter;