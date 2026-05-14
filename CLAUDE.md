# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run tests (specs defined in wdio.conf.js)
npm run wdio

# Run tests and generate + open Allure report
npm run wdio-with-report

# Generate Allure report from existing results
npm run allure

# Clean previous Allure results
npm run clean-allure
```

**Running a single spec file:** Edit the `specs` array in `wdio.conf.js` to include only the target file:
```js
specs: ['./test/e2e/cwo.e2e.js']
```

**Running a single test case:** Use `it` vs `it.skip` in the spec file — the suite-level `before` hook always runs, so only the target `it` should be un-skipped.

**Running via CLI override:**
```bash
npx wdio run ./wdio.conf.js --spec ./test/e2e/cwo.e2e.js
```

## Architecture

This is an **Appium + WebdriverIO** Android mobile automation project using the **Page Object Model** pattern with an additional **flow layer**.

### Layer Responsibilities

```
test/e2e/*.e2e.js        ← Test specs: assertions and test orchestration only
test/flows/*.flow.js     ← Business flows: multi-step sequences using page objects
test/pages/**/*.page.js  ← Page objects: element selectors + atomic interactions
test/utils/*.utils.js    ← Shared utilities: action wrappers and wait helpers
test/fixtures/*.data.js  ← Static test data (credentials, dropdown values)
test/pages/mediaHelper.js ← Device file management (push/remove images)
test/resources/          ← Test assets (test_image_upload.jpg)
```

**Key rule:** E2E specs must only import from `flows/` and `pages/` — never call WebdriverIO APIs directly. Flows orchestrate page objects; page objects never import flows.

### Selector Conventions

All selectors use Android `UiSelector` / `UiScrollable` strings:

```js
// Static element
$('android=new UiSelector().resourceId("some_resource_id")')

// Element that requires scrolling into view
$('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("some_id"))')

// Horizontal scroll (status cards)
$('android=new UiScrollable(new UiSelector().className("android.widget.HorizontalScrollView")).setAsHorizontalList().scrollIntoView(new UiSelector().resourceId("ppm_new_card"))')

// Multiple elements (use $$)
$$('android=new UiSelector().resourceIdMatches(".*list_item_.*")')
```

### Text Extraction Pattern

The `content-desc` attribute is multiline — always split and index:
```js
const text = (await action.getContentDescription(element)).split('\n')[2]; // index varies per element
```

Use `action.utils.js` methods for all element interactions — never call `element.click()`, `element.getText()`, etc. directly.

### Banner Assertions

Flash banners appear after actions like Acknowledge, Assign, etc.:
- Processing: `flashBanner_processing_view_title`
- Success: `flashBanner_success_view_title`

Use `waitForDisplayed` + `waitToDisappear` from `wait.utils.js` to assert banner sequence.

### Image Upload Pattern

1. Push image to device: `mediaHelper.pushTestImageToDevice()` → `/sdcard/Pictures/test_image_upload.jpg`
2. Select from Android 13+ picker: `$$('//*[@resource-id="com.google.android.providers.media.module:id/icon_thumbnail"]')`
3. Fallback legacy picker: `$$('android=new UiSelector().resourceId("com.google.android.documentsui:id/icon_thumb")')`
4. Confirm preview popup: `attachmentPostPopup_view_text_02`

### Sync Strategy

The project uses `browser.pause(ms)` for synchronisation rather than polling. Explicit waits from `wait.utils.js` are used when an element's appearance/disappearance signals readiness (loaders, banners).

### Device Configuration

Configured in `wdio.conf.js` capabilities:
- Device: `R58M81ZYXKH` (Android 11)
- App package: `com.certisgroup.mifmv2`
- `noReset: true` — app state is preserved between runs; `session.loginIfNeeded()` handles auth state

### Reporting

Allure results go to `reports/allure-results/`. Each test uses `allure.addFeature()`, `allure.addSeverity()`, and `allure.addTag()` from `@wdio/allure-reporter`. Screenshots are captured automatically on test failure via the `afterTest` hook in `wdio.conf.js`.
