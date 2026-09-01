import { expect } from '@wdio/globals';
import HomePage from '../../pageobjects/home.page.js';

describe('Economics section (price your workload)', () => {
    beforeEach(async () => {
        await HomePage.open('/#price-your-workload');
        const conversationsSlider = await HomePage.conversationsPerMonthSlider;
        await conversationsSlider.scrollIntoView();
    });

    it('TC-23: recalculates cost when the sliders change', async () => {
        const perConversationBefore = await HomePage.resultValue('Per conversation, all-in').then((el) => el.getText());
        const telnyxPerMonthBefore = await HomePage.resultValue('Telnyx per month').then((el) => el.getText());
        const rentedStackBefore = await HomePage.resultValue('Rented stack per month').then((el) => el.getText());

        const conversationsSlider = await HomePage.conversationsPerMonthSlider;
        await HomePage.pressSliderKey(conversationsSlider, 'ArrowRight', 10);

        const minutesSlider = await HomePage.avgMinutesPerConversationSlider;
        await HomePage.pressSliderKey(minutesSlider, 'ArrowRight', 3);

        await expect(await HomePage.resultValue('Telnyx per month')).not.toHaveText(telnyxPerMonthBefore);

        const perConversationAfter = await HomePage.resultValue('Per conversation, all-in').then((el) => el.getText());
        const rentedStackAfter = await HomePage.resultValue('Rented stack per month').then((el) => el.getText());

        expect(perConversationAfter).not.toBe(perConversationBefore);
        expect(rentedStackAfter).not.toBe(rentedStackBefore);
    });
});
