import { expect, browser } from '@wdio/globals';
import HomePage from '../../pageobjects/home.page.js';
import { jsClick } from '../../support/elementUtils.js';

describe('Runtime section', () => {
    it('TC-21: "Run it" under the Functions card opens the edge-compute docs', async () => {
        await HomePage.open();
        
        const runItLink = HomePage.runItLink('Functions');
        await runItLink.scrollIntoView();

        await jsClick(await runItLink);

        await expect(browser).toHaveUrl(
            expect.stringContaining('developers.telnyx.com/docs/edge-compute/overview')
        );
    });
});
