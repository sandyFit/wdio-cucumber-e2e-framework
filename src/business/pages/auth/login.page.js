import { BasePage } from "../basePage.js";
import { logger } from "../../../core/logger/logger.js";

export class LoginPage extends BasePage {
  selectors = {
    email: '[data-test="email"]',
    password: '[data-test="password"]',
    submit: '[data-test="login-submit"]',
  };

  async open() {
    await this.navigateTo("/auth/login");
    await $(this.selectors.email).waitForDisplayed({ timeout: 10000 });
  }

  async login(email, password) {
    await this.clearAndFillInput(await $(this.selectors.email), email, "Email");
    await this.clearAndFillInput(
      await $(this.selectors.password),
      password,
      "Password",
    );

    const submitBtn = await $(this.selectors.submit);
    await this.clickElement(submitBtn);

    await this.waitForUrlToContain("/account", 15000);
    logger.info("Successfully logged in and redirected to account page");
  }

  async verifyOnLoginPage() {
    await this.waitForUrlToContain("/auth/login");
  }

  async isOnLoginPage() {
    const url = await this.getCurrentUrl();
    return url.includes("/auth/login");
  }
}
