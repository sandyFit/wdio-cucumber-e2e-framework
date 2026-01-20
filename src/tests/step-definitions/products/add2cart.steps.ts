import { Given, When, Then } from '@wdio/cucumber-framework';
import { ProductDetailsPage } from '../../../business/pages/products/product-details.page';
import { HeaderComponent } from '../../../business/components/common/header.component';
import { waitForElementVisible } from '../../../core/browser/wait-helper';
import { expect } from 'chai'; 

const productPage = new ProductDetailsPage();
const header = new HeaderComponent();

Given(/^the user is on a Product Details page$/, async function () {
    await productPage.open();
});

When(/^the user clicks Add to cart button$/, async function () {
    await productPage.addToCart();
});

Then(/^the product should be added to the cart list$/, async function () {
    const quantity = await productPage.getElementText(header.cartQuantity);
    expect(quantity).to.equal('1');
});

Then(/^a successful message should appear$/, async function () {
    const msg = $('//*[contains(text(),"shopping cart")]');
    await waitForElementVisible(msg, 5000);
});
