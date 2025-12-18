import { Given, When, Then } from '@wdio/cucumber-framework';
import { SignupPage } from '../../../business/pages/auth/signup.page.js';
import { LoginPage } from '../../../business/pages/auth/login.page.js';
import { createNewUser } from '../../../business/data/user-factory.js';
import { expect } from 'chai';
import { logger } from '../../../core/logger/logger.js';

const signupPage = new SignupPage();
const loginPage = new LoginPage();

let testUser;

Given(/^the user is on the Sign Up page$/, async () => {
    logger.info('➡ Navigating to Sign Up page');
    await signupPage.open();
});


When(/^the user enters a valid info in all required inputs$/, async () => {
    logger.info('📝 Filling registration form');
    testUser = createNewUser();
    await signupPage.registerUser(testUser);
});

When(/^clicks the Register button$/, async () => {
    logger.info('ℹ Register button already clicked inside registerUser()');
});


Then(/^the system should create a new account$/, async () => {
    logger.info('🔍 Verifying redirect to Login page');
    await loginPage.verifyOnLoginPage();
});

Then(/^redirect to the Login page$/, async () => {
    logger.info('🔍 Checking Login URL');
    const url = await loginPage.getCurrentUrl();
    expect(url).to.include('/auth/login', 'Should redirect to login page after registration');
    logger.info('✅ Successfully redirected to Login page');
});

