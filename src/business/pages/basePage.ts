import * as waitHelper from '../../core/browser/wait-helper';
import * as browserManager from '../../core/browser/browser-helper';
import { logger } from '../../core/logger/logger';
import { getDefaultTimeout } from '../../core/config/test-config';
import { HeaderComponent } from '../components/common/header.component';


type ElementType = any;

export class BasePage {
    protected readonly header: HeaderComponent;

    constructor() {
        this.header = new HeaderComponent();
    }

    // ========================================
    // NAVIGATION
    // ========================================

    async navigateTo(path: string): Promise<void> {
        await browserManager.navigateTo(path);
    }

    async getCurrentUrl(): Promise<string> {
        return browserManager.getCurrentUrl();
    }

    async waitForUrlToContain(
        path: string,
        timeout: number = getDefaultTimeout()
    ): Promise<boolean> {
        return waitHelper.waitForUrlToContain(path, timeout);
    }

    // ========================================
    // ELEMENT INTERACTIONS
    // ========================================

    async clickElement(element: ElementType): Promise<void> {
        await waitHelper.waitForElementClickable(element);
        await element.click();
    }

    async scrollToElement(
        element: ElementType,
        options: ScrollIntoViewOptions = {}
    ): Promise<void> {
        try {
            await element.scrollIntoView(options);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            logger.error(`Failed to scroll: ${errorMsg}`); 
            await this.pause(500);
            await element.scrollIntoView(options);
        }
    }

    // ========================================
    // FORM INPUTS
    // ========================================

    async fillInput(
        element: ElementType,
        value: string
    ): Promise<void> {
        await waitHelper.waitForElementVisible(element);
        await element.setValue(value);
    }

    async clearAndFillInput(
        element: ElementType,
        value: string
    ): Promise<void> {
        await element.waitForDisplayed({ timeout: 5_000 });
        await element.waitForEnabled({ timeout: 5_000 });
        await this.pause(100);

        await element.clearValue();
        await element.setValue(value);
    }

    async fillField(
        element: ElementType,
        value: string
    ): Promise<void> {
        const tag = await element.getTagName();
        if (tag === 'select') {
            await element.selectByVisibleText(value);
        } else {
            await this.clearAndFillInput(element, value);
        }
    }

    async setInputValueDirectly(
        element: ElementType,
        value: string
    ): Promise<void> {
        await browser.execute(
            (el, val) => {
                if (el && 'value' in el) {
                    (el as any).value = val;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                }
            },
            element,
            value
        );
    }

    // ========================================
    // ELEMENT STATE CHECKS
    // ========================================

    async isElementDisplayed(
        element: ElementType
    ): Promise<boolean> {
        try {
            return await element.isDisplayed();
        } catch {
            return false;
        }
    }

    async waitForElementExist(
        element: ElementType,
        timeout: number = 1_000
    ): Promise<boolean> {
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

    async getElementText(
        element: ElementType
    ): Promise<string> {
        await element.scrollIntoView();
        await waitHelper.waitForElementVisible(element, 5_000);
        return element.getText();
    }

    async waitAndGetText(
        element: ElementType,
        timeout: number = getDefaultTimeout()
    ): Promise<string> {
        await waitHelper.waitForElementVisible(element, timeout);
        return element.getText();
    }

    // ========================================
    // PAGE STATE
    // ========================================

    async waitForPageLoad(
        timeout: number = getDefaultTimeout()
    ): Promise<void> {
        await browser.waitUntil(
            async () =>
                (await browser.execute(() => document.readyState)) === 'complete',
            {
                timeout,
                timeoutMsg: `Page did not reach 'complete' readyState within ${timeout}ms`,
            }
        );
    }

    async waitForAngular(): Promise<void> {
        await browser.execute(() => {
            return new Promise<void>((resolve) => {
                const w = window as any;

                if (w.getAllAngularTestabilities) {
                    const testabilities = w.getAllAngularTestabilities();
                    let count = testabilities.length;

                    if (count === 0) {
                        resolve();
                        return;
                    }

                    testabilities.forEach((testability: any) => {
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

        await this.pause(500);
    }

    // ========================================
    // UTILITIES
    // ========================================

    async pause(ms: number): Promise<void> {
        await browser.pause(ms);
    }

    async executeScript<T>(
        script: string | ((...args: unknown[]) => unknown),
        ...args: unknown[]
    ): Promise<T> {
        return browserManager.executeScript(script, ...args) as T;
    }
}
