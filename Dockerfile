# Just Node + the test project. Chrome and Firefox themselves run in the
# official selenium/standalone-chrome and selenium/standalone-firefox
# containers (see docker-compose.yml) - this image connects to them as a
# remote WebDriver client (see SELENIUM_HOST in config/wdio.chrome.conf.ts
# / wdio.firefox.conf.ts) instead of launching a browser itself. That
# sidesteps having to install/maintain browsers in this image at all.
#
# Safari cannot run here (or in any Docker image) - there is no Linux
# build of Safari, and Apple's license only allows Safari on real Apple
# hardware. Safari stays a separate, native step (locally: `npm run
# test:safari`; in CI: a macOS runner, no Docker).

FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "test:chrome"]
