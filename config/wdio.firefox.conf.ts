import { desktopSharedConfig } from './wdio.desktop.shared.conf.js';

// Same as the Chrome config: set by docker-compose to point at the
// selenium/standalone-firefox container instead of launching Firefox
// locally.
const seleniumHost = process.env.SELENIUM_HOST;

/**
 * Desktop suite on Firefox, 1920x1080.
 *
 * Firefox/geckodriver doesn't support the chromedriver-only `getLogs`
 * extension command - console-error checks (getSevereAppErrors /
 * drainBrowserLogs, see test/support/consoleLogs.ts) detect that and
 * skip themselves instead of failing on this browser.
 */
export const config: WebdriverIO.Config = {
    ...desktopSharedConfig,

    maxInstances: 3,

    ...(seleniumHost ? { hostname: seleniumHost, port: 4444, path: '/wd/hub' } : {}),

    capabilities: [
        {
            browserName: 'firefox',
            pageLoadStrategy: 'eager',
            'moz:firefoxOptions': {
                args: ['-width=1920', '-height=1080'],
            },
        },
    ],
} as WebdriverIO.Config;
