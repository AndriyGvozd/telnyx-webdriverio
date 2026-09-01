# Telnyx.WebdriverIO

📊 **[Live Allure report](https://andriygvozd.github.io/telnyx-webdriverio/)** — latest CI run results.

Automated E2E tests for [telnyx.com](https://telnyx.com), written with **WebdriverIO** + **TypeScript** using the **Page Object Model** pattern.

30 test cases (`TC-1`…`TC-30`) covering the header, footer, hero section, product composition, runtime section, competitor comparison table, pricing calculator, build section and mobile navigation.

---

## Table of contents

- [Project structure](#project-structure)
- [Installation](#installation)
- [Running tests locally](#running-tests-locally)
- [Cross-browser support](#cross-browser-support)
- [Cross-environment support (TEST_ENV)](#cross-environment-support-test_env)
- [Allure report](#allure-report)
- [Docker](#docker)
- [CI/CD (GitHub Actions + GitHub Pages)](#cicd-github-actions--github-pages)
- [Retries and stability](#retries-and-stability)
- [Known limitations](#known-limitations)

---

## Project structure

```
├── config/                        # WebdriverIO configs
│   ├── wdio.shared.conf.ts        # Base settings (env, allure, retries)
│   ├── wdio.desktop.shared.conf.ts# Shared across desktop browsers (specs, viewport)
│   ├── wdio.chrome.conf.ts
│   ├── wdio.firefox.conf.ts
│   ├── wdio.safari.conf.ts
│   └── wdio.mobile.conf.ts        # Mobile emulation (375x812) via Chrome
│
├── test/
│   ├── env/
│   │   └── environments.ts        # prod / staging / dev
│   ├── pageobjects/
│   │   ├── page.ts                # Base Page class
│   │   ├── home.page.ts           # Homepage (hero, composition, runtime...)
│   │   └── components/
│   │       ├── header.component.ts
│   │       └── footer.component.ts
│   ├── specs/
│   │   ├── desktop/                # 9 spec files, TC-1..TC-9, TC-11..TC-29
│   │   └── mobile/                 # TC-10, TC-30
│   └── support/
│       ├── elementUtils.ts        # firstDisplayed / jsClick / getFullText
│       └── consoleLogs.ts         # Filters out SEVERE console errors
│
├── .github/workflows/ci.yml       # CI pipeline + GitHub Pages deployment
├── Dockerfile                     # Image for the test runner container
├── docker-compose.yml             # Orchestrates the Selenium containers
├── package.json
└── tsconfig.json
```

---

## Installation

```bash
npm install
```

Requires **Node.js 20+**.

---

## Running tests locally

For a local run, WebdriverIO manages the browser itself (launches Chrome/Firefox/Safari on your machine) — Docker isn't required for this.

```bash
npm run test:chrome      # full desktop suite on Chrome
npm run test:firefox     # full desktop suite on Firefox
npm run test:safari      # full desktop suite on Safari (macOS only)
npm run test:mobile      # mobile suite (TC-10, TC-30)

npm test                 # all browsers in sequence (chrome → firefox → safari → mobile)
```

**Run a single file:**
```bash
npm run test:file -- ./test/specs/desktop/header.e2e.ts
```

**Run a single test by number (e.g. only TC-23):**
```bash
npx wdio run ./config/wdio.chrome.conf.ts --spec ./test/specs/desktop/economics.e2e.ts --mochaOpts.grep "TC-23"
```

> `npm test` doesn't stop on the first failure — even if the Chrome suite fails, Firefox/Safari/Mobile still run, and the final exit code correctly reflects whether anything failed.

---

## Cross-browser support

Each browser has its own config file in `config/`, inheriting shared settings (base URL, reporters, retries) from `wdio.shared.conf.ts`. Adding a new browser means one new file, not duplicating the whole config.

| Browser | Command | Note |
|---|---|---|
| Chrome | `npm run test:chrome` | primary |
| Firefox | `npm run test:firefox` | |
| Safari | `npm run test:safari` | macOS only, needs a one-time `safaridriver --enable` |
| Mobile | `npm run test:mobile` | Chrome + 375×812 mobile emulation |

---

## Cross-environment support (TEST_ENV)

The base URL is controlled by the `TEST_ENV` variable (`prod` by default):

```bash
TEST_ENV=staging npm run test:chrome
TEST_ENV=dev npm run test:chrome
```

Or via the ready-made scripts: `npm run test:chrome:staging`, `npm run test:chrome:dev` (and similarly for the other browsers).

> The `staging`/`dev` URLs in [test/env/environments.ts](test/env/environments.ts) are placeholders (Telnyx has no public non-prod environments). The switching mechanism itself is fully functional and verified - for a real project, just swap in the real `baseUrl` values.

---

## Allure report

```bash
npm run report:clean       # remove old results/report
npm run report:generate    # generate the HTML report from allure-results/
npm run report:open        # open the generated report in a browser
npm run report             # generate + open in one call
```

Results accumulate across runs on purpose - so, for example, consecutive `test:chrome` + `test:firefox` runs combine into one shared report. Call `report:clean` before a fresh run.

---

## Docker

Tests can run entirely in containers - no need to install any browser on the host machine at all. Official `selenium/standalone-chrome/firefox` images are used, and the project connects to them as a regular WebDriver client.

**Prerequisite:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
npm run docker:test:chrome
npm run docker:test:firefox
npm run docker:test:mobile
npm run docker:down           # tear down containers when done
```

Results (`allure-results/`) are mounted straight from the container onto disk - after the run, `npm run report` works exactly the same as without Docker.

### How it works

```
docker compose run tests npm run test:chrome
        │
        ▼
"tests" container (Node.js + project code)
        │  WebDriver requests to http://selenium-chrome:4444
        ▼
"selenium-chrome" container (real Chrome + chromedriver)
        │
        ▼
opens the real telnyx.com over the internet
```

**Safari isn't part of Docker** - Safari has no Linux build at all, and Apple's license only allows macOS/Safari to run on real Apple hardware. This isn't a limitation of this project, but a fundamental platform constraint.

---

## CI/CD (GitHub Actions + GitHub Pages)

Pipeline: [.github/workflows/ci.yml](.github/workflows/ci.yml), triggered automatically on push to `main` (and manually via "Run workflow").

**Jobs:**
1. **`docker-tests`** (Chrome/Firefox matrix) - builds the Docker image and runs tests in containers on a regular Ubuntu runner.
2. **`mobile-tests`** - the same approach for the mobile suite.
3. **`safari-tests`** - separately, on a `macos-latest` runner, **without Docker** (native run, since Safari can't run in a container).
4. **`deploy-report`** - collects results from every job (even if one failed), generates a single combined Allure report and publishes it to **GitHub Pages**.

The latest report is always available at:
```
https://<your-github-username>.github.io/<repo-name>/
```

### One-time GitHub Pages setup
In the repo's Settings → Pages → Source: pick the `gh-pages` branch (created by the first successful pipeline run) → Save.

---

## Retries and stability

Tests run against the **real, live** telnyx.com site over the internet, so occasional network delays or a slow-responding third-party script (analytics, the Facebook pixel, etc.) are normal, expected flakiness - not a bug in the tests.

- **Automatic retries**: a failing test is re-run up to 3 times (`mochaOpts.retries: 3` in `config/wdio.shared.conf.ts`) before being marked as truly `failing`.
- **`pageLoadStrategy: 'eager'`** (Chrome/Firefox) - navigation commands aren't blocked on a third-party embed that hangs forever and never fires its own `load` event.
- Console `WARNING`s from the site's own third-party scripts (cookielaw.org, googletagmanager, bugsnag, etc.) do **not** fail tests - they're filtered out in [test/support/consoleLogs.ts](test/support/consoleLogs.ts); only the site's own `SEVERE` errors cause a failure.

---

## Known limitations

- **Safari** can't run in Docker - only natively on macOS (locally, or on a `macos-latest` GitHub runner).
- The `staging`/`dev` environments in `test/env/environments.ts` are technically functional but point to placeholder URLs, since Telnyx has no public non-prod environments.
