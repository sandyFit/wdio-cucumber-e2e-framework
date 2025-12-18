import { BasePage } from '../basePage.js';
import { logger } from '../../../core/logger/logger.js';
import { waitForElementsCount } from '../../../core/browser/wait-helper.js'; 

export class ProductDetailsPage extends BasePage {

    selectors = {
        title: '[data-test="product-name"]',
        price: '[data-test="unit-price"]',
        description: '[data-test="product-description"]',
        category: 'span[aria-label="category"]',
        impact: '[data-test="co2-rating-badge"]',
        addToFavoritesButton: '[data-test="add-to-favorites"]',
        productCards: '[data-test^="product-"]',
        addToCartButton: '[data-test="add-to-cart"]'
    };

    // === ELEMENT GETTERS ===
    get titleEl() { return $(this.selectors.title); }
    get priceEl() { return $(this.selectors.price); }
    get descriptionEl() { return $(this.selectors.description); }
    get categoryEl() { return $(this.selectors.category); }
    get impactEl() { return $(this.selectors.impact); }
    get addToFavoritesButtonEl() { return $(this.selectors.addToFavoritesButton); }
    get productCards() { return $$(this.selectors.productCards); }
    get addToCartButtonEl() { return $(this.selectors.addToCartButton); }

    // === LOADING ===
    async waitForLoaded() {
        logger.info('Waiting for Product Details page to load');
        await this.titleEl.waitForDisplayed({ timeout: 10000 });
        logger.info('Product Details page loaded successfully');
    }

    // === PRODUCT INFO ===
    async getProductInfo() {
        return {
            title: await this.getElementText(this.titleEl, 'Product Name'),
            price: await this.getElementText(this.priceEl, 'Product Price'),
            description: await this.getElementText(this.descriptionEl, 'Product Description'),
            category: await this.getElementText(this.categoryEl, 'Product Category'),
            impact: await this.getElementText(this.impactEl, 'Environmental Impact')
        };
    }

    // === NAVIGATION ===
    async open() {
        logger.info("Opening Product Details page from Home");

        await this.navigateTo('/');

        await waitForElementsCount(() => this.productCards, 1, 10000);

        logger.info("Home page loaded — products found");

        const firstProduct = (await this.productCards)[0];
        await firstProduct.scrollIntoView();
        await firstProduct.$('[data-test="product-name"]').click();

        await this.waitForLoaded();
    }

    async openById(productId) {
        logger.info(`Opening Product Details page for product ID: ${productId}`);
        await this.navigateTo(`/product/${productId}`);
        await this.waitForPageLoad();
        await this.waitForLoaded();
    }

    // === ACTIONS ===
    async addToCart() {
        logger.info('Adding product to cart');
        await this.clickElement(this.addToCartButtonEl, 'Add to Cart button');
        await this.pause(1500, 'waiting for toast notification and cart badge update');
    }

    async addToFavorites() {
        logger.info('Adding product to favorites');
        await this.clickElement(this.addToFavoritesButtonEl, 'Add to Favorites button');
        await this.pause(1500, 'waiting for toast notification and favorites update');
    }

    async addToFavoritesAndCheck() {
        logger.info('Adding product to favorites');
        await this.addToFavorites();

        // Wait for any UI feedback or toast message
        await this.pause(1000, 'waiting for feedback message');

        // Check if product was already in favorites
        const bodyText = await this.getElementText($('body'), 'Page body');
        const alreadyInFavorites = bodyText.toLowerCase().includes('already') ||
            bodyText.toLowerCase().includes('existe');

        if (alreadyInFavorites) {
            logger.info('ℹ️ Product is already in favorites list');
            return false;
        } else {
            logger.info('✅ Product added to favorites');
            return true;
        }
    }


    async isOnProductDetailsPage() {
        const url = await this.getCurrentUrl();
        return url.includes('/product/');
    }
}
