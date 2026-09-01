import { expect, browser } from '@wdio/globals';
import HomePage from '../../pageobjects/home.page.js';
import Footer from '../../pageobjects/components/footer.component.js';
import { jsClick } from '../../support/elementUtils.js';

describe('Footer', () => {
    beforeEach(async () => {
        await HomePage.open();
    });

    it('TC-8: Privacy Policy link points to the correct page', async () => {
        await expect(Footer.privacyPolicyLink).toHaveAttribute('href', expect.stringContaining('/privacy-policy'));
    });

    it('TC-9: LinkedIn icon links to the correct social profile', async () => {
        await expect(Footer.linkedInLink).toHaveAttribute('href', expect.stringContaining('linkedin.com/company/telnyx'));
    });

    it('TC-26: X (Twitter) icon links to the official profile', async () => {
        await expect(Footer.twitterLink).toHaveAttribute('href', expect.stringContaining('x.com/telnyx'));
    });

    it('TC-27: Facebook icon links to the official page', async () => {
        await expect(Footer.facebookLink).toHaveAttribute('href', expect.stringContaining('facebook.com/Telnyx'));
    });

    it('TC-28: Shop link navigates to shop.telnyx.com', async () => {
        const shopLink = await Footer.shopLink;
        await browser.execute((el: HTMLElement) => el.removeAttribute('target'), shopLink);

        await jsClick(shopLink);

        await expect(browser).toHaveUrl(expect.stringContaining('shop.telnyx.com'));
    });

    it('TC-29: Website Terms and Conditions link opens the correct page', async () => {
        await jsClick(await Footer.termsAndConditionsLink);

        await expect(browser).toHaveUrl(expect.stringContaining('/terms-and-conditions'));
    });
});
