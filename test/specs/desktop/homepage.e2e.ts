import { expect, $ } from '@wdio/globals';
import HomePage from '../../pageobjects/home.page.js';
import { getSevereAppErrors } from '../../support/consoleLogs.js';

describe('Homepage', () => {
    it('TC-1: loads successfully with header, hero and footer visible', async () => {
        await HomePage.open();

        await expect($('#site-header')).toBeDisplayed();
        await expect(HomePage.heroSection).toBeDisplayed();
        await expect($('#site-footer')).toBeDisplayed();

        expect(await getSevereAppErrors()).toHaveLength(0);
    });
});
