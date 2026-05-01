import { BasePage } from '../basePage';
import { logger } from '../../../core/logger/logger';

type ElementType = any;

interface UserData {
    firstName?: string;
    lastName?: string;
    dob?: string;
    street?: string;
    postalCode?: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
    email?: string;
    password?: string;
}

export class SignupPage extends BasePage {
    private selectors = {
        firstName: '[data-test="first-name"]',
        lastName: '[data-test="last-name"]',
        dob: '[data-test="dob"]',
        street: '[data-test="street"]',
        houseNumber: '[data-test="house_number"]',
        postal: '[data-test="postal_code"]',
        city: '[data-test="city"]',
        state: '[data-test="state"]',
        country: '[data-test="country"]',
        phone: '[data-test="phone"]',
        email: '[data-test="email"]',
        password: '[data-test="password"]',
        submit: '[data-test="register-submit"]',
    };

    // ----------------------------
    // Getters for elements
    // ----------------------------
    get firstNameInput(): ElementType {
        return $(this.selectors.firstName);
    }

    get lastNameInput(): ElementType {
        return $(this.selectors.lastName);
    }

    get dobInput(): ElementType {
        return $(this.selectors.dob);
    }

    get streetInput(): ElementType {
        return $(this.selectors.street);
    }

    get houseNumberInput(): ElementType {
        return $(this.selectors.houseNumber);
    }

    get postalInput(): ElementType {
        return $(this.selectors.postal);
    }

    get cityInput(): ElementType {
        return $(this.selectors.city);
    }

    get stateInput(): ElementType {
        return $(this.selectors.state);
    }

    get countrySelect(): ElementType {
        return $(this.selectors.country);
    }

    get phoneInput(): ElementType {
        return $(this.selectors.phone);
    }

    get emailInput(): ElementType {
        return $(this.selectors.email);
    }

    get passwordInput(): ElementType {
        return $(this.selectors.password);
    }

    get registerButton(): ElementType {
        return $(this.selectors.submit);
    }

    // ----------------------------
    // Actions
    // ----------------------------
    async open(): Promise<void> {
        await this.navigateTo('/auth/register');
        await this.waitForPageLoad();
        await this.waitForPageReady();
    }

    async waitForPageReady(): Promise<void> {
        await $(this.selectors.firstName).waitForDisplayed({ timeout: 10000 });
    }

    async registerUser(data: UserData): Promise<void> {
        for (const [key, value] of Object.entries(data)) {
            if (!value) {
                continue;
            }
            const element = this.getElementForKey(key);
            if (!element) {
                continue;
            }
            await this.fillField(element, value);
        }

        await this.clickRegister();
    }

    private getElementForKey(key: string): ElementType | null {
        switch (key) {
            case 'firstName':
                return this.firstNameInput;
            case 'lastName':
                return this.lastNameInput;
            case 'dob':
                return this.dobInput;
            case 'street':
                return this.streetInput;
            case 'houseNumber':
                return this.houseNumberInput;
            case 'postalCode':
                return this.postalInput;
            case 'city':
                return this.cityInput;
            case 'state':
                return this.stateInput;
            case 'country':
                return this.countrySelect;
            case 'phone':
                return this.phoneInput;
            case 'email':
                return this.emailInput;
            case 'password':
                return this.passwordInput;
            default:
                return null;
        }
    }

    async clickRegister(): Promise<void> {
        await this.registerButton.waitForClickable({ timeout: 5000 });
        await this.clickElement(this.registerButton);
        await this.pause(1000);
    }

    async verifyRegistrationSuccess(): Promise<void> {
        await this.waitForUrlToContain('/account', 15000);
        logger.info('Registration successful - redirected to account page');
    }
}
