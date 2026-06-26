# Структура проекта

Этот файл - карта проекта. Он помогает понять, куда смотреть, когда нужно добавить новую ручку, найти подключение к базе или разобраться, откуда стартует приложение.

## Общая структура

```text
.
├── docs/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── database/
│   │   ├── database.module.ts
│   │   └── prisma.service.ts
│   └── modules/
│       └── health/
│           ├── health.controller.ts
│           ├── health.module.ts
│           └── health.service.ts
├── docker-compose.yml
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── tsconfig.build.json
```

## `src/main.ts`

Это точка входа в приложение. Если совсем просто: именно отсюда NestJS начинает запуск backend.

Сейчас здесь настроены:

- создание приложения через `NestFactory.create(AppModule)`;
- общий префикс API: `api`;
- CORS;
- глобальная валидация через `ValidationPipe`;
- Swagger на `/docs`;
- порт из `process.env.PORT` или `3000` по умолчанию.

Из-за `app.setGlobalPrefix('api')` все обычные ручки начинаются с `/api`.

Пример:

```text
GET /api/health
```

Swagger при этом открыт отдельно:

```text
GET /docs
```

## `src/app.module.ts`

Это главный модуль приложения.

NestJS собирает приложение из модулей. Сейчас главный модуль подключает:

- `ConfigModule` - чтобы читать переменные из `.env`;
- `DatabaseModule` - доступ к Prisma;
- `HealthModule` - health-check ручки.

Когда появятся новые части приложения, например users, auth, boards или tasks, они тоже будут подключаться сюда через свои модули.

## `src/database/`

Папка для подключения к базе данных.

### `database.module.ts`

Регистрирует `PrismaService` и экспортирует его наружу.

Это значит: другие модули могут импортировать `DatabaseModule` и использовать `PrismaService`.

### `prisma.service.ts`

Сервис, который создает Prisma Client.

Он:

- берет `DATABASE_URL` из `.env`;
- если переменной нет, бросает ошибку `DATABASE_URL is not defined`;
- создает PostgreSQL adapter;
- передает adapter в Prisma Client.

Простыми словами: это файл, через который backend получает доступ к базе.

## `src/modules/`

Здесь живут бизнес-модули приложения.

Сейчас есть только:

```text
src/modules/health/
```

В будущем здесь логично хранить модули вроде:

```text
src/modules/users/
src/modules/auth/
src/modules/boards/
src/modules/tasks/
```

Это не правило “навсегда”, но для NestJS такой подход обычно удобный: одна фича - одна папка-модуль.

## `src/modules/health/`

Health-модуль нужен, чтобы быстро проверить, что приложение и база живые.

### `health.module.ts`

Склеивает модуль:

- импортирует `DatabaseModule`;
- подключает `HealthController`;
- подключает `HealthService`.

### `health.controller.ts`

Controller отвечает за HTTP-ручки.

Сейчас здесь две ручки:

```text
GET /api/health
GET /api/health/db
```

Controller не должен содержать много логики. Его задача - принять HTTP-запрос и позвать нужный service.

### `health.service.ts`

Service содержит логику.

Сейчас он:

- возвращает простой статус приложения;
- делает `SELECT 1` через Prisma, чтобы проверить соединение с базой.

## `prisma/`

Папка Prisma.

### `schema.prisma`

Главный файл схемы базы.

Сейчас в нем есть:

- generator Prisma Client;
- datasource PostgreSQL.

Моделей пока нет. Когда появятся сущности проекта, например `User`, `Board`, `Task`, они будут описываться здесь.

### `prisma/migrations/`

Папка для миграций уже указана в `prisma.config.ts`, но в проекте ее может пока не быть.

Миграции - это история изменений структуры базы. Например: “создать таблицу users”, “добавить поле title в tasks”.

## `docker-compose.yml`

Файл для локального PostgreSQL.

Сейчас он поднимает:

- образ `postgres:16`;
- контейнер `kanbunny_postgres`;
- порт `5432`;
- базу `kanbunny_db`;
- пользователя `kanbunny_user`;
- пароль `kanbunny_password`;
- volume `postgres_data`, чтобы данные сохранялись между перезапусками контейнера.

## `package.json`

Здесь зависимости и команды проекта.

Самые важные:

```bash
npm run start:dev
npm run build
npm run db:generate
npm run db:studio
```

Подробнее команды описаны в [`commands.md`](./commands.md).

## Как запрос проходит через проект

На примере `GET /api/health/db`:

1. Запрос приходит в NestJS-приложение.
2. Из-за global prefix `/api` NestJS ищет ручку `/health/db`.
3. `HealthController.checkDatabase()` принимает запрос.
4. Controller вызывает `HealthService.checkDatabase()`.
5. Service делает тестовый запрос в базу через `PrismaService`.
6. Если база отвечает, backend возвращает JSON со статусом `connected`.

Схема:

```text
HTTP request
  -> HealthController
  -> HealthService
  -> PrismaService
  -> PostgreSQL
```
