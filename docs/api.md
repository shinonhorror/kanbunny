# API

Этот файл описывает API, которое уже есть в проекте.

## Базовый адрес

Локально приложение обычно запускается здесь:

```text
http://localhost:3000
```

В `src/main.ts` задан global prefix:

```ts
app.setGlobalPrefix('api');
```

Поэтому API-ручки начинаются с:

```text
/api
```

## Swagger

Swagger доступен отдельно:

```text
http://localhost:3000/docs
```

Там можно смотреть список ручек и пробовать запросы из браузера.

Swagger настроен в `src/main.ts`:

- title: `Kanbunny API`;
- description: `Backend API for Kanbunny project`;
- version: `1.0`;
- bearer auth уже добавлен в конфиг, пригодится для будущей авторизации.

## Health

Health-ручки нужны, чтобы быстро проверить состояние приложения.

### Проверить приложение

```text
GET /api/health
```

Пример ответа:

```json
{
  "status": "ok",
  "service": "kanbunny-api",
  "timestamp": "2026-06-26T10:00:00.000Z"
}
```

Что проверяет:

- NestJS-приложение запущено;
- роутинг работает;
- controller и service отвечают.

Что не проверяет:

- соединение с базой;
- авторизацию;
- будущие бизнес-модули.

### Проверить базу

```text
GET /api/health/db
```

Пример ответа:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-06-26T10:00:00.000Z"
}
```

Что проверяет:

- приложение видит `DATABASE_URL`;
- Prisma Client создался;
- PostgreSQL доступен;
- тестовый запрос `SELECT 1` прошел успешно.

Если эта ручка падает, сначала проверь:

```bash
docker compose ps
```

И `.env`:

```env
DATABASE_URL=postgresql://kanbunny_user:kanbunny_password@localhost:5432/kanbunny_db
```

## Где лежит код health API

```text
src/modules/health/health.controller.ts
src/modules/health/health.service.ts
src/modules/health/health.module.ts
```

Поток запроса:

```text
GET /api/health/db
  -> HealthController.checkDatabase()
  -> HealthService.checkDatabase()
  -> PrismaService
  -> PostgreSQL
```

## Как добавлять новые API-ручки

Обычно для новой фичи создается отдельная папка в `src/modules`.

Пример будущей структуры:

```text
src/modules/tasks/
├── tasks.controller.ts
├── tasks.module.ts
├── tasks.service.ts
└── dto/
    └── create-task.dto.ts
```

Потом этот module подключается в `src/app.module.ts`.

Полезный принцип: controller отвечает за HTTP, service отвечает за логику.
