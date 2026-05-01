import { BasePage } from '../basePage';
import { logger } from '../../../core/logger/logger';
import { waitForElementsCount } from '../../../core/browser/wait-helper';

type ElementType = any;

export class HomePage extends BasePage {
    private selectors = {
        filtersButton: '[data-test="filters"]',
        searchInput: '[data-test="search-query"]',
        searchButton: '[data-test="search-submit"]',
        productCards: '[data-test^="product-"]',
        productName: [
            '[data-test="product-name"]',
            '.product-title',
            '.product-name',
            'h3',
            'h4',
            'a[title]'
        ],
    };

    // === GETTERS ===
    get filtersButton(): ElementType {
        return $(this.selectors.filtersButton);
    }

    get searchInput(): ElementType {
        return $(this.selectors.searchInput);
    }

    get searchButton(): ElementType {
        return $(this.selectors.searchButton);
    }

    // === NAVIGATION ===
    async open(): Promise<void> {
        await this.navigateTo('/');
        await this.waitForPageLoad();
        await waitForElementsCount(async () => await $$(this.selectors.productCards), 1, 20_000);

        const products = $$(this.selectors.productCards);
        await products[0].waitForDisplayed({ timeout: 15_000 });
    }



    // === ACTIONS ===
    async searchProduct(query: string): Promise<void> {
        logger.info(`Searching product: ${query}`);

        const filtersVisible = await this.isElementDisplayed(this.filtersButton);
        if (filtersVisible) {
            await this.clickElement(this.filtersButton);
        }

        const searchInput = this.searchInput;
        await this.setInputValueDirectly(searchInput, query);

        await this.pause(500);

        const searchBtn = this.searchButton;

        await searchBtn.waitForExist({ timeout: 5000 });
        await this.scrollToElement(searchBtn);
        await this.pause(300);

        try {
            await this.clickElement(searchBtn);
        } catch (clickError) {
            const errorMsg = clickError instanceof Error ? clickError.message : String(clickError);
            logger.info(`⚠️ Normal click failed, using JavaScript click: ${errorMsg}`);
            await this.executeScript((el: any) => el.click(), searchBtn);
        }
    }

    

    async waitForSearchResults(): Promise<void> {
        await this.pause(1500);

        await waitForElementsCount(() => this.getProducts(), 1, 10_000);

        const products = this.getProducts();

        const productCount = await products.length;

        logger.info(`Found ${productCount} products after search`);

        if (productCount > 0) {
            try {
                await products[0].waitForDisplayed({ timeout: 5000 });
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : String(error);
                logger.error(`⚠️ First product visibility check failed, but continuing: ${errorMsg}`);
            }
        }
    }

    getProducts() {
        return $$(this.selectors.productCards);
    }

    async getUniqueProducts(): Promise<WebdriverIO.Element[]> {
        return [...(this.getProducts())];
    }



    async getProductName(productElement: ElementType): Promise<string> {
        for (const selector of this.selectors.productName) {
            let el: WebdriverIO.Element;

            try {
                el = await productElement.$(selector);
            } catch {
                continue;
            }

            if (!(await el.isExisting())) continue;

            const text = (await el.getText()).trim();
            if (text) return text;

            const titleAttr = await el.getAttribute('title');
            if (titleAttr?.trim()) return titleAttr.trim();

            const aria = await el.getAttribute('aria-label');
            if (aria?.trim()) return aria.trim();

            try {
                const span = el.$('span');
                if (await span.isExisting()) {
                    const spanText = (await span.getText()).trim();
                    if (spanText) return spanText;
                }
            } catch {
                continue;
            }
        }

        return '';
    }


    async openProductDetails(productName: string): Promise<void> {
        const productCards = this.getProducts();
        const productCount = await productCards.length;

        for (let i = 0; i < productCount; i++) {
            const card = productCards[i];

            try {
                await this.scrollToElement(card);
                await this.pause(100);

                const title = await this.getProductName(card);

                if (!title) continue;

                if (title.toLowerCase().includes(productName.toLowerCase())) {
                    await this.clickElement(card);
                    return;
                }
            } catch {
                continue;
            }
        }

        throw new Error(`Product "${productName}" not found in ${productCards.length} products`);
    }


}
