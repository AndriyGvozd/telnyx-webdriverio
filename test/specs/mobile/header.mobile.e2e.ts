import { expect } from '@wdio/globals';
import HomePage from '../../pageobjects/home.page.js';
import Header from '../../pageobjects/components/header.component.js';

describe('Header (mobile)', () => {
    beforeEach(async () => {
        await HomePage.open();
    });

    it('TC-10: shows the burger menu icon and hides the desktop navigation', async () => {
        await expect(Header.burgerMenuButton).toBeDisplayed();
        await expect(Header.navMenuItem('Products')).not.toBeDisplayed();
    });

    it('TC-30: opens and closes the mobile navigation', async () => {
        await expect(await Header.isMobileMenuOpen()).toBe(false);

        await Header.toggleMobileMenu();

        await expect(await Header.isMobileMenuOpen()).toBe(true);
        await expect(Header.navMenuItem('Products')).toBeDisplayed();

        await Header.toggleMobileMenu();

        await expect(await Header.isMobileMenuOpen()).toBe(false);
        await expect(Header.navMenuItem('Products')).not.toBeDisplayed();
    });
});
