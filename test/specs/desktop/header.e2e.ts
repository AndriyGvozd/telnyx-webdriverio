import { expect, browser } from '@wdio/globals';
import HomePage from '../../pageobjects/home.page.js';
import Header from '../../pageobjects/components/header.component.js';
import { getSevereAppErrors, drainBrowserLogs } from '../../support/consoleLogs.js';
import { getEnvironment } from '../../env/environments.js';
import { getFullText } from '../../support/elementUtils.js';

describe('Header', () => {
    beforeEach(async () => {
        await HomePage.open();
    });

    it('TC-2: logo navigates back to the homepage from an internal page', async () => {
        const contactUsLink = await Header.contactUsLink;
        await contactUsLink.click();

        await Header.logo.click();

        const homeUrl = `${getEnvironment().baseUrl}/`;
        await browser.waitUntil(async () => (await browser.getUrl()) === homeUrl);
        await expect(HomePage.heroSection).toBeDisplayed();
    });

    it('TC-3: shows the Pricing dropdown with links to pricing categories', async () => {
        const menu = await Header.openMenu('Pricing');

        await expect(menu).toBeDisplayed();
        await expect(menu.$('a*=Voice API')).toBeDisplayed();
        await expect(menu.$('a*=SMS API')).toBeDisplayed();
        await expect(menu.$('a*=Global Numbers')).toBeDisplayed();
        await expect(menu.$('a*=Inference')).toBeDisplayed();
    });

    it('TC-4: Log in button links to the customer portal', async () => {
        const loginLink = await Header.loginLink;

        await expect(loginLink).toHaveAttribute('href', 'https://portal.telnyx.com');
    });

    it('TC-5: Sign up button navigates to the registration page', async () => {
        const signUpButton = await Header.signUpButton;
        await signUpButton.click();

        await expect(browser).toHaveUrl(expect.stringContaining('/sign-up'));
    });

    it('TC-6: Contact us button navigates to the contact page', async () => {
        const contactUsLink = await Header.contactUsLink;
        await contactUsLink.click();

        await expect(browser).toHaveUrl(expect.stringContaining('/contact-us'));
    });

    it('TC-11: opens the Products mega menu with product categories and links', async () => {
        const menu = await Header.openMenu('Products');

        await expect(menu).toBeDisplayed();

        // Category headings render visually upper-case via CSS
        // (text-transform), but the underlying DOM text is title-case -
        // match on that so this works consistently across browsers. The
        // panel's content mounts asynchronously (noticeably so on Safari),
        // so wait for all of it rather than asserting each heading
        // separately against a possibly still-incomplete render.
        const categories = ['AI', 'Edge', 'Communications', 'Identity & Security', 'Network & Wireless'];
        await browser.waitUntil(
            async () => {
                const text = await getFullText(menu);
                return categories.every((category) => text.includes(category));
            },
            { timeout: 15000, timeoutMsg: `Products menu never rendered all categories: ${categories.join(', ')}` }
        );

        await expect(menu.$('a*=Voice API')).toBeDisplayed();
        await expect(menu.$('a*=SIP Trunking')).toBeDisplayed();
    });

    it('TC-12: opens the Solutions menu with clickable use-case items', async () => {
        const menu = await Header.openMenu('Solutions');

        await expect(menu).toBeDisplayed();
        const healthcareLink = menu.$('a*=Healthcare');
        const financeLink = menu.$('a*=Finance');
        await expect(healthcareLink).toBeDisplayed();
        await expect(financeLink).toBeDisplayed();
        await expect(healthcareLink).toHaveAttribute('href', expect.stringContaining('/solutions/'));
    });

    it('TC-13: opens the Why Telnyx menu with no console errors', async () => {
        await drainBrowserLogs();
        const menu = await Header.openMenu('Why Telnyx');

        await expect(menu).toBeDisplayed();
        await expect(menu.$$('a')[0]).toBeDisplayed();

        expect(await getSevereAppErrors()).toHaveLength(0);
    });

    it('TC-14: opens the Resources menu and its links are clickable', async () => {
        const menu = await Header.openMenu('Resources');
        const resourceCenterLink = menu.$('a*=Resource center');

        await resourceCenterLink.click();

        await expect(browser).toHaveUrl(expect.stringContaining('/resources'));
    });

    it('TC-15: Developers menu links to developers.telnyx.com', async () => {
        const menu = await Header.openMenu('Developers');
        const devDocsLink = menu.$('a*=Dev Docs');

        await expect(devDocsLink).toHaveAttribute(
            'href',
            'https://developers.telnyx.com/docs/overview'
        );
    });
});
