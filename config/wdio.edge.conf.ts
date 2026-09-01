import { desktopSharedConfig } from './wdio.desktop.shared.conf.js';

// Same as the other desktop configs: set by docker-compose to point at the
// selenium/standalone-edge container instead of launching Edge locally.
const seleniumHost = process.env.SELENIUM_HOST;

/**
 * Desktop suite on Microsoft Edge, 1920x1080. Optional: Edge is
 * Chromium-based like the chrome config, kept separate so it can be run
 * (or skipped) independently.
 */
export const config: WebdriverIO.Config = {
    ...desktopSharedConfig,

    ...(seleniumHost ? { hostname: seleniumHost, port: 4444, path: '/wd/hub' } : {}),

    capabilities: [
        {
            browserName: 'MicrosoftEdge',
            'ms:edgeOptions': {
                args: ['--window-size=1920,1080'],
            },
        },
    ],
} as WebdriverIO.Config;
