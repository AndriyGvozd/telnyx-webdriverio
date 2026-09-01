import { $, browser } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import { firstDisplayed } from '../../support/elementUtils.js';

class HeaderComponent {
    public get logo() {
        return $('#site-header a[href="/"]');
    }

    public get burgerMenuButton() {
        return $('button[aria-controls="main-menu-content"]');
    }

    public get mobileMenuPanel() {
        return $('#main-menu-content');
    }

    public get loginLink() {
        return firstDisplayed('a[href="https://portal.telnyx.com"]');
    }

    public get signUpButton() {
        return firstDisplayed('a[href="/sign-up"]');
    }

    public get contactUsLink() {
        return firstDisplayed('a[href="https://telnyx.com/contact-us"]');
    }

    public navMenuItem(name: string) {
        return $('#site-header').$(`button=${name}`);
    }

    public async openMenu(name: string) {
        const trigger = await this.navMenuItem(name);
        await trigger.click();

        // Radix wires up aria-controls asynchronously after the click -
        // reading it immediately is a race (most visible on Safari, which
        // is slower to open these menus) and yields a stale/empty value.
        // Occasionally (also Safari) the click itself doesn't register at
        // all, so re-click once if the attribute never shows up.
        const panelId = await this.waitForPanelId(trigger, name, true);
        const panel = $(`#${panelId}`);
        await panel.waitForDisplayed();
        return panel;
    }

    private async waitForPanelId(
        trigger: ChainablePromiseElement,
        name: string,
        allowRetryClick: boolean
    ): Promise<string> {
        let panelId: string | null = null;
        try {
            await browser.waitUntil(
                async () => {
                    panelId = await trigger.getAttribute('aria-controls');
                    return Boolean(panelId);
                },
                { timeout: 8000, timeoutMsg: `"${name}" menu trigger never got an aria-controls attribute` }
            );
        } catch (error) {
            if (!allowRetryClick) {
                throw error;
            }
            await trigger.click();
            return this.waitForPanelId(trigger, name, false);
        }
        if (!panelId) {
            throw new Error(`"${name}" menu trigger has no aria-controls value`);
        }
        return panelId;
    }

    public async toggleMobileMenu() {
        await this.burgerMenuButton.click();
    }

    public async isMobileMenuOpen(): Promise<boolean> {
        return (await this.burgerMenuButton.getAttribute('aria-expanded')) === 'true';
    }
}

export default new HeaderComponent();
