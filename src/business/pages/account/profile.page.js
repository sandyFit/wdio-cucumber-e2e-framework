import { AccountPage } from './account.page.js';
import { logger } from '../../../core/logger/logger.js';

export class ProfilePage extends AccountPage {

    selectors = {
        currentPassword: '[data-test="current-password"]',
        newPassword: '[data-test="new-password"]',
        confirmPassword: '[data-test="new-password-confirm"]',
        changePasswordBtn: '[data-test="change-password-submit"]',
        errorAlert: '[data-test="alert-error"]'
    };

    // ================= Getters =================
    get currentPasswordInput() { return $(this.selectors.currentPassword); }
    get newPasswordInput() { return $(this.selectors.newPassword); }
    get confirmPasswordInput() { return $(this.selectors.confirmPassword); }
    get changePasswordButton() { return $(this.selectors.changePasswordBtn); }
    get errorAlert() { return $(this.selectors.errorAlert); }

    // ================= Methods =================
    async open() {
        logger.info('Opening Profile page');
        await this.navigateTo('/account/profile');
        await this.waitForPageLoad();
        await this.waitForAngular();
        await this.waitForProfileElements();
    }


    async waitForProfileElements() {
        const elements = [
            this.currentPasswordInput,
            this.newPasswordInput,
            this.confirmPasswordInput,
            this.changePasswordButton
        ];
        for (const el of elements) {
            await el.waitForDisplayed({ timeout: 15000 });
        }
        logger.info('✅ All profile elements are visible');
    }

    async fillPasswordForm(currentPassword, newPassword) {
        logger.info('Waiting for profile inputs before filling password form');
        await this.currentPasswordInput.waitForDisplayed({ timeout: 15000 });
        await this.newPasswordInput.waitForDisplayed({ timeout: 15000 });
        await this.confirmPasswordInput.waitForDisplayed({ timeout: 15000 });

        logger.info('Filling password form');
        await this.clearAndFillInput(this.currentPasswordInput, currentPassword, 'Current password');
        await this.clearAndFillInput(this.newPasswordInput, newPassword, 'New password');
        await this.clearAndFillInput(this.confirmPasswordInput, newPassword, 'Confirm password');
    }


    async submitPasswordChange() {
        const btn = await this.changePasswordButton;
        await btn.waitForDisplayed({ timeout: 15000 });
        await btn.waitForClickable({ timeout: 10000 });

        logger.info('Clicking Change Password button');
        await this.clickElement(btn, 'Change Password button');

        await this.pause(500, 'waiting for password change to process');
    }


    async verifyNoError() {
        if (await this.isElementDisplayed(this.errorAlert)) {
            const txt = await this.getElementText(this.errorAlert, 'Error Alert');
            throw new Error('Password change failed: ' + txt);
        }
        logger.info('✅ No errors detected');
    }

    async waitForRedirectToLogin(timeout = 20000) {
        await this.waitForUrlToContain('/auth/login', timeout);
        const finalUrl = await this.getCurrentUrl();
        if (!finalUrl.includes('/auth/login')) {
            throw new Error('User was NOT redirected to login after password change');
        }
        logger.info('✅ Password updated successfully → redirected to login');
    }

}
