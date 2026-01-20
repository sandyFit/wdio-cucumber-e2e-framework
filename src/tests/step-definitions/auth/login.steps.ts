import { Given, When, Then } from '@wdio/cucumber-framework';
import { LoginPage } from '../../../business/pages/auth/login.page';
import { logger } from '../../../core/logger/logger';
import { getExistingUser } from '../../../business/data/user-factory';
import { expect } from 'chai';

const loginPage = new LoginPage();

Given(/^the user has a registered account$/, async function () {
    this.currentUser = getExistingUser();
});

Given(/^is on the Login page$/, async function () {
    await loginPage.open();
    const onPage = await loginPage.isOnLoginPage();
    expect(onPage).to.be.true;
});

When(/^the user enters a valid email and password$/, async function () {
    if (!this.currentUser) {
        this.currentUser = getExistingUser();
    }
    await loginPage.login(this.currentUser.email, this.currentUser.password);
});

When(/^clicks the Login button$/, async function () {
    logger.info('Login button click handled inside login() method');
});

Then(/^the user should be redirected to My Account page$/, async function () {
    await loginPage.waitForUrlToContain('/account', 10_000);
    const url = await loginPage.getCurrentUrl();
    expect(url).to.include('/account');
});
