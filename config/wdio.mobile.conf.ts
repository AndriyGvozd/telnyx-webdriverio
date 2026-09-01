import { sharedConfig } from './wdio.shared.conf.js';

// Same as the desktop configs: set by docker-compose to point at the
// selenium/standalone-chrome container instead of launching Chrome
// locally. Mobile emulation is just a Chrome capability, so it reuses the
// same container as the desktop Chrome suite - no separate image needed.
const seleniumHost = process.env.SELENIUM_HOST;

/**
 * Mobile suite: emulates a standard 375x812 mobile viewport (iPhone-class
 * device) via Chrome's mobile emulation, and runs the mobile-only
 * header/burger-menu specs.
 */
export const config: WebdriverIO.Config = {
    ...sharedConfig,

    specs: ['../test/specs/mobile/**/*.ts'],

    ...(seleniumHost ? { hostname: seleniumHost, port: 4444, path: '/wd/hub' } : {}),

    capabilities: [
        {
            browserName: 'chrome',
            'goog:chromeOptions': {
                mobileEmulation: {
                    deviceMetrics: { width: 375, height: 812, pixelRatio: 3 },
                    userAgent:
                        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) ' +
                        'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
                },
            },
        },
    ],
} as WebdriverIO.Config;
