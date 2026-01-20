export class BaseComponent {
    protected readonly rootSelector?: string;
    protected readonly rootElement?: ChainablePromiseElement;

    constructor(
        rootSelectorOrElement: string | ChainablePromiseElement
    ) {
        if (typeof rootSelectorOrElement === 'string') {
            this.rootSelector = rootSelectorOrElement;
        } else {
            this.rootElement = rootSelectorOrElement;
        }
    }

    protected get rootEl(): ChainablePromiseElement {
        if (this.rootElement) {
            return this.rootElement;
        }

        if (this.rootSelector) {
            return $(this.rootSelector);
        }

        throw new Error('No root element or selector defined');
    }
}
