import { BasePage } from '../basePage.js';
import { logger } from '../../../core/logger/logger.js';
import { waitForElementsCount } from '../../../core/browser/wait-helper.js';

export class HomePage extends BasePage {
    selectors = {
        filtersButton: '[data-test="filters"]',
        searchInput: '[data-test="search-query"]',
        searchButton: '[data-test="search-submit"]',
        productCards: '[data-test^="product-"]',
        productName: '[data-test="product-name"]'
    };

    // === GETTERS ===
    get filtersButton() {
        return $(this.selectors.filtersButton);
    }

    get searchInput() {
        return $(this.selectors.searchInput);
    }

    get searchButton() {
        return $(this.selectors.searchButton);
    }

    get productCards() {
        return $$(this.selectors.productCards);
    }

    // === NAVIGATION ===
    async open() {
        await this.navigateTo('/');
        await this.waitForPageLoad();
        await waitForElementsCount(() => this.productCards, 1, 10000);

        const products = await this.productCards;
        await products[0].waitForDisplayed({ timeout: 10000 });
    }

    // === ACTIONS ===
    async searchProduct(query) {
        logger.info(`Searching product: ${query}`);

        const filtersVisible = await this.isElementDisplayed(this.filtersButton);
        if (filtersVisible) {
            await this.clickElement(this.filtersButton);
        }

        const searchInput = await this.searchInput;
        await this.setInputValueDirectly(searchInput, query, 'Search Input');

        await this.pause(500);

        const searchBtn = await this.searchButton;

        await searchBtn.waitForExist({ timeout: 5000 });
        await this.scrollToElement(searchBtn);
        await this.pause(300);

        try {
            await this.clickElement(searchBtn);
        } catch (clickError) {
            logger.info('⚠️ Normal click failed, using JavaScript click', clickError);
            await this.executeScript((el) => el.click(), searchBtn);
        }
    }

    async waitForSearchResults() {
        await this.pause(1500);

        await waitForElementsCount(() => this.getProducts(), 1, 10000);

        const products = await this.getProducts();
        logger.info(`Found ${products.length} products after search`);

        if (products.length > 0) {
            try {
                await products[0].waitForDisplayed({ timeout: 5000 });
            } catch (error) {
                logger.error('⚠️ First product visibility check failed, but continuing', error);
            }
        }
    }

    async getProducts() {
        return await this.productCards;
    }

    async getProductName(productElement) {
        const nameElement = await productElement.$(this.selectors.productName);

        const exists = await this.waitForElementExist(nameElement, 1000);

        if (!exists) {
            return '';
        }

        try {
            const name = await nameElement.getText();
            if (name && name.trim()) {
                return name.trim();
            }
        } catch {
            // Silent fail, try next method
        }

        try {
            const name = await nameElement.getAttribute('textContent');
            if (name && name.trim()) {
                return name.trim();
            }
        } catch {
            // Silent fail
        }

        return '';
    }

    async openProductDetails(productName) {
        const productCards = await this.productCards;

        for (let i = 0; i < productCards.length; i++) {
            const card = productCards[i];

            try {
                await this.scrollToElement(card, `Product Card ${i}`);
                await this.pause(100);

                const titleElement = await card.$(this.selectors.productName);

                const exists = await this.waitForElementExist(titleElement, 500);

                if (!exists) {
                    continue;
                }

                const title = await titleElement.getText();

                if (title.toLowerCase().includes(productName.toLowerCase())) {
                    await this.clickElement(titleElement);
                    return;
                }
            } catch {
                continue;
            }
        }

        throw new Error(`Product "${productName}" not found in ${productCards.length} products`);
    }
}
