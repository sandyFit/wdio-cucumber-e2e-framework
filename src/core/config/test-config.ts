export function getBaseUrl(): string {
    return browser.options?.baseUrl ?? 'https://practicesoftwaretesting.com';
}


export function getDefaultTimeout(): number {
    return browser.options?.waitforTimeout ?? 10_000;
}
