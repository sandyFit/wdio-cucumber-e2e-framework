import { BasePage } from '../basePage';
import { logger } from '../../../core/logger/logger';

export class LoginPage extends BasePage {
    private selectors = {
        email: '[data-test="email"]',
        password: '[data-test="password"]',
        submit: '[data-test="login-submit"]',
    };

    async open(): Promise<void> {
        await this.navigateTo('/auth/login');
        await $(this.selectors.email).waitForDisplayed({ timeout: 10_000 });
    }

    async login(email: string, password: string): Promise<void> {
        await this.clearAndFillInput($(this.selectors.email), email);
        await this.clearAndFillInput($(this.selectors.password), password);

        const submitBtn = $(this.selectors.submit);
        await this.clickElement(submitBtn);

        await this.waitForUrlToContain('/account', 15_000);
        logger.info('Successfully logged in and redirected to account page');
    }

    async verifyOnLoginPage(): Promise<void> {
        await this.waitForUrlToContain('/auth/login');
    }

    async isOnLoginPage(): Promise<boolean> {
        const url = await this.getCurrentUrl();
        return url.includes('/auth/login');
    }
}
