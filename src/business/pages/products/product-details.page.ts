import { BasePage } from '../basePage';
import { logger } from '../../../core/logger/logger';
import { waitForElementsCount } from '../../../core/browser/wait-helper';

type ElementType = any;

interface ProductInfo {
    title: string;
    price: string;
    description: string;
    category: string;
    impact: string;
}

export class ProductDetailsPage extends BasePage {
    private selectors = {
        title: '[data-test="product-name"]',
        price: '[data-test="unit-price"]',
        description: '[data-test="product-description"]',
        category: 'span[aria-label="category"]',
        impact: '[data-test="co2-rating-badge"]',
        addToFavoritesButton: '[data-test="add-to-favorites"]',
        productCards: '[data-test^="product-"]',
        addToCartButton: '[data-test="add-to-cart"]',
        toastContainer: '#toast-container'
    };

    // === ELEMENT GETTERS ===
    get titleEl(): ElementType {
        return $(this.selectors.title);
    }

    get priceEl(): ElementType {
        return $(this.selectors.price);
    }

    get descriptionEl(): ElementType {
        return $(this.selectors.description);
    }

    get categoryEl(): ElementType {
        return $(this.selectors.category);
    }

    get impactEl(): ElementType {
        return $(this.selectors.impact);
    }

    get addToFavoritesButtonEl(): ElementType {
        return $(this.selectors.addToFavoritesButton);
    }

    get productCards() {
        return $$(this.selectors.productCards);
    }


    get addToCartButtonEl(): ElementType {
        return $(this.selectors.addToCartButton);
    }
    
    get toastContainerEl(): ElementType {
        return $(this.selectors.toastContainer);
    }

    // === LOADING ===
    async waitForLoaded(): Promise<void> {
        await this.titleEl.waitForDisplayed({ timeout: 10000 });
    }

    // === PRODUCT INFO ===
    async getProductInfo(): Promise<ProductInfo> {
        return {
            title: await this.getElementText(this.titleEl),
            price: await this.getElementText(this.priceEl),
            description: await this.getElementText(this.descriptionEl),
            category: await this.getElementText(this.categoryEl),
            impact: await this.getElementText(this.impactEl),
        };
    }

    // === NAVIGATION ===
    async open(): Promise<void> {
        await this.navigateTo('/');

        await waitForElementsCount(() => this.productCards, 1, 10000);

        const firstProduct = (this.productCards)[0];
        await firstProduct.scrollIntoView();
        await firstProduct.$('[data-test="product-name"]').click();

        await this.waitForLoaded();
    }

    async openById(productId: string | number): Promise<void> {
        logger.info(`Opening Product Details page for product ID: ${productId}`);
        await this.navigateTo(`/product/${productId}`);
        await this.waitForPageLoad();
        await this.waitForLoaded();
    }

    // === ACTIONS ===
    async addToCart(): Promise<void> {
        await this.clickElement(this.addToCartButtonEl);
        await this.pause(1500);
        logger.info('Product added successfully');
    }

    async addToFavorites(): Promise<void> {
        await this.clickElement(this.addToFavoritesButtonEl);
        await this.pause(1500);
        logger.info('Product added to favorites');
    }

    async addToFavoritesAndCheck(): Promise<boolean> {
        await this.addToFavorites();
        await this.pause(1000);

        // Check if product was already in favorites
        const bodyText = await this.getElementText($('body'));
        const alreadyInFavorites =
            bodyText.toLowerCase().includes('already') || bodyText.toLowerCase().includes('existe');

        if (alreadyInFavorites) {
            logger.info('Product is already in favorites list');
            return false;
        } else {
            logger.info('✅ Product added to favorites');
            return true;
        }
    }

    async isOnProductDetailsPage(): Promise<boolean> {
        const url = await this.getCurrentUrl();
        return url.includes('/product/');
    }
}
