# Backend без паники

Этот файл - короткий словарь по понятиям, которые встречаются в проекте. Не учебник, а “что это такое и зачем оно мне”.

## Backend

Backend - это часть приложения, которая работает на сервере.

Обычно backend:

- принимает HTTP-запросы от frontend;
- проверяет данные;
- читает и пишет в базу;
- возвращает ответ в формате JSON;
- отвечает за авторизацию, права доступа и бизнес-логику.

## API

API - это набор правил, как frontend и backend разговаривают друг с другом.

Пример:

```text
GET /api/health
```

Frontend отправляет запрос, backend возвращает ответ:

```json
{
  "status": "ok"
}
```

## HTTP-ручка

Ручка, endpoint, route - часто говорят про одно и то же.

Это конкретный адрес + метод.

Примеры:

```text
GET /api/health
POST /api/auth/login
PATCH /api/tasks/1
DELETE /api/tasks/1
```

Метод примерно говорит, что мы делаем:

- `GET` - получить данные;
- `POST` - создать что-то или выполнить действие;
- `PATCH` - частично изменить;
- `DELETE` - удалить.

## NestJS

NestJS - framework для backend на Node.js и TypeScript.

Он помогает не писать приложение как хаотичный набор функций, а раскладывать код по понятным слоям:

- module;
- controller;
- service;
- provider.

## Module

Module - контейнер для части приложения.

Например, `HealthModule` собирает все, что относится к health-check:

- controller;
- service;
- зависимости.

Обычно одна крупная фича = один module.

## Controller

Controller принимает HTTP-запросы.

Например:

```ts
@Controller('health')
export class HealthController {
  @Get()
  checkApp() {
    return this.healthService.checkApp();
  }
}
```

Здесь controller говорит: “если пришел `GET /health`, вызови `checkApp`”.

В этом проекте есть global prefix `api`, поэтому полный путь будет:

```text
GET /api/health
```

## Service

Service содержит основную логику.

Controller лучше держать тонким: он принимает запрос и передает работу service.

Пример из проекта:

```text
HealthController -> HealthService -> PrismaService -> PostgreSQL
```

## Dependency Injection

Звучит страшно, но идея простая: NestJS сам передает нужные классы туда, где они нужны.

Пример:

```ts
constructor(private readonly healthService: HealthService) {}
```

Ты не создаешь `new HealthService()` руками. NestJS делает это сам, если service зарегистрирован в module.

## DTO

DTO - Data Transfer Object.

Это объект, который описывает данные на входе или выходе API.

Например, когда будет регистрация пользователя, может появиться DTO:

```ts
export class CreateUserDto {
  email: string;
  password: string;
}
```

DTO удобно использовать вместе с `class-validator`, чтобы проверять входящие данные.

## ValidationPipe

В `src/main.ts` включен глобальный `ValidationPipe`.

Сейчас настройки такие:

- `whitelist: true` - выкидывает лишние поля, которых нет в DTO;
- `transform: true` - пытается преобразовывать входящие данные к нужным типам;
- `forbidNonWhitelisted: true` - ругается, если пришли лишние поля.

Это пригодится, когда появятся DTO.

## CORS

CORS - настройка, которая позволяет frontend с другого адреса обращаться к backend.

Например:

- frontend: `http://localhost:5173`;
- backend: `http://localhost:3000`.

В проекте CORS включен в `src/main.ts`.

## Swagger

Swagger - это страница с API-документацией.

В этом проекте она доступна здесь:

```text
http://localhost:3000/docs
```

Туда удобно смотреть, когда появляются новые ручки.

## Prisma

Prisma - инструмент для работы с базой.

Вместо того чтобы руками писать SQL на каждый запрос, ты описываешь модели в `prisma/schema.prisma`, генерируешь Prisma Client и работаешь с базой через TypeScript-код.

Сейчас моделей еще нет, но подключение уже подготовлено.

## PostgreSQL

PostgreSQL - база данных.

Локально она поднимается через Docker Compose.

Настройки лежат в:

```text
docker-compose.yml
```

А backend подключается к ней через:

```text
DATABASE_URL
```

## Миграции

Миграции - это история изменений базы.

Например:

1. Создали таблицу users.
2. Добавили таблицу boards.
3. Добавили поле title в tasks.

Каждое такое изменение лучше сохранять как миграцию, чтобы структуру базы можно было повторить на другом компьютере или сервере.

## Как думать о новой фиче

Когда добавляешь новую backend-фичу, обычно путь такой:

1. Понять, какие данные нужны.
2. Описать модели в `prisma/schema.prisma`.
3. Создать миграцию.
4. Создать module.
5. Создать service с логикой.
6. Создать controller с HTTP-ручками.
7. Добавить DTO и валидацию.
8. Проверить через Swagger или curl.

Не обязательно все делать идеально с первого раза. Главное - маленькими шагами и проверять каждый слой отдельно.
