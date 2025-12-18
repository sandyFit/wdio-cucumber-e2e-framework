import { Given, When, Then } from '@wdio/cucumber-framework';
import { HomePage } from '../../../business/pages/home/home.page.js';
import { ProductDetailsPage } from '../../../business/pages/products/product-details.page.js';
import { logger } from '../../../core/logger/logger.js';
import { assertNotEmptyFields } from '../../assertions/assertions.js';
import 'chai/register-should.js';

const homePage = new HomePage();
const productDetailsPage = new ProductDetailsPage();

Given(/^the user is on the Home page$/, async () => {
    await homePage.open();
});

When(/^the user clicks on a specific product name or image$/, async () => {
    // Just click the first visible product
    const products = await homePage.getProducts();
    const firstProduct = products[0];

    await firstProduct.scrollIntoView();
    const titleElement = firstProduct.$('[data-test="product-name"]');
    await titleElement.click();
});

Then(/^the system should open the Product Details page$/, async () => {
    const url = await homePage.getCurrentUrl();
    url.should.include('/product/', `Expected URL to include "/product/" but got: ${url}`);
});

Then(/^displays all the product's information \(price, description, environmental impact, category\)$/, async () => {
    await productDetailsPage.waitForLoaded();

    const info = await productDetailsPage.getProductInfo();

    assertNotEmptyFields(info, ['title', 'price', 'description', 'category', 'impact']);

    logger.info('✅ All product information fields are populated');
});
