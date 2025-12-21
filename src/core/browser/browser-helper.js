export async function navigateTo(path) {
    const fullUrl = path.startsWith('http') ? path : `${browser.options.baseUrl}${path}`;
    await browser.url(fullUrl);
}

export async function getCurrentUrl() {
    const url = await browser.getUrl();
    return url;
}

export async function executeScript(script, ...args) {
    return await browser.execute(script, ...args);
}

export async function takeScreenshot(filename) {
    return await browser.saveScreenshot(`./screenshots/${filename}.png`);
}
