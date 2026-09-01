import { $$, browser } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';

/**
 * telnyx.com renders separate duplicate markup per breakpoint (mobile/tablet/desktop)
 * and toggles visibility with CSS instead of removing nodes from the DOM.
 * This resolves a selector to whichever matching element is actually visible
 * in the current viewport, so page objects stay correct for both the desktop
 * and mobile configs without hardcoding breakpoint-specific selectors.
 *
 * Returns a resolved element (not a lazy ChainablePromiseElement), so callers
 * must `await` this before chaining element commands.
 */
export async function firstDisplayed(selector: string): Promise<WebdriverIO.Element> {
    let elements: WebdriverIO.Element[] = [];

    // Right after a fresh page load the matching nodes may not have
    // rendered yet (seen on Firefox) - a single one-shot query can catch
    // that empty window and return `undefined`. Retry until at least one
    // match shows up instead of assuming the first attempt is authoritative.
    await browser.waitUntil(
        async () => {
            // `$$()`'s chainable typing doesn't narrow to a plain array on
            // await; it does resolve to one at runtime, so this cast
            // reflects that.
            elements = (await $$(selector)) as unknown as WebdriverIO.Element[];
            return elements.length > 0;
        },
        { timeoutMsg: `No elements matched selector "${selector}"` }
    );

    for (const element of elements) {
        if (await element.isDisplayed()) {
            return element;
        }
    }
    return elements[0];
}

/**
 * Clicks via JS instead of a native WebDriver click. Safaridriver's
 * in-view-center-point calculation can flag some perfectly visible,
 * uncovered elements as "click intercepted" (observed on the hero CTAs);
 * dispatching the click straight from the DOM sidesteps that interactability
 * check entirely. Chrome/Firefox handle the native click fine, but this
 * works identically there too, so it's safe to use everywhere.
 */
export async function jsClick(element: WebdriverIO.Element | ChainablePromiseElement): Promise<void> {
    await browser.execute((el: HTMLElement) => el.click(), element);
}

/**
 * Reads raw `textContent` instead of using `getText()`. `getText()` mimics
 * `innerText` and inserts line breaks at visual block boundaries, so a
 * multi-word heading can come back split across lines and fail a simple
 * substring check; `textContent` is the plain concatenated DOM text and
 * behaves identically across browsers.
 */
export async function getFullText(element: WebdriverIO.Element | ChainablePromiseElement): Promise<string> {
    return browser.execute((el: HTMLElement) => el.textContent || '', element);
}
