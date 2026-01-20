import { Given, When, Then } from '@wdio/cucumber-framework';
import { HomePage } from '../../../business/pages/home/home.page';
import { ProductDetailsPage } from '../../../business/pages/products/product-details.page';
import { assertNotEmptyFields } from '../../assertions/assertions';
import { expect } from 'chai';

const homePage = new HomePage();
const productDetailsPage = new ProductDetailsPage();

Given(/^the user is on the Home page$/, async function () {
    await homePage.open();
});

When(/^the user clicks on a specific product name or image$/, async function () {
    const products = homePage.getProducts();
    const productArray = await products; // Convert ChainablePromiseArray to array
    const firstProduct = productArray[0];

    await firstProduct.scrollIntoView();
    const titleElement = await firstProduct.$('[data-test="product-name"]');
    await titleElement.click();
});

Then(/^the system should open the Product Details page$/, async function () {
    const url = await homePage.getCurrentUrl();
    expect(url).to.include('/product/', `Expected URL to include "/product/" but got: ${url}`);
});

Then(/^displays all the product's information \(price, description, environmental impact, category\)$/, async function () {
    await productDetailsPage.waitForLoaded();

    const info = await productDetailsPage.getProductInfo();

    assertNotEmptyFields(info, ['title', 'price', 'description', 'category', 'impact']);
});
