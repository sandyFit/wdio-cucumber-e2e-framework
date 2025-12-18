import { BaseComponent } from '../common/base.component.js';

export class ProductCard extends BaseComponent {

    constructor(rootElement) {
        super(rootElement);
        // Store the element reference directly
        this._element = rootElement;
        // Debug: log the element selector to see if they're different
        this._elementId = Math.random().toString(36).substr(2, 9);
        console.log(`ProductCard ${this._elementId} created`);
    }

    selectors = {
        title: '[data-test="product-name"]',
        image: '[data-test="product-image"]',
        price: '[data-test="product-price"]',
        rating: '[data-test="co2-rating-badge"]'
    };

    get rootEl() {
        console.log(`rootEl accessed for card ${this._elementId}`);
        return this._element;
    }

    get titleEl() {
        const title = this.rootEl.$(this.selectors.title);
        console.log(`titleEl for card ${this._elementId}:`, title.selector);
        return title;
    }

    get imageEl() {
        return this.rootEl.$(this.selectors.image);
    }

    async getTitleText() {
        console.log(`getTitleText for card ${this._elementId}`);
        const root = this.rootEl;
        await root.waitForExist({ timeout: 5000 });

        const titleElement = this.titleEl;
        await titleElement.waitForExist({ timeout: 5000 });

        const text = await titleElement.getText();
        console.log(`Card ${this._elementId} has title: "${text}"`);
        return text;
    }

    async click() {
        const root = this.rootEl;
        await root.waitForExist({ timeout: 5000 });

        const titleElement = this.titleEl;
        await titleElement.waitForClickable({ timeout: 5000 });

        await titleElement.click();
    }
}
