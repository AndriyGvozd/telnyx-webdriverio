import { desktopSharedConfig } from './wdio.desktop.shared.conf.js';

/**
 * Desktop suite on Safari, 1920x1080. Safari's own WebDriver (safaridriver)
 * ships with macOS - no separate browser/driver download needed - but it
 * must be enabled once per machine before it will accept sessions:
 *
 *   1. Safari > Settings > Advanced > check "Show features for web developers"
 *   2. Develop menu (in Safari's menu bar) > Allow Remote Automation
 *   3. Run `safaridriver --enable` once in Terminal (asks for your password)
 *
 * Console-error checks (getSevereAppErrors / drainBrowserLogs) already
 * degrade gracefully here too, since Safari doesn't support the
 * chromedriver-only getLogs command either (see test/support/consoleLogs.ts).
 */
export const config: WebdriverIO.Config = {
    ...desktopSharedConfig,

    // safaridriver only ever allows one active WebDriver session per Safari
    // instance - a second parallel session fails with "The Safari instance
    // is already paired with another WebDriver session". Spec files must
    // therefore run one at a time on this browser, unlike chrome/firefox.
    maxInstances: 1,

    capabilities: [
        {
            browserName: 'safari',
            // Unlike Chrome/Firefox, Safari doesn't finish rendering/
            // hydrating the page by the time 'eager' considers it loaded
            // (DOMContentLoaded) - that caused "element not interactable"
            // failures on elements that need a moment longer to become
            // clickable. Safari hasn't shown the Firefox-style hang on a
            // stuck third-party embed, so it keeps the default strategy.
        },
    ],
} as WebdriverIO.Config;
