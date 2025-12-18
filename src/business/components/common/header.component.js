import { BaseComponent } from "../common/base.component.js";
import { logger } from "../../../core/logger/logger.js";

export class HeaderComponent extends BaseComponent {

    constructor() {
        super('#navbarSupportedContent');
    }


    selectors = {
        homeLink: '[data-test="nav-home"]',
        contactLink: '[data-test="nav-contact"]',

        categoriesMenu: '[data-test="nav-categories"]',

        languageSelect: '[data-test="language-select"]',
        spanishLanguage: '[data-test="lang-es"]',

        cartLink: '[data-test="nav-cart"]',
        cartQuantity: '[data-test="cart-quantity"]'
    };


    // ---- GETTERS ----
    get homeLink() { return this.rootEl.$(this.selectors.homeLink); }
    get contactLink() { return this.rootEl.$(this.selectors.contactLink); }
    get categoriesMenu() { return this.rootEl.$(this.selectors.categoriesMenu); }
    
    get cartLink() { return this.rootEl.$(this.selectors.cartLink); }
    get cartQuantity() { return this.rootEl.$(this.selectors.cartQuantity); }
    
    // Language button is not in the root so must be global
    get languageSelect() { return $(this.selectors.languageSelect); }
    get spanishLanguage() { return $(this.selectors.spanishLanguage); }

    // ---- ACTIONS ----
    async waitForLoaded() {
        logger.info("Waiting for Header to load");
        await this.rootEl.waitForDisplayed({ timeout: 10000 });
    }

    async openCart() {
        logger.info("Opening cart");
        await this.cartLink.waitForClickable();
        await this.cartLink.click();
    }

    async getCartCount() {
        logger.info("Getting cart quantity");
        await this.cartQuantity.waitForDisplayed({ timeout: 5000 });
        return parseInt(await this.cartQuantity.getText(), 10);
    }

    async openLanguageMenu() {
        logger.info("Opening language dropdown");
        await this.languageSelect.waitForClickable();
        await this.languageSelect.click();
    }

    async selectSpanish() {
        await this.openLanguageMenu();
        await this.spanishLanguage.waitForClickable();
        await this.spanishLanguage.click();
    }

    async waitForSpanish() {
        await browser.waitUntil(async () => {
            return (await this.homeLink.getText()).trim() === 'Inicio';
        }, {
            timeout: 5000,
            timeoutMsg: 'Header did not switch to Spanish in time'
        });
    }


}
