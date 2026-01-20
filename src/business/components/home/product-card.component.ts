import { BaseComponent } from '../common/base.component';

export class ProductCard extends BaseComponent {
    constructor(rootElement: ChainablePromiseElement) {
        super(rootElement);
    }

    protected readonly selectors = {
        title: '[data-test="product-name"]',
        image: '[data-test="product-image"]',
    } as const;

    get titleEl(): ChainablePromiseElement {
        return this.rootEl.$(this.selectors.title);
    }

    get imageEl(): ChainablePromiseElement {
        return this.rootEl.$(this.selectors.image);
    }

    async getTitleText(): Promise<string> {
        await this.rootEl.waitForExist({ timeout: 5_000 });
        await this.titleEl.waitForExist({ timeout: 5_000 });
        return this.titleEl.getText();
    }

    async click(): Promise<void> {
        await this.rootEl.waitForExist({ timeout: 5_000 });
        await this.titleEl.waitForClickable({ timeout: 5_000 });
        await this.titleEl.click();
    }
}
