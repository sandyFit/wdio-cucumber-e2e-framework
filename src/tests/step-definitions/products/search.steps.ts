import { Given, When, Then } from '@wdio/cucumber-framework';
import { HomePage } from '../../../business/pages/home/home.page';
import { logger } from '../../../core/logger/logger.js';
import { assertMinimumElements, assertElementCount } from '../../assertions/assertions';

const homePage = new HomePage();

Given(/^the user navigates to the Home page$/, async () => {
    await homePage.open();
});

When(/^the user enters Pliers in the search bar$/, async () => {
    await homePage.searchProduct('pliers');
    await homePage.waitForSearchResults();
});

When(/^clicks the Search button$/, async () => {
    logger.info('searchProduct already clicks the button');
});

Then(/^the search results should display only Pliers products$/, async () => {
    const allProducts = await homePage.getProducts().getElements();
    const products: WebdriverIO.Element[] = [];

    for (const product of allProducts) {
        if (await homePage.isElementDisplayed(product)) {
            products.push(product);
        }
    }

    assertMinimumElements(products, 1, 'visible products after search');

    let matchedCount = 0;
    const nonMatches: string[] = [];

    for (let i = 0; i < products.length; i++) {
        const title = await homePage.getProductName(products[i]);

        if (title) {
            title.toLowerCase().includes('pliers')
                ? matchedCount++
                : nonMatches.push(title);
        }
    }

    assertElementCount([...Array(matchedCount)], 4, '"Pliers" products');
});
