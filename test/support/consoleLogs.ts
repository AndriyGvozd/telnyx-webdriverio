import { browser } from '@wdio/globals';

interface BrowserLogEntry {
    level: string;
    message: string;
}

/**
 * Third-party scripts telnyx.com embeds (cookie consent, tag manager, chat
 * widget) throw their own unrelated console errors on every page load.
 * Filtering them out keeps this check focused on errors the app itself is
 * responsible for.
 */
const THIRD_PARTY_NOISE = ['cookielaw.org', 'googletagmanager.com', 'bugsnag'];

/**
 * `getLogs('browser')` is a chromedriver-only extension command - Firefox
 * (geckodriver) and Safari don't implement it and throw instead. Callers on
 * those browsers get back an empty list rather than a hard failure, since
 * this check is a best-effort extra, not something every browser can honour.
 */
async function readBrowserLogs(): Promise<BrowserLogEntry[]> {
    try {
        return (await browser.getLogs('browser')) as BrowserLogEntry[];
    } catch {
        return [];
    }
}

export async function getSevereAppErrors(): Promise<BrowserLogEntry[]> {
    const logs = await readBrowserLogs();
    return logs.filter(
        (log) => log.level === 'SEVERE' && !THIRD_PARTY_NOISE.some((needle) => log.message.includes(needle))
    );
}

/**
 * Chromedriver's log buffer accumulates across the whole session and is
 * drained (not just read) by getLogs(). Call this right after a fresh page
 * load and before the action under test, so a console-error check only
 * reflects that action - not leftover noise from earlier tests/navigations
 * in the same worker session.
 */
export async function drainBrowserLogs(): Promise<void> {
    await readBrowserLogs();
}
