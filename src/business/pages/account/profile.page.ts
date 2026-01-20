import { AccountPage } from './account.page';

type ElementType = any;

export class ProfilePage extends AccountPage {
    private selectors = {
        currentPassword: '[data-test="current-password"]',
        newPassword: '[data-test="new-password"]',
        confirmPassword: '[data-test="new-password-confirm"]',
        changePasswordBtn: '[data-test="change-password-submit"]',
        errorAlert: '[data-test="alert-error"]',
    };

    // ================= Getters =================
    get currentPasswordInput(): ElementType {
        return $(this.selectors.currentPassword);
    }

    get newPasswordInput(): ElementType {
        return $(this.selectors.newPassword);
    }

    get confirmPasswordInput(): ElementType {
        return $(this.selectors.confirmPassword);
    }

    get changePasswordButton(): ElementType {
        return $(this.selectors.changePasswordBtn);
    }

    get errorAlert(): ElementType {
        return $(this.selectors.errorAlert);
    }

    // ================= Methods =================
    async open(): Promise<void> {
        await this.navigateTo('/account/profile');
        await this.waitForPageLoad();
        await this.waitForAngular();
        await this.waitForProfileElements();
    }

    async waitForProfileElements(): Promise<void> {
        const elements = [
            this.currentPasswordInput,
            this.newPasswordInput,
            this.confirmPasswordInput,
            this.changePasswordButton,
        ];
        for (const el of elements) {
            await el.waitForDisplayed({ timeout: 15000 });
        }
    }

    async fillPasswordForm(currentPassword: string, newPassword: string): Promise<void> {
        await this.currentPasswordInput.waitForDisplayed({ timeout: 15000 });
        await this.newPasswordInput.waitForDisplayed({ timeout: 15000 });
        await this.confirmPasswordInput.waitForDisplayed({ timeout: 15000 });

        await this.clearAndFillInput(this.currentPasswordInput, currentPassword);
        await this.clearAndFillInput(this.newPasswordInput, newPassword);
        await this.clearAndFillInput(this.confirmPasswordInput, newPassword);
    }

    async submitPasswordChange(): Promise<void> {
        const btn = this.changePasswordButton;
        await btn.waitForDisplayed({ timeout: 15000 });
        await btn.waitForClickable({ timeout: 10000 });

        await this.clickElement(btn);
        await this.pause(500);
    }

    async verifyNoError(): Promise<void> {
        if (await this.isElementDisplayed(this.errorAlert)) {
            const txt = await this.getElementText(this.errorAlert);
            throw new Error('Password change failed: ' + txt);
        }
    }

    async waitForRedirectToLogin(timeout: number = 20000): Promise<void> {
        await this.waitForUrlToContain('/auth/login', timeout);
        const finalUrl = await this.getCurrentUrl();
        if (!finalUrl.includes('/auth/login')) {
            throw new Error('User was NOT redirected to login after password change');
        }
    }
}
