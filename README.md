# Telnyx.WebdriverIO

Автоматизовані E2E-тести для [telnyx.com](https://telnyx.com), написані на **WebdriverIO** + **TypeScript** з використанням патерну **Page Object Model**.

30 тесткейсів (`TC-1`…`TC-30`), що покривають хедер, футер, hero-секцію, композицію продуктів, runtime-секцію, порівняльну таблицю, калькулятор вартості, build-секцію та мобільну навігацію.

---

## Зміст

- [Структура проєкту](#структура-проєкту)
- [Встановлення](#встановлення)
- [Запуск тестів локально](#запуск-тестів-локально)
- [Крос-браузерність](#крос-браузерність)
- [Крос-середовищність (TEST_ENV)](#крос-середовищність-test_env)
- [Allure-звіт](#allure-звіт)
- [Docker](#docker)
- [CI/CD (GitHub Actions + GitHub Pages)](#cicd-github-actions--github-pages)
- [Ретраї та стабільність](#ретраї-та-стабільність)
- [Відомі обмеження](#відомі-обмеження)

---

## Структура проєкту

```
├── config/                        # Конфіги WebdriverIO
│   ├── wdio.shared.conf.ts        # Базові налаштування (env, allure, ретраї)
│   ├── wdio.desktop.shared.conf.ts# Спільне для desktop-браузерів (specs, viewport)
│   ├── wdio.chrome.conf.ts
│   ├── wdio.firefox.conf.ts
│   ├── wdio.safari.conf.ts
│   └── wdio.mobile.conf.ts        # мобільна емуляція (375x812) через Chrome
│
├── test/
│   ├── env/
│   │   └── environments.ts        # prod / staging / dev
│   ├── pageobjects/
│   │   ├── page.ts                # базовий Page-клас
│   │   ├── home.page.ts           # головна сторінка (hero, composition, runtime...)
│   │   └── components/
│   │       ├── header.component.ts
│   │       └── footer.component.ts
│   ├── specs/
│   │   ├── desktop/                # 9 спек-файлів, TC-1..TC-9, TC-11..TC-29
│   │   └── mobile/                 # TC-10, TC-30
│   └── support/
│       ├── elementUtils.ts        # firstDisplayed / jsClick / getFullText
│       └── consoleLogs.ts         # фільтрація SEVERE-помилок консолі
│
├── .github/workflows/ci.yml       # CI-пайплайн + деплой на GitHub Pages
├── Dockerfile                     # образ для контейнера з тестами
├── docker-compose.yml             # оркестрація Selenium-контейнерів
├── package.json
└── tsconfig.json
```

---

## Встановлення

```bash
npm install
```

Потрібен **Node.js 20+**.

---

## Запуск тестів локально

Для локального запуску WebdriverIO сам керує браузером (запускає Chrome/Firefox/Safari на твоїй машині) — Docker для цього не обов'язковий.

```bash
npm run test:chrome      # весь desktop-набір на Chrome
npm run test:firefox     # весь desktop-набір на Firefox
npm run test:safari      # весь desktop-набір на Safari (лише macOS)
npm run test:mobile      # мобільний набір (TC-10, TC-30)

npm test                 # усі браузери послідовно (chrome → firefox → safari → mobile)
```

**Запустити один конкретний файл:**
```bash
npm run test:file -- ./test/specs/desktop/header.e2e.ts
```

**Запустити один конкретний тест за номером (наприклад, лише TC-23):**
```bash
npx wdio run ./config/wdio.chrome.conf.ts --spec ./test/specs/desktop/economics.e2e.ts --mochaOpts.grep "TC-23"
```

> `npm test` не зупиняється на першому падінні — навіть якщо Chrome-набір впаде, Firefox/Safari/Mobile все одно запустяться, а фінальний код виходу коректно відобразить, чи було хоч одне падіння.

---

## Крос-браузерність

Кожен браузер має власний конфіг у `config/`, що успадковує спільні налаштування (base URL, репортери, ретраї) з `wdio.shared.conf.ts`. Додавання нового браузера — це один новий файл, а не дублювання всього конфігу.

| Браузер | Команда | Примітка |
|---|---|---|
| Chrome | `npm run test:chrome` | основний |
| Firefox | `npm run test:firefox` | |
| Safari | `npm run test:safari` | лише macOS, вимагає одноразового `safaridriver --enable` |
| Mobile | `npm run test:mobile` | Chrome + мобільна емуляція 375×812 |

---

## Крос-середовищність (TEST_ENV)

Базовий URL визначається змінною `TEST_ENV` (`prod` за замовчуванням):

```bash
TEST_ENV=staging npm run test:chrome
TEST_ENV=dev npm run test:chrome
```

Або через готові скрипти: `npm run test:chrome:staging`, `npm run test:chrome:dev` (і аналогічно для інших браузерів).

> `staging`/`dev` URL у [test/env/environments.ts](test/env/environments.ts) — заглушки (у Telnyx немає публічних non-prod середовищ). Механізм перемикання повністю робочий і перевірений; для реального проєкту достатньо замінити значення `baseUrl`.

---

## Allure-звіт

```bash
npm run report:clean       # прибрати старі результати/звіт
npm run report:generate    # згенерувати HTML-звіт з allure-results/
npm run report:open        # відкрити згенерований звіт у браузері
npm run report             # generate + open за один виклик
```

Результати накопичуються між прогонами навмисно — щоб, наприклад, послідовні `test:chrome` + `test:firefox` склались в один спільний звіт. Виклич `report:clean` перед новим "чистим" прогоном.

---

## Docker

Тести можна запускати повністю в контейнерах — браузери не потрібно встановлювати на хост-машину взагалі. Використовуються офіційні образи `selenium/standalone-chrome/firefox`, а сам проєкт підключається до них як звичайний WebDriver-клієнт.

**Передумова:** встановлений і запущений [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
npm run docker:test:chrome
npm run docker:test:firefox
npm run docker:test:mobile
npm run docker:down           # прибрати контейнери після роботи
```

Результати (`allure-results/`) монтуються з контейнера напряму на диск — після прогону `npm run report` працює так само, як і без Docker.

### Як це влаштовано

```
docker compose run tests npm run test:chrome
        │
        ▼
контейнер "tests" (Node.js + код проєкту)
        │  WebDriver-запити на http://selenium-chrome:4444
        ▼
контейнер "selenium-chrome" (справжній Chrome + chromedriver)
        │
        ▼
відкриває реальний telnyx.com через інтернет
```

**Safari в Docker не входить** — Safari не має Linux-збірки в принципі, і ліцензія Apple дозволяє запускати macOS/Safari лише на реальному Apple-обладнанні. Це не обмеження цього проєкту, а фундаментальне обмеження платформи.

---

## CI/CD (GitHub Actions + GitHub Pages)

Пайплайн — [.github/workflows/ci.yml](.github/workflows/ci.yml), запускається автоматично на push у `main` (і вручну через "Run workflow").

**Джоби:**
1. **`docker-tests`** (матриця Chrome/Firefox) — збирає Docker-образ і ганяє тести в контейнерах на звичайному Ubuntu-раннері.
2. **`mobile-tests`** — той самий підхід для мобільного набору.
3. **`safari-tests`** — окремо, на `macos-latest` раннері, **без Docker** (нативний запуск, бо Safari в контейнері неможливий).
4. **`deploy-report`** — збирає результати з усіх джобів (навіть якщо якийсь впав), генерує єдиний Allure-звіт і публікує його на **GitHub Pages**.

Готовий звіт з останнього прогону буде доступний за адресою:
```
https://<твій-github-username>.github.io/<назва-репозиторію>/
```

### Одноразове налаштування GitHub Pages
У Settings репозиторію → Pages → Source: обери гілку `gh-pages` (її створює перший успішний прогін пайплайна) → Save.

---

## Ретраї та стабільність

Тести ганяються проти **реального живого сайту** telnyx.com через інтернет, тож окремі мережеві затримки чи повільна відповідь сторонніх скриптів (аналітика, Facebook-піксель тощо) — це нормальна, очікувана флейкі-поведінка, а не баг тестів.

- **Автоматичні ретраї**: кожен тест, що впав, перезапускається до 3 разів (`mochaOpts.retries: 3` у `config/wdio.shared.conf.ts`), перш ніж бути позначеним як реально `failing`.
- **`pageLoadStrategy: 'eager'`** (Chrome/Firefox) — команди навігації не блокуються "вічним" завантаженням стороннього віджета, який ніколи не викликає власну подію `load`.
- Консольні попередження (WARNING) від сторонніх скриптів сайту (cookielaw.org, googletagmanager, bugsnag тощо) **не** призводять до падіння тестів — фільтруються в [test/support/consoleLogs.ts](test/support/consoleLogs.ts); падіння викликають лише `SEVERE`-помилки самого сайту.

---

## Відомі обмеження

- **Safari** не можна запустити в Docker — лише нативно на macOS (локально чи на `macos-latest` GitHub-раннері).
- `staging`/`dev` середовища в `test/env/environments.ts` — технічно робочі, але вказують на URL-заглушки, оскільки в Telnyx немає публічних non-prod оточень.
