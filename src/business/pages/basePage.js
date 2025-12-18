import * as waitHelper from '../../core/browser/wait-helper.js';
import * as browserManager from '../../core/browser/browser-helper.js';
import { logger } from '../../core/logger/logger.js';
import { getDefaultTimeout } from '../../core/config/test-config.js';
import { HeaderComponent } from '../components/common/header.component.js';

export class BasePage {
    constructor() {
        this.header = new HeaderComponent();
    }

    // ========================================
    // NAVIGATION
    // ========================================

    async navigateTo(path) {
        await browserManager.navigateTo(path);
    }

    async getCurrentUrl() {
        return await browserManager.getCurrentUrl();
    }

    async waitForUrlToContain(path, timeout = getDefaultTimeout()) {
        return waitHelper.waitForUrlToContain(path, timeout);
    }

    // ========================================
    // ELEMENT INTERACTIONS
    // ========================================

    async clickElement(element, name = 'element') {
        logger.info(`Click → ${name}`);
        await waitHelper.waitForElementClickable(element);
        await element.click();
    }

    async scrollToElement(element, name = 'element', options = {}) {
        logger.info(`Scrolling into view: ${name}`);
        try {
            await element.scrollIntoView(options);
        } catch (error) {
            logger.warn(`Failed to scroll to ${name}, retrying...`);
            await this.pause(500, 'waiting before scroll retry');
            await element.scrollIntoView(options);
        }
    }

    // ========================================
    // FORM INPUTS
    // ========================================

    async fillInput(element, value, name = 'input') {
        logger.info(`Typing into ${name}: ${value}`);
        await waitHelper.waitForElementVisible(element);
        await element.setValue(value);
    }

    async clearAndFillInput(element, value, name = 'input') {
        logger.info(`Clearing & typing into ${name}: ${value}`);

        await element.waitForDisplayed({ timeout: 5000 });
        await element.waitForEnabled({ timeout: 5000 });
        await this.pause(100, 'allowing element to be ready for input');

        await element.clearValue();
        await element.setValue(value);
    }

    async fillField(element, value, name = '') {
        const tag = await element.getTagName();
        if (tag === 'select') {
            await element.selectByVisibleText(value);
            logger.info(`Selecting ${name}: ${value}`);
        } else {
            await this.clearAndFillInput(element, value, name);
        }
    }

    async setInputValueDirectly(element, value, name = 'input') {
        logger.info(`Typing into ${name} directly via JS: ${value}`);
        await browser.execute((el, val) => {
            el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }, element, value);
    }

    // ========================================
    // ELEMENT STATE CHECKS
    // ========================================

    async isElementDisplayed(element) {
        try {
            return await element.isDisplayed();
        } catch {
            return false;
        }
    }

    async waitForElementExist(element, timeout = 1000) {
        try {
            await waitHelper.waitForElementExist(element, timeout);
            return true;
        } catch {
            return false;
        }
    }

    // ========================================
    // TEXT OPERATIONS
    // ========================================

    async getElementText(element, name = 'element') {
        await element.scrollIntoView();
        await waitHelper.waitForElementVisible(element, 5000);
        const text = await element.getText();
        logger.info(`Text retrieved from ${name}: "${text}"`);
        return text;
    }

    async waitAndGetText(element, name = 'element', timeout = getDefaultTimeout()) {
        await waitHelper.waitForElementVisible(element, timeout);
        const text = await element.getText();
        logger.info(`Wait + Text from ${name}: "${text}"`);
        return text;
    }

    // ========================================
    // PAGE STATE
    // ========================================

    async waitForPageLoad(timeout) {
        timeout = timeout || getDefaultTimeout();

        logger.info('Waiting for page load...');
        await browser.waitUntil(
            async () => (await browser.execute(() => document.readyState)) === 'complete',
            {
                timeout,
                timeoutMsg: `Page did not reach 'complete' readyState within ${timeout}ms`
            }
        );
        logger.info('Page fully loaded');
    }

    async waitForAngular() {
        logger.info('Waiting for Angular to stabilize');
        await browser.execute(() => {
            return new Promise((resolve) => {
                if (window.getAllAngularTestabilities) {
                    const testabilities = window.getAllAngularTestabilities();
                    let count = testabilities.length;
                    if (count === 0) {
                        resolve();
                        return;
                    }
                    testabilities.forEach((testability) => {
                        testability.whenStable(() => {
                            count--;
                            if (count === 0) {
                                resolve();
                            }
                        });
                    });
                } else {
                    resolve();
                }
            });
        });
        await this.pause(500, 'allowing Angular to stabilize');
        logger.info('✅ Angular stabilized');
    }

    // ========================================
    // UTILITIES
    // ========================================

    async pause(ms, reason = '') {
        if (reason) logger.info(`Pausing ${ms}ms: ${reason}`);
        await browser.pause(ms);
    }

    async executeScript(script, ...args) {
        return await browserManager.executeScript(script, ...args);
    }
}
