export async function waitForUrlToContain(path, timeout = 10000) {
  return await browser.waitUntil(
    async () => (await browser.getUrl()).includes(path),
    {
      timeout,
      timeoutMsg: `URL did not contain "${path}" within ${timeout}ms`,
    },
  );
}

export async function waitForElementVisible(element, timeout = 5000) {
  await element.waitForDisplayed({
    timeout,
    timeoutMsg: `Element not visible within ${timeout}ms`,
  });
}

export async function waitForElementClickable(element, timeout = 5000) {
  await element.waitForClickable({
    timeout,
    timeoutMsg: `Element not clickable within ${timeout}ms`,
  });
}

export async function waitForElementExist(element, timeout = 5000) {
  await element.waitForExist({
    timeout,
    timeoutMsg: `Element does not exist within ${timeout}ms`,
  });
}

export async function waitForTextInElement(
  element,
  expectedText,
  timeout = 5000,
) {
  await browser.waitUntil(
    async () => {
      const text = await element.getText();
      return text.includes(expectedText);
    },
    {
      timeout,
      timeoutMsg: `Text "${expectedText}" not found in element within ${timeout}ms`,
    },
  );
}

export async function waitForElementsCount(
  getElementsFn,
  minCount = 1,
  timeout = 5000,
) {
  return await browser.waitUntil(
    async () => (await getElementsFn()).length >= minCount,
    {
      timeout,
      timeoutMsg: `Expected at least ${minCount} elements, but did not load in ${timeout}ms`,
    },
  );
}
