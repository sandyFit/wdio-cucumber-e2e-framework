/**
 * Get base URL from WebDriver config
 */
export function getBaseUrl() {
    return browser.config.baseUrl || 'https://practicesoftwaretesting.com';
}

/**
 * Get default timeout
 */
export function getDefaultTimeout() {
    // fallback to 10000 if browser or browser.config is not ready
    return (browser?.config?.waitforTimeout) || 10000;
}


