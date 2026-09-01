import { expect, browser } from '@wdio/globals';
import HomePage from '../../pageobjects/home.page.js';
import { jsClick } from '../../support/elementUtils.js';

describe('Build section', () => {
    beforeEach(async () => {
        await HomePage.open();
    });

    it('TC-24: READ THE DOCS navigates to developer documentation', async () => {
        await jsClick(await HomePage.readTheDocsButton);

        await expect(browser).toHaveUrl(expect.stringContaining('/docs/overview'));
    });

    it('TC-25: GitHub link points to the team-telnyx/ai repository', async () => {
        // A plain native click on this far-down link occasionally doesn't
        // register at all on Safari (the page just stays put) - same class
        // of issue as the hero CTAs, same fix.
        await jsClick(await HomePage.githubLink);

        await expect(browser).toHaveUrl(expect.stringContaining('github.com/team-telnyx/ai'));
    });
});
