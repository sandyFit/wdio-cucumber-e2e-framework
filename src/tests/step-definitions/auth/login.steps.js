import { Given, When, Then } from '@wdio/cucumber-framework';
import { LoginPage } from '../../../business/pages/auth/login.page.js';
import { logger } from '../../../core/logger/logger.js';
import { getExistingUser } from '../../../business/data/user-factory.js';
import { expect } from 'chai';

const loginPage = new LoginPage();
let testUser;

/**
 * Pre-created test user
 */
Given(/^the user has a registered account$/, async () => {
    testUser = getExistingUser();
    logger.info(`Using pre-created user: ${testUser.email}`);
});

/**
 * Navigate to the Login page
 */
Given(/^is on the Login page$/, async () => {
    logger.info('User navigates to Login page');
    await loginPage.open();
    const onPage = await loginPage.isOnLoginPage();
    expect(onPage).to.be.true;
});

/**
 * Login using valid credentials
 */
When(/^the user enters a valid email and password$/, async () => {
    logger.info('Using pre-created test account');
    testUser = getExistingUser();
    await loginPage.login(testUser.email, testUser.password);
});

When(/^clicks the Login button$/, async () => {
    logger.info('Login button click handled inside login() method');
});

Then(/^the user should be redirected to My Account page$/, async () => {
    await loginPage.waitForUrlToContain('/account', 10000);
    const url = await loginPage.getCurrentUrl();
    expect(url).to.include('/account');
});
