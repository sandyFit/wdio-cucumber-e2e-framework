import { logger } from '../logger/logger.js';

export async function navigateTo(path) {
    const fullUrl = path.startsWith('http')
        ? path
        : `${browser.options.baseUrl}${path}`;

    logger.info(`Navigating to: ${fullUrl}`);
    await browser.url(fullUrl);
}

export async function getCurrentUrl() {
    const url = await browser.getUrl();
    logger.info(`Current URL: ${url}`);
    return url;
}

export async function executeScript(script, ...args) {
    return await browser.execute(script, ...args);
}

export async function takeScreenshot(filename) {
    logger.info(`Taking screenshot: ${filename}`);
    return await browser.saveScreenshot(`./screenshots/${filename}.png`);
}


