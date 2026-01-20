import { AccountPage } from '../account/account.page';
import { logger } from '../../../core/logger/logger';

export class FavoritesPage extends AccountPage {
    private selectors = {
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
    async getFavoriteProducts(): Promise<any> {
        const products = (await this.favoriteProductCards) as any;
        logger.info(`Found ${products.length} favorite products`);
        return products;
    }

    async getFavoriteProductsCount(): Promise<number> {
        const products = await this.getFavoriteProducts();
        return products.length;
    }

    // === LOADERS ===
    async waitForLoaded(): Promise<void> {
        await this.waitForUrlToContain('/favorites', 10000);

        await browser.waitUntil(
            async () => {
                const products = (await this.favoriteProductCards) as any;
                return products.length > 0 && (await this.isElementDisplayed(products[0]));
            },
            {
                timeout: 10000,
                timeoutMsg: 'Favorites page did not load favorite products in time',
            }
        );
    }

    // === NAVIGATION ===
    async open(): Promise<void> {
        await this.navigateTo('/account/favorites');
        await this.waitForPageLoad();
        await this.waitForLoaded();
    }

    // === CHECKERS ===
    async isOnFavoritesPage(): Promise<boolean> {
        return await super.isOnFavoritesSection();
    }
}
