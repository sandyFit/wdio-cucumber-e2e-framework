import { BasePage } from '../basePage.js';
import { logger } from '../../../core/logger/logger.js';
import { HeaderComponent } from '../../components/common/header.component.js';

export class AccountPage extends BasePage {
    constructor() {
        super();
        this.header = new HeaderComponent();
    }

    async open() {
        logger.info('Opening Account page');
        await this.navigateTo('/account');
        await this.waitForPageLoad();
    }


    async isOnAccountPage() {
        const url = await this.getCurrentUrl();
        return url.includes('/account');
    }


    async isOnProfileSection() {
        const url = await this.getCurrentUrl();
        return url.includes('/account/profile');
    }

    async isOnFavoritesSection() {
        const url = await this.getCurrentUrl();
        return url.includes('/favorites') || url.includes('/favourites');
    }
}
