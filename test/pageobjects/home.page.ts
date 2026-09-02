import { $, browser } from '@wdio/globals';
import Page from './page.js';
import { firstDisplayed } from '../support/elementUtils.js';

/**
 * telnyx.com homepage: hero, "50 primitives" composition, runtime, ownership
 * and "price your workload" sections. Header/footer live in their own
 * components (header.component.ts / footer.component.ts).
 */
class HomePage extends Page {
    // ---- Hero section --------------------------------------------------
    public get heroSection() {
        return $('section:has(#hero-headline)');
    }

    public get humanTab() {
        return this.heroSection.$('a[href="/"]');
    }

    public get machineTab() {
        return this.heroSection.$('a[href="/machine"]');
    }

    public get composeYourStackButton() {
        return this.heroSection.$('a[href="#price-your-workload"]');
    }

    public get heroGetStartedButton() {
        return this.heroSection.$('a[href="/sign-up"]');
    }

    /** "ONE AGENT, EVERY CHANNEL" badges (Voice / SMS/MMS / WhatsApp / Email / RCS). */
    public channelBadge(name: string) {
        return this.heroSection.$(`li=${name}`);
    }

    // ---- "50 primitives" composition section ---------------------------
    public useCaseButton(name: string) {
        return firstDisplayed(`//span[normalize-space(text())="${name}"]/ancestor::button[@aria-pressed]`);
    }

    public productButton(name: string) {
        return firstDisplayed(
            `//p[normalize-space(text())="OR SELECT PRODUCT"]/following-sibling::*` +
            `//button[@aria-pressed][.//span[normalize-space(text())="${name}"]]`
        );
    }

    public get curlSnippet() {
        return firstDisplayed('[aria-label="cURL code sample, scroll for more"] pre code');
    }

    public resultValue(label: string) {
        return firstDisplayed(`//dt[normalize-space(text())="${label}"]/following-sibling::dd`);
    }

    // ---- Runtime section -------------------------------------------------
    public runItLink(cardTitle: string) {
        return $(`//li[.//h3[normalize-space(text())="${cardTitle}"]]//a[normalize-space(text())="Run it"]`);
    }

    // ---- Ownership comparison table --------------------------------------
    public get ownershipTable() {
        return $('[role="table"][aria-label*="Layer ownership"]');
    }

    public get ownershipTableRows() {
        return this.ownershipTable.$$('[role="row"]');
    }

    // ---- "Price your workload" economics section --------------------------
    public get conversationsPerMonthSlider() {
        return firstDisplayed('[role="slider"][aria-label="Conversations per month"]');
    }

    public get avgMinutesPerConversationSlider() {
        return firstDisplayed('[role="slider"][aria-label="Average mins per conversation"]');
    }

    public async pressSliderKey(slider: WebdriverIO.Element, key: 'ArrowRight' | 'ArrowLeft', times = 1) {
        await slider.click();
        for (let i = 0; i < times; i++) {
            await browser.keys(key);
        }
    }

    // ---- Build section ------------------------------------------------
    public get readTheDocsButton() {
        return $('a[href="https://developers.telnyx.com"]');
    }

    public get githubLink() {
        return $('a[href="https://github.com/team-telnyx/ai"]');
    }
}

export default new HomePage();
