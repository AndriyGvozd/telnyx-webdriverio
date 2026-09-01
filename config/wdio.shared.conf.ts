import { getEnvironment, getActiveEnvName } from '../test/env/environments.js';

const activeEnv = getActiveEnvName();
console.log(`[wdio] Running against "${activeEnv}" environment: ${getEnvironment().baseUrl}`);

export const sharedConfig: Partial<WebdriverIO.Config> = {
    runner: 'local',
    tsConfigPath: '../tsconfig.json',

    // Switches which environment (prod/staging/dev) the whole suite targets.
    // See test/env/environments.ts - set via the TEST_ENV env var.
    baseUrl: getEnvironment().baseUrl,

    exclude: [],

    // Keep this modest: these specs drive the real telnyx.com over the
    // network, and running too many Chrome sessions in parallel causes
    // timeouts rather than a speed-up.
    maxInstances: 3,

    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: ['visual'],
    framework: 'mocha',

    // 'spec' prints live progress to the terminal; 'allure' writes raw
    // result files that `npm run report` turns into the HTML report.
    // Results accumulate across runs (by design, so e.g. `npm test`'s
    // chrome+firefox+safari+mobile runs combine into one report) - run
    // `npm run report:clean` first for a fresh start.
    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: 'allure-results',
                disableWebdriverStepsReporting: false,
                disableWebdriverScreenshotsReporting: false,
            },
        ],
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
        // Re-run a failing test up to 3 times before marking it failed for
        // real. These specs drive the live telnyx.com over the network, so
        // most failures are transient (a slow page load, a flaky click) -
        // retrying absorbs that noise instead of every one-off hiccup
        // showing up as a red build.
        retries: 3,
    },
};
