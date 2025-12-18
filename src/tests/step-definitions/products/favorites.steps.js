import { Given, When, Then } from '@wdio/cucumber-framework';
import { ProductDetailsPage } from '../../../business/pages/products/product-details.page.js';
import { FavoritesPage } from '../../../business/pages/products/favorites.page.js';
import { logger } from '../../../core/logger/logger.js';
import { assertMinimumElements } from '../../assertions/assertions.js';
import { expect } from 'chai';

const productDetailsPage = new ProductDetailsPage();
const favoritesPage = new FavoritesPage();

Given('the user is logged in', async function () {
    expect(this.currentUser).to.exist;
});

Given('is in the Product Details page', async () => {
    await productDetailsPage.open();
});

When('the user clicks the Add to Favourites button', async () => {
    await productDetailsPage.addToFavoritesAndCheck();
});


Then('the product should be added to the user\'s favorites list', async () => {
    await favoritesPage.open();

    const items = await favoritesPage.favoriteProductCards;

    assertMinimumElements(items, 1, 'favorite products');

});

Then('the product should appear in the favorites page', async () => {
    const isOnFavoritesPage = await favoritesPage.isOnFavoritesPage();
    expect(isOnFavoritesPage).to.be.true;

    const favoriteProducts = await favoritesPage.getFavoriteProducts();

    assertMinimumElements(favoriteProducts, 1, 'favorite products');

    logger.info(`✅ Verified: ${favoriteProducts.length} product(s) in favorites page`);
});
