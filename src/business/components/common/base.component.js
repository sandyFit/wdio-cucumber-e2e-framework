export class BaseComponent {
    constructor(rootSelectorOrElement) {
        if (typeof rootSelectorOrElement === 'string') {
            this.rootSelector = rootSelectorOrElement;
            this._rootElement = null;
        } else {
            this.rootSelector = null;
            this._rootElement = rootSelectorOrElement;
        }
    }

    get rootEl() {
        if (this._rootElement !== null && this._rootElement !== undefined) {
            return this._rootElement;
        }
        if (this.rootSelector) {
            return $(this.rootSelector);
        }
        throw new Error('No root element or selector defined');
    }
}
