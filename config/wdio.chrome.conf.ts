import { desktopSharedConfig } from './wdio.desktop.shared.conf.js';

// Set by docker-compose to point at the selenium/standalone-chrome
// container instead of launching Chrome locally. Unset for a normal local
// run (WDIO launches/manages Chrome itself, as usual).
const seleniumHost = process.env.SELENIUM_HOST;

/**
 * Desktop suite on Chrome, 1920x1080.
 */
export const config: WebdriverIO.Config = {
    ...desktopSharedConfig,

    ...(seleniumHost ? { hostname: seleniumHost, port: 4444, path: '/wd/hub' } : {}),

    capabilities: [
        {
            browserName: 'chrome',
            // Same reasoning as the Firefox config: don't block navigation
            // commands on third-party embeds (e.g. the Facebook widget in
            // the footer) that can hang and never fire their own load
            // event - only wait for DOMContentLoaded.
            pageLoadStrategy: 'eager',
            'goog:chromeOptions': {
                args: ['--window-size=1920,1080'],
            },
            // Not yet in WebdriverIO's capability typings, but a valid
            // chromedriver extension capability used to read console logs.
            'goog:loggingPrefs': { browser: 'ALL' },
        } as unknown as WebdriverIO.Capabilities,
    ],
} as WebdriverIO.Config;
