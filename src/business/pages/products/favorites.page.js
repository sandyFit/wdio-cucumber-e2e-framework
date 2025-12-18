import { AccountPage } from '../account/account.page.js';
import { logger } from '../../../core/logger/logger.js';

export class FavoritesPage extends AccountPage {

    selectors = {
        favoriteProductCard: '[data-test^="favorite-"]',
        removeFavoriteButton: '[data-test="delete"]'
    };

    // === GETTERS ===
    get favoriteProductCards() {
        return $$(this.selectors.favoriteProductCard);
    }

    get removeFavoriteButtons() {
        return $$(this.selectors.removeFavoriteButton);
    }


    // === DATA GETTERS ===
    async getFavoriteProducts() {
        logger.info('Getting list of favorite products');
        const products = await this.favoriteProductCards;
        logger.info(`Found ${products.length} favorite products`);
        return products;
    }

    async getFavoriteProductsCount() {
        const products = await this.getFavoriteProducts();
        return products.length;
    }

    // === LOADERS ===
    async waitForLoaded() {
        logger.info('Waiting for Favorites page to load');

        await this.waitForUrlToContain('/favorites', 10000);

        const loaded = await browser.waitUntil(
            async () => {
                const products = await this.favoriteProductCards;
                return products.length > 0 && await this.isElementDisplayed(products[0]);
            },
            {
                timeout: 10000,
                timeoutMsg: 'Favorites page did not load favorite products in time'
            }
        );

        if (loaded) {
            logger.info('✅ Favorites page loaded with products');
        }
    }



    // === NAVIGATION ===
    async open() {
        logger.info('Opening Favorites page');

        await this.navigateTo('/account/favorites');
        await this.waitForPageLoad();
        await this.waitForLoaded();
    }

    // === CHECKERS ===
    async isOnFavoritesPage() {
        return await super.isOnFavoritesSection();
    }

    
}
