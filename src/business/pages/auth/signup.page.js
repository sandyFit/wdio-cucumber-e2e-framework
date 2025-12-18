import { BasePage } from '../basePage.js';
import { logger } from '../../../core/logger/logger.js';

export class SignupPage extends BasePage {

    selectors = {
        firstName: '[data-test="first-name"]',
        lastName: '[data-test="last-name"]',
        dob: '[data-test="dob"]',
        street: '[data-test="street"]',
        postal: '[data-test="postal_code"]',
        city: '[data-test="city"]',
        state: '[data-test="state"]',
        country: '[data-test="country"]',
        phone: '[data-test="phone"]',
        email: '[data-test="email"]',
        password: '[data-test="password"]',
        submit: '[data-test="register-submit"]'
    };

    // ----------------------------
    // Getters for elements
    // ----------------------------
    get firstNameInput() { return $(this.selectors.firstName); }
    get lastNameInput() { return $(this.selectors.lastName); }
    get dobInput() { return $(this.selectors.dob); }
    get streetInput() { return $(this.selectors.street); }
    get postalInput() { return $(this.selectors.postal); }
    get cityInput() { return $(this.selectors.city); }
    get stateInput() { return $(this.selectors.state); }
    get countrySelect() { return $(this.selectors.country); }
    get phoneInput() { return $(this.selectors.phone); }
    get emailInput() { return $(this.selectors.email); }
    get passwordInput() { return $(this.selectors.password); }
    get registerButton() { return $(this.selectors.submit); }

    // ----------------------------
    // Actions
    // ----------------------------
    async open() {
        logger.info('Opening Signup page');
        await this.navigateTo('/auth/register');
        await this.waitForPageLoad();
        await this.waitForPageReady();
    }

    async waitForPageReady() {
        await $(this.selectors.firstName).waitForDisplayed({ timeout: 10000 });
        logger.info('✅ Signup page ready');
    }

    async registerUser(data) {
        logger.info(`Registering new user: ${data.email}`);

        // Map data keys directly to selectors
        for (const [key, value] of Object.entries(data)) {
            if (!value) continue;
            const element = this.getElementForKey(key);
            if (!element) continue;
            await this.fillField(element, value, key);
        }

        await this.clickRegister();

        logger.info('✅ Registration form submitted');
    }

    getElementForKey(key) {
        switch (key) {
            case 'firstName': return this.firstNameInput;
            case 'lastName': return this.lastNameInput;
            case 'dob': return this.dobInput;
            case 'street': return this.streetInput;
            case 'postalCode': return this.postalInput;
            case 'city': return this.cityInput;
            case 'state': return this.stateInput;
            case 'country': return this.countrySelect;
            case 'phone': return this.phoneInput;
            case 'email': return this.emailInput;
            case 'password': return this.passwordInput;
            default: return null;
        }
    }

    async clickRegister() {
        await this.registerButton.waitForClickable({ timeout: 5000 });
        await this.clickElement(this.registerButton, 'Register Button');
        await this.pause(1000, 'Allowing registration form to process'); 
    }
}
