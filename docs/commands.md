# Команды проекта

Здесь собраны команды, которые реально нужны для работы с проектом.

## npm-команды

Все npm-команды запускаются из корня проекта.

### Установить зависимости

```bash
npm install
```

Ставит пакеты из `package.json` и `package-lock.json`.

### Запустить dev-сервер

```bash
npm run start:dev
```

Запускает NestJS в watch-режиме. Это основной режим для разработки.

Если меняешь `.ts` файлы, приложение будет перезапускаться автоматически.

### Собрать проект

```bash
npm run build
```

Собирает TypeScript-проект в папку `dist`.

После сборки production-запуск выглядит так:

```bash
npm run start
```

Команда `start` запускает уже собранный файл:

```text
dist/main.js
```

### Отформатировать код

```bash
npm run format
```

Запускает Prettier для файлов:

```text
src/**/*.ts
```

### Сгенерировать Prisma Client

```bash
npm run db:generate
```

Нужно запускать:

- после `npm install`;
- после изменения `prisma/schema.prisma`;
- если приложение ругается, что не найден Prisma Client.

В этом проекте клиент генерируется в:

```text
src/generated/prisma
```

### Открыть Prisma Studio

```bash
npm run db:studio
```

Открывает браузерный интерфейс для просмотра и редактирования данных в базе.

База должна быть запущена, а `.env` должен содержать `DATABASE_URL`.

## Docker-команды

### Поднять PostgreSQL

```bash
docker compose up -d
```

`-d` значит detached mode: контейнер запустится в фоне.

### Посмотреть статус контейнеров

```bash
docker compose ps
```

Полезно, когда непонятно, работает база или нет.

### Посмотреть логи PostgreSQL

```bash
docker compose logs postgres
```

Если база не стартует, сюда стоит заглянуть.

### Остановить контейнеры

```bash
docker compose down
```

Останавливает контейнеры, но сохраняет volume с данными.

### Остановить контейнеры и удалить данные

```bash
docker compose down -v
```

Удаляет volume `postgres_data`.

Используй осторожно: локальные данные базы пропадут.

## Prisma-команды

В `package.json` сейчас добавлены только `db:generate` и `db:studio`, но иногда удобно знать и прямые Prisma-команды.

### Проверить, что Prisma видит схему

```bash
npx prisma validate
```

### Отформатировать `schema.prisma`

```bash
npx prisma format
```

### Создать миграцию

```bash
npx prisma migrate dev --name init
```

Эта команда нужна, когда в `schema.prisma` появились модели и нужно применить их к базе.

Название `init` можно заменить на более конкретное, например:

```bash
npx prisma migrate dev --name add_users
```

## Проверочные URL

Когда приложение запущено:

```text
http://localhost:3000/api/health
http://localhost:3000/api/health/db
http://localhost:3000/docs
```

Если в `.env` указан другой `PORT`, замени `3000` на свой порт.
