import { Given, When, Then } from '@wdio/cucumber-framework';
import { ProductDetailsPage } from '../../../business/pages/products/product-details.page.js';
import { HeaderComponent } from '../../../business/components/common/header.component.js';
import { waitForElementVisible } from '../../../core/browser/wait-helper.js';

const productPage = new ProductDetailsPage();
const header = new HeaderComponent();

Given(/^the user is on a Product Details page$/, async () => {
    await productPage.open();
});

When(/^the user clicks Add to cart button$/, async () => {
    await productPage.addToCart();
});

Then(/^the product should be added to the cart list$/, async () => {
    const quantity = await productPage.getElementText(header.cartQuantity, 'Cart Quantity');
    expect(quantity).toBe('1');
});

Then(/^a successful message should appear$/, async () => {
    const msg = await $('//*[contains(text(),"shopping cart")]');
    await waitForElementVisible(msg, 5000);
});
