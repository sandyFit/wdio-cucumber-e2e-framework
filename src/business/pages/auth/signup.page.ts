import { BasePage } from '../basePage';
import { logger } from '../../../core/logger/logger';

type ElementType = any;

interface UserData {
    firstName?: string;
    lastName?: string;
    dob?: string;
    country?: string;
    postalCode?: string;
    houseNumber: string,
    street?: string;
    city?: string;
    state?: string;
    phone?: string;
    email?: string;
    password?: string;
}

export class SignupPage extends BasePage {
    private selectors = {
        firstName: '[data-test="first-name"]',
        lastName: '[data-test="last-name"]',
        dob: '[data-test="dob"]',
        country: '[data-test="country"]',
        postal: '[data-test="postal_code"]',
        houseNumber: '[data-test="house_number"]',
        street: '[data-test="street"]',
        city: '[data-test="city"]',
        state: '[data-test="state"]',
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
        // 1. Personal info
        await this.fillField(this.firstNameInput, data.firstName ?? '');
        await this.fillField(this.lastNameInput, data.lastName ?? '');
        await this.fillField(this.dobInput, data.dob ?? '');

        // 2. Select country — triggers address auto-fill API call
        if (data.country) {
            await this.countrySelect.selectByVisibleText(data.country);
        }

        // 3. Fill postal code and house number together
        if (data.postalCode) {
            await this.fillField(this.postalInput, data.postalCode ?? '');
        }
        if (data.houseNumber) {
            await this.fillField(this.houseNumberInput, data.houseNumber ?? '');
        }

        // 4. Wait for street to be auto-filled before continuing
        await browser.waitUntil(
            async () => {
                const value = await this.streetInput.getValue();
                return value !== '';
            },
            { timeout: 20_000, timeoutMsg: 'Street field was not auto-filled within 20 seconds' }
        );

        // 5. Contact info — after address is resolved
        await this.fillField(this.phoneInput, data.phone ?? '');
        await this.fillField(this.emailInput, data.email ?? '');
        await this.fillField(this.passwordInput, data.password ?? '');

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
            case 'country':
                return this.countrySelect;
            case 'postalCode':
                return this.postalInput;
            case 'houseNumber':
                return this.houseNumberInput;
            case 'street':
                return this.streetInput;
            case 'city':
                return this.cityInput;
            case 'state':
                return this.stateInput;
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
        await this.waitForUrlToContain('/auth/login', 15_000);
        logger.info('Registration successful - redirected to login page');
    }
}
