import { BaseComponent } from './base.component';

export class HeaderComponent extends BaseComponent {
    constructor() {
        super('#navbarSupportedContent');
    }

    private readonly selectors = {
        homeLink: '[data-test="nav-home"]',
        contactLink: '[data-test="nav-contact"]',
        categoriesMenu: '[data-test="nav-categories"]',
        languageSelect: '[data-test="language-select"]',
        spanishLanguage: '[data-test="lang-es"]',
        cartLink: '[data-test="nav-cart"]',
        cartQuantity: '[data-test="cart-quantity"]',
    } as const;

    // ---- GETTERS ----
    get homeLink(): ChainablePromiseElement {
        return this.rootEl.$(this.selectors.homeLink);
    }

    get contactLink(): ChainablePromiseElement {
        return this.rootEl.$(this.selectors.contactLink);
    }

    get categoriesMenu(): ChainablePromiseElement {
        return this.rootEl.$(this.selectors.categoriesMenu);
    }

    get cartLink(): ChainablePromiseElement {
        return this.rootEl.$(this.selectors.cartLink);
    }

    get cartQuantity(): ChainablePromiseElement {
        return this.rootEl.$(this.selectors.cartQuantity);
    }

    // Language button is not in the root so must be global
    get languageSelect(): ChainablePromiseElement {
        return $(this.selectors.languageSelect);
    }

    get spanishLanguage(): ChainablePromiseElement {
        return $(this.selectors.spanishLanguage);
    }

    // ---- ACTIONS ----
    async waitForLoaded(): Promise<void> {
        await this.rootEl.waitForDisplayed({ timeout: 10_000 });
    }

    async openCart(): Promise<void> {
        await this.cartLink.waitForClickable();
        await this.cartLink.click();
    }

    async getCartCount(): Promise<number> {
        await this.cartQuantity.waitForDisplayed({ timeout: 5_000 });
        return Number.parseInt(await this.cartQuantity.getText(), 10);
    }

    async openLanguageMenu(): Promise<void> {
        await this.languageSelect.waitForClickable();
        await this.languageSelect.click();
    }

    async selectSpanish(): Promise<void> {
        await this.openLanguageMenu();
        await this.spanishLanguage.waitForClickable();
        await this.spanishLanguage.click();
    }

    async waitForSpanish(): Promise<void> {
        await browser.waitUntil(
            async () => (await this.homeLink.getText()).trim() === 'Inicio',
            {
                timeout: 5_000,
                timeoutMsg: 'Header did not switch to Spanish in time',
            }
        );
    }
}
