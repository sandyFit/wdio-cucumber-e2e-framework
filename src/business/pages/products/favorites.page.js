import { AccountPage } from '../account/account.page.js';
import { logger } from '../../../core/logger/logger.js';

export class FavoritesPage extends AccountPage {
    selectors = {
        favoriteProductCard: '[data-test^="favorite-"]',
        removeFavoriteButton: '[data-test="delete"]',
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
        await this.waitForUrlToContain('/favorites', 10000);

        await browser.waitUntil(
            async () => {
                const products = await this.favoriteProductCards;
                return products.length > 0 && (await this.isElementDisplayed(products[0]));
            },
            {
                timeout: 10000,
                timeoutMsg: 'Favorites page did not load favorite products in time',
            }
        );
    }

    // === NAVIGATION ===
    async open() {
        await this.navigateTo('/account/favorites');
        await this.waitForPageLoad();
        await this.waitForLoaded();
    }

    // === CHECKERS ===
    async isOnFavoritesPage() {
        return await super.isOnFavoritesSection();
    }
}
