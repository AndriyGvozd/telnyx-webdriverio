import { expect } from '@wdio/globals';
import HomePage from '../../pageobjects/home.page.js';
import { jsClick } from '../../support/elementUtils.js';

describe('Composition section (50 primitives)', () => {
    beforeEach(async () => {
        await HomePage.open();
        const useCaseButton = await HomePage.useCaseButton('Contact center');
        await useCaseButton.scrollIntoView({ block: 'center' });
    });

    it('TC-19: selecting a use case updates the results block', async () => {
        const before = await HomePage.resultValue('Primitives composed').then((el) => el.getText());

        // A native click here can silently miss (site-wide smooth-scroll
        // CSS means Safari sometimes computes the click point before the
        // scrollIntoView animation settles, landing on empty space) - a JS
        // click bypasses that geometry entirely, same fix as the hero CTAs.
        const contactCenter = await HomePage.useCaseButton('Contact center');
        await jsClick(contactCenter);

        await expect(await HomePage.resultValue('Primitives composed')).not.toHaveText(before);

        await expect(await HomePage.curlSnippet).toBeDisplayed();
        await expect(await HomePage.resultValue('Est. latency budget')).toBeDisplayed();
        await expect(await HomePage.resultValue('Est. unit cost (all-in)')).toBeDisplayed();
    });

    it('TC-20: clicking a product selects it in the "OR SELECT PRODUCT" grid', async () => {
        const smsApiButton = await HomePage.productButton('SMS API');
        await expect(smsApiButton).toHaveAttribute('aria-pressed', 'false');

        await jsClick(smsApiButton);

        await expect(smsApiButton).toHaveAttribute('aria-pressed', 'true');
    });
});
