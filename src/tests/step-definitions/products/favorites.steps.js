import { Given, When, Then } from '@wdio/cucumber-framework';
import { ProductDetailsPage } from '../../../business/pages/products/product-details.page.js';
import { FavoritesPage } from '../../../business/pages/products/favorites.page.js';
import { logger } from '../../../core/logger/logger.js';
import { assertMinimumElements } from '../../assertions/assertions.js';
import { expect } from 'chai';

const productDetailsPage = new ProductDetailsPage();
const favoritesPage = new FavoritesPage();

Given('the user is logged in', async function () {
    logger.info('User already logged in via Before hook');
    expect(this.currentUser).to.exist;
});

Given('is in the Product Details page', async () => {
    logger.info('Navigating to Product Details page');
    await productDetailsPage.open();
});

When('the user clicks the Add to Favourites button', async () => {
    await productDetailsPage.addToFavoritesAndCheck();
});


Then('the product should be added to the user\'s favorites list', async () => {
    await favoritesPage.open();

    const items = await favoritesPage.favoriteProductCards;

    logger.info(`Checking favorites list - found ${items.length} items`);

    assertMinimumElements(items, 1, 'favorite products');

    logger.info(`✅ Verified ${items.length} favorite product(s) in list`);
});

Then('the product should appear in the favorites page', async () => {
    logger.info('Verifying product appears in favorites page');

    const isOnFavoritesPage = await favoritesPage.isOnFavoritesPage();
    expect(isOnFavoritesPage).to.be.true;

    const favoriteProducts = await favoritesPage.getFavoriteProducts();

    assertMinimumElements(favoriteProducts, 1, 'favorite products');

    logger.info(`✅ Verified: ${favoriteProducts.length} product(s) in favorites page`);
});
