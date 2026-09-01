import { expect, browser, $ } from '@wdio/globals';
import HomePage from '../../pageobjects/home.page.js';
import { jsClick } from '../../support/elementUtils.js';

describe('Hero section', () => {
    beforeEach(async () => {
        await HomePage.open();
    });

    it('TC-7: displays the channel badges above the hero demo (Voice / SMS/MMS / WhatsApp / Email / RCS)', async () => {
        for (const channel of ['Voice', 'SMS/MMS', 'WhatsApp', 'Email', 'RCS']) {
            await expect(HomePage.channelBadge(channel)).toBeDisplayed();
        }
    });

    it('TC-16: Machine tab switches the homepage to the machine view', async () => {
        await HomePage.machineTab.click();

        await expect(browser).toHaveUrl(expect.stringContaining('/machine'));
    });

    it('TC-17: COMPOSE YOUR STACK scrolls to the "price your workload" section', async () => {
        // Safaridriver sometimes reports "click intercepted" on this button
        // even though it's fully visible and uncovered (its in-view-center
        // calculation disagrees with reality) - a JS click sidesteps that
        // interactability check and works identically on every browser.
        await jsClick(await HomePage.composeYourStackButton);

        await browser.waitUntil(async () => (await browser.getUrl()).includes('#price-your-workload'));
        await expect($('#price-your-workload')).toBeDisplayedInViewport();
    });

    it('TC-18: GET STARTED navigates to the sign-up page', async () => {
        await jsClick(await HomePage.heroGetStartedButton);

        await expect(browser).toHaveUrl(expect.stringContaining('/sign-up'));
    });
});
