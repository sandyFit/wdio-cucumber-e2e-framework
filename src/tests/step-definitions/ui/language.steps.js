import { Given, When, Then } from '@wdio/cucumber-framework';
import { HomePage } from '../../../business/pages/home/home.page.js';
import { HeaderComponent } from '../../../business/components/common/header.component.js';
import { waitForElementsCount } from '../../../core/browser/wait-helper.js';
import { logger } from '../../../core/logger/logger.js';
import { assertMinimumElements } from '../../assertions/assertions.js';
import 'chai/register-should.js';

const homePage = new HomePage();
const header = new HeaderComponent();

Given(/^the user starts on the Home page$/, async () => {
    await homePage.open();
    await header.waitForLoaded();
});

When(/^the user changes the site language to Spanish \(ES\)$/, async () => {
    await header.selectSpanish();
});

Then(/^all interface text should appear in Spanish$/, async () => {
    await header.waitForSpanish();
});


Then(/^product names should remain in their original language$/, async () => {
    logger.info('Waiting for product names to reappear after language switch');
    await waitForElementsCount(() => $$('[data-test="product-name"]'), 1, 8000);

    const nameElements = await $$('[data-test="product-name"]');

    assertMinimumElements(nameElements, 1, 'product names after language switch');

    logger.info(`Found ${nameElements.length} product names`);

    const forbiddenSpanishWords = [
        "martillo", "alicates", "destornillador", "tenazas"
    ];

    logger.info('Verifying product names are not translated to Spanish');

    for (const nameEl of nameElements) {
        const name = (await nameEl.getText()).toLowerCase();

        forbiddenSpanishWords.forEach(word => {
            name.should.not.contain(word);
        });
    }

    logger.info('✅ All product names remained in their original language');
});



