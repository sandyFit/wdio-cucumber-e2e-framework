import { Given, When, Then } from '@wdio/cucumber-framework';
import { SignupPage } from '../../../business/pages/auth/signup.page';
import { LoginPage } from '../../../business/pages/auth/login.page';
import { createNewUser } from '../../../business/data/user-factory';
import { expect } from 'chai';
import { logger } from '../../../core/logger/logger';

const signupPage = new SignupPage();
const loginPage = new LoginPage();

Given(/^the user is on the Sign Up page$/, async function () {
    await signupPage.open();
});

When(/^the user enters a valid info in all required inputs$/, async function () {
    this.currentUser = createNewUser();
    await signupPage.registerUser(this.currentUser);
});

When(/^clicks the Register button$/, async function () {
    logger.info('Register button already clicked inside registerUser()');
});

Then(/^the system should create a new account$/, async function () {
    await loginPage.verifyOnLoginPage();
});

Then(/^redirect to the Login page$/, async function () {
    const url = await loginPage.getCurrentUrl();
    expect(url).to.include('/auth/login', 'Should redirect to login page after registration');
});
