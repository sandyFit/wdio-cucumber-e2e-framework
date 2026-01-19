export async function navigateTo(path: string): Promise<void> {
    const fullUrl = path.startsWith('http') ? path : `${browser.options.baseUrl}${path}`;
    await browser.url(fullUrl);
}

export async function getCurrentUrl(): Promise<string> {
    const url = await browser.getUrl();
    return url;
}

export async function executeScript<T>(
    script: string | ((...args: any[]) => unknown),
    ...args: unknown[]
): Promise<T> {
    return await browser.execute(script, ...args) as T;
}

export async function takeScreenshot(filename: string): Promise<Buffer> {
    return await browser.saveScreenshot(`./screenshots/${filename}.png`);
}
