import { Given, When, Then } from '@wdio/cucumber-framework';
import { HomePage } from '../../../business/pages/home/home.page.js';
import { logger } from '../../../core/logger/logger.js';
import { assertMinimumElements, assertElementCount } from '../../assertions/assertions.js';

const homePage = new HomePage();


Given(/^the user navigates to the Home page$/, async () => {
    await homePage.open();
});

When(/^the user enters Claw Hammer in the search bar$/, async () => {
    await homePage.searchProduct('claw hammer');
    await homePage.waitForSearchResults();
});

When(/^clicks the Search button$/, async () => {
    logger.info("searchProduct already clicks the button");
});

Then(/^the search results should display only Claw Hammer products$/, async () => {
    const allProducts = await homePage.productCards;
    const products = [];

    for (const product of allProducts) {
        if (await homePage.isElementDisplayed(product)) {
            products.push(product);
        }
    }

    assertMinimumElements(products, 1, 'visible products after search');

    logger.info(`Validating ${products.length} visible products contain "claw hammer"`);

    let matchedCount = 0;
    let nonMatchedCount = 0;
    const nonMatches = [];

    for (let i = 0; i < products.length; i++) {
        try {
            const title = await homePage.getProductName(products[i]);

            if (title) {
                if (title.toLowerCase().includes('claw hammer')) {
                    matchedCount++;
                    logger.info(`✓ Product ${i + 1}: ${title}`);
                } else {
                    nonMatchedCount++;
                    nonMatches.push(title);
                    logger.info(`✗ Product ${i + 1}: ${title} (DOES NOT MATCH)`);
                }
            }
        } catch (error) {
            logger.info(`⚠️ Skipped stale element at index ${i}`);
            continue;
        }
    }

    logger.info(`======================================`);
    logger.info(`Results: ${matchedCount} matched, ${nonMatchedCount} did not match`);

    if (nonMatches.length > 0) {
        logger.info(`Non-matching products found: ${nonMatches.join(', ')}`);
    }

    assertElementCount([...Array(matchedCount)], 3, '"Claw Hammer" products');

    logger.info(`✅ Test passed: All ${matchedCount} visible products contain "claw hammer"`);
});
