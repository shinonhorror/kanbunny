# Быстрый старт

Этот файл про “как запустить проект локально и понять, что он живой”.

## 1. Что нужно заранее

Нужны:

- **Node.js** - чтобы запускать NestJS-приложение.
- **npm** - обычно идет вместе с Node.js.
- **Docker Desktop** - чтобы поднять PostgreSQL локально.

Проверить Node.js и npm:

```bash
node -v
npm -v
```

Проверить Docker:

```bash
docker -v
docker compose version
```

## 2. Установить зависимости

В корне проекта:

```bash
npm install
```

Это поставит пакеты из `package.json` в папку `node_modules`.

## 3. Создать `.env`

В проекте есть файл `.env.example`. Он показывает, какие переменные окружения нужны приложению.

Создай настоящий `.env`:

```bash
cp .env.example .env
```

Заполни его так:

```env
PORT=3000
DATABASE_URL=postgresql://kanbunny_user:kanbunny_password@localhost:5432/kanbunny_db
```

Что здесь происходит:

- `PORT=3000` - приложение будет запускаться на порту 3000.
- `DATABASE_URL=...` - строка подключения к PostgreSQL из `docker-compose.yml`.

Важно: `.env` не должен попадать в git. Он уже добавлен в `.gitignore`.

## 4. Поднять базу данных

PostgreSQL описан в `docker-compose.yml`.

Запуск:

```bash
docker compose up -d
```

Проверить, что контейнер запущен:

```bash
docker compose ps
```

Остановить базу:

```bash
docker compose down
```

Остановить базу и удалить локальные данные:

```bash
docker compose down -v
```

Последнюю команду лучше использовать осознанно: `-v` удаляет volume с данными PostgreSQL.

## 5. Сгенерировать Prisma Client

Prisma Client - это сгенерированный код, через который приложение общается с базой.

```bash
npm run db:generate
```

В этом проекте Prisma генерирует клиент в:

```text
src/generated/prisma
```

Эта папка не хранится в git, потому что ее можно пересоздать командой выше.

## 6. Запустить приложение в dev-режиме

```bash
npm run start:dev
```

`start:dev` запускает NestJS в watch-режиме. Это значит: меняешь код, приложение автоматически пересобирается.

## 7. Проверить, что все работает

Открой в браузере:

```text
http://localhost:3000/api/health
```

Ожидаемый ответ примерно такой:

```json
{
  "status": "ok",
  "service": "kanbunny-api",
  "timestamp": "2026-06-26T10:00:00.000Z"
}
```

Проверка соединения с базой:

```text
http://localhost:3000/api/health/db
```

Ожидаемый ответ:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-06-26T10:00:00.000Z"
}
```

Swagger:

```text
http://localhost:3000/docs
```

Swagger - это страница, где можно смотреть API-ручки и пробовать запросы.

## Частые проблемы

### `DATABASE_URL is not defined`

Приложение не нашло переменную `DATABASE_URL`.

Проверь:

- файл `.env` существует;
- внутри есть `DATABASE_URL=...`;
- ты запускаешь команду из корня проекта.

### `/api/health` работает, а `/api/health/db` падает

Само приложение запустилось, но с базой проблема.

Проверь:

```bash
docker compose ps
```

Если контейнер не запущен:

```bash
docker compose up -d
```

Еще проверь, что `DATABASE_URL` в `.env` совпадает с логином, паролем, базой и портом из `docker-compose.yml`.

### Prisma Client не найден

Обычно помогает:

```bash
npm run db:generate
```

Если до этого не был выполнен `npm install`, сначала выполни его.
