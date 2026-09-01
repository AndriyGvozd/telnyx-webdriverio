import { browser } from '@wdio/globals';

/**
 * Base page object containing behaviour shared across all Telnyx pages.
 *
 * Navigates relative to the active environment's baseUrl (see
 * test/env/environments.ts / TEST_ENV), rather than a hardcoded host, so
 * the same page objects and specs work against prod, staging or dev.
 */
export default class Page {
    public open(path: string = '/') {
        return browser.url(path);
    }
}
