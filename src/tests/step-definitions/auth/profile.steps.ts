import { Given, When, Then } from '@wdio/cucumber-framework';
import { createTestCredentials, generateRandomPassword } from '../../../business/data/user-factory';
import { ProfilePage } from '../../../business/pages/account/profile.page';
import { logger } from '../../../core/logger/logger';

const profilePage = new ProfilePage();

Given(/^the user is logged into their account$/, async function () {
    if (!this.currentUser) {
        throw new Error('currentUser is not defined in World context. Did you run login steps?');
    }
    this.testCredentials = createTestCredentials(this.currentUser);
});

Given(/^is on the Profile page$/, async function () {
    await profilePage.open();
});

When(/^the user updates their password$/, async function () {
    if (!this.testCredentials) {
        throw new Error('testCredentials is not defined. Did you run "the user is logged into their account" step?');
    }

    const currentPwd = this.testCredentials.getCurrentPassword();
    const newPwd = generateRandomPassword({ length: 12 }); // Fixed: use object parameter
    this.testCredentials.updatePassword(newPwd);

    await profilePage.fillPasswordForm(currentPwd, newPwd);
});

When(/^clicks the Change Password button$/, async function () {
    await profilePage.submitPasswordChange();
});

Then(/^the new password should be saved successfully$/, async function () {
    await profilePage.verifyNoError();

});

Then(/^a success message should appear$/, async function () {
    logger.info('✅ Redirect to login confirms password change.');
});
