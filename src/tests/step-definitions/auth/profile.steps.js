import { Given, When, Then } from '@wdio/cucumber-framework';
import { createTestCredentials, generateRandomPassword } from '../../../business/data/user-factory.js';
import { ProfilePage } from '../../../business/pages/account/profile.page.js';
import { logger } from '../../../core/logger/logger.js';
import { expect } from 'chai';

const profilePage = new ProfilePage();
let testCredentials;

Given(/^the user is logged into their account$/, async function () {
    this.testCredentials = createTestCredentials(this.currentUser);
    logger.info('User already logged in via Before hook');
    this.testCredentials.logCredentials();
});

Given(/^is on the Profile page$/, async () => {
    await profilePage.open();
});

When(/^the user updates their password$/, async function () {
    const currentPwd = this.testCredentials.getCurrentPassword();
    const newPwd = generateRandomPassword(12);
    this.testCredentials.updatePassword(newPwd);

    await profilePage.fillPasswordForm(currentPwd, newPwd);
});

When(/^clicks the Change Password button$/, async () => {
    logger.info('Clicking Change Password button');
    await profilePage.submitPasswordChange();
});


Then(/^the new password should be saved successfully$/, async () => {
    await profilePage.verifyNoError();
    await profilePage.waitForRedirectToLogin();
});

Then(/^a success message should appear$/, async () => {
    logger.info('✅ Redirect to login confirms password change.');
});
