import { BasePage } from '../basePage';
import { HeaderComponent } from '../../components/common/header.component';

export class AccountPage extends BasePage {
    constructor() {
        super();
    }

    async open(): Promise<void> {
        await this.navigateTo('/account');
        await this.waitForPageLoad();
    }

    async isOnAccountPage(): Promise<boolean> {
        const url = await this.getCurrentUrl();
        return url.includes('/account');
    }

    async isOnProfileSection(): Promise<boolean> {
        const url = await this.getCurrentUrl();
        return url.includes('/account/profile');
    }

    async isOnFavoritesSection(): Promise<boolean> {
        const url = await this.getCurrentUrl();
        return url.includes('/favorites') || url.includes('/favourites');
    }
}
