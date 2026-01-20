import { Given, When, Then } from '@wdio/cucumber-framework';
import { ProductDetailsPage } from '../../../business/pages/products/product-details.page';
import { FavoritesPage } from '../../../business/pages/products/favorites.page';
import { assertMinimumElements } from '../../assertions/assertions';
import { expect } from 'chai';

const productDetailsPage = new ProductDetailsPage();
const favoritesPage = new FavoritesPage();

Given('the user is logged in', async function () {
    expect(this.currentUser).to.exist;
});

Given('is in the Product Details page', async function () {
    await productDetailsPage.open();
});

When('the user clicks the Add to Favourites button', async function () {
    await productDetailsPage.addToFavoritesAndCheck();
});

Then("the product should be added to the user's favorites list", async function () {
    await favoritesPage.open();

    await favoritesPage.pause(2000);

    const favoriteProducts = await favoritesPage.getFavoriteProducts();

    assertMinimumElements(favoriteProducts, 1, 'favorite products');
});

Then('the product should appear in the favorites page', async function () {
    const isOnFavoritesPage = await favoritesPage.isOnFavoritesPage();
    expect(isOnFavoritesPage).to.be.true;

    const favoriteProducts = await favoritesPage.getFavoriteProducts();

    const productsArray = Array.isArray(favoriteProducts) ? favoriteProducts : await favoriteProducts;

    assertMinimumElements(productsArray, 1, 'favorite products');

});
