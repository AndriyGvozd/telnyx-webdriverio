export type EnvName = 'prod' | 'staging' | 'dev';

interface EnvironmentConfig {
    baseUrl: string;
}

/**
 * One entry per environment the framework can target. `prod` is the real
 * telnyx.com and is the only one actually reachable right now - `staging`
 * and `dev` are placeholders for whatever internal non-production hosts a
 * real Telnyx project would expose. Point them at the real hosts once
 * they're available; nothing else in the framework needs to change.
 */
export const environments: Record<EnvName, EnvironmentConfig> = {
    prod: { baseUrl: 'https://telnyx.com' },
    staging: { baseUrl: 'https://staging.telnyx.com' },
    dev: { baseUrl: 'https://dev.telnyx.com' },
};

const DEFAULT_ENV: EnvName = 'prod';

/**
 * Resolves the active environment from the TEST_ENV variable (defaults to
 * `prod`). Set it before running wdio, e.g. `TEST_ENV=staging npm run
 * test:desktop`, or use one of the `test:*:staging` / `test:*:dev` npm
 * scripts.
 */
export function getActiveEnvName(): EnvName {
    const requested = process.env.TEST_ENV?.trim().toLowerCase() || DEFAULT_ENV;

    if (!isKnownEnv(requested)) {
        throw new Error(
            `Unknown TEST_ENV "${requested}". Valid options: ${Object.keys(environments).join(', ')}`
        );
    }

    return requested;
}

export function getEnvironment(): EnvironmentConfig {
    return environments[getActiveEnvName()];
}

function isKnownEnv(name: string): name is EnvName {
    return Object.prototype.hasOwnProperty.call(environments, name);
}
