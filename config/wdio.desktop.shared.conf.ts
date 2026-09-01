import { browser } from '@wdio/globals';
import { sharedConfig } from './wdio.shared.conf.js';

/**
 * Settings shared by every desktop browser config (chrome/firefox/edge):
 * the desktop spec set and a fixed 1920x1080 viewport. Each
 * wdio.<browser>.conf.ts spreads this in and only adds its own
 * `capabilities`, so browsers stay in sync on everything else.
 */
export const desktopSharedConfig: Partial<WebdriverIO.Config> = {
    ...sharedConfig,

    specs: ['../test/specs/desktop/**/*.ts'],

    before: async () => {
        await browser.setWindowSize(1920, 1080);
    },
};
