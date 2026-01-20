import { Given, When, Then } from '@wdio/cucumber-framework';
import { HomePage } from '../../../business/pages/home/home.page';
import { HeaderComponent } from '../../../business/components/common/header.component';
import { waitForElementsCount } from '../../../core/browser/wait-helper';
import { logger } from '../../../core/logger/logger';
import { assertMinimumElements } from '../../assertions/assertions';
import { expect } from 'chai';

const homePage = new HomePage();
const header = new HeaderComponent();

Given(/^the user starts on the Home page$/, async function () {
    await homePage.open();
    await header.waitForLoaded();
});

When(/^the user changes the site language to Spanish \(ES\)$/, async function () {
    await header.selectSpanish();
});

Then(/^all interface text should appear in Spanish$/, async function () {
    await header.waitForSpanish();
});

Then(/^product names should remain in their original language$/, async function () {
    await waitForElementsCount(() => $$('[data-test="product-name"]'), 1, 8000);

    const nameElements = $$('[data-test="product-name"]');

    const elementCount = await nameElements.length;

    assertMinimumElements(Array(elementCount).fill(null), 1, 'product names after language switch');

    const forbiddenSpanishWords = ['martillo', 'alicates', 'destornillador', 'tenazas'];

    for (let i = 0; i < elementCount; i++) {
        const nameEl = nameElements[i];
        const name = (await nameEl.getText()).toLowerCase();

        for (const word of forbiddenSpanishWords) {
            expect(name).to.not.contain(word, `Product name "${name}" should not contain Spanish word "${word}"`);
        }
    }

    logger.info('✅ All product names remained in their original language');
});
