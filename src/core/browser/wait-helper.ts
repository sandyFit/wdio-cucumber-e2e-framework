export async function waitForUrlToContain(
    path: string, 
    timeout: number = 10_000
): Promise<boolean> {
    return await browser.waitUntil(async () => (await browser.getUrl()).includes(path), {
        timeout,
        timeoutMsg: `URL did not contain "${path}" within ${timeout}ms`,
    });
}

export async function waitForElementVisible(
    element: WebdriverIO.Element | (() => Promise<WebdriverIO.Element>),
    timeout = 5_000
) {
    const el = typeof element === 'function' ? await element() : element;
    await el.waitForDisplayed({ timeout });
}


export async function waitForElementClickable(
    element: WebdriverIO.Element,
    timeout: number = 5_000
): Promise<void> {
    await element.waitForClickable({
        timeout,
        timeoutMsg: `Element not clickable within ${timeout}ms`,
    });
}

export async function waitForElementExist(
    element: WebdriverIO.Element,
    timeout: number = 5_000
): Promise<void> {
    await element.waitForExist({
        timeout,
        timeoutMsg: `Element does not exist within ${timeout}ms`,
    });
}

export async function waitForTextInElement(
    element: WebdriverIO.Element,
    expectedText: string,
    timeout: number = 5_000
): Promise<void> {
    await browser.waitUntil(
        async () => {
            const text = await element.getText();
            return text.includes(expectedText);
        },
        {
            timeout,
            timeoutMsg: `Text "${expectedText}" not found in element within ${timeout}ms`,
        }
    );
}

export async function waitForElementsCount(
    getElementsFn: () => Promise<WebdriverIO.ElementArray>,
    minCount: number = 1,
    timeout: number = 5_000
): Promise<boolean> {
    return await browser.waitUntil(
        async () => (await getElementsFn()).length >= minCount,
        {
            timeout,
            timeoutMsg: `Expected at least ${minCount} elements, but did not load in ${timeout}ms`,
        }
    );
}
