# Документация проекта

Привет. Эта папка - не “официальная документация ради документации”, а рабочая шпаргалка по backend-проекту. Идея простая: если ты открыл проект после паузы или впервые пытаешься понять, что здесь происходит, эти файлы должны быстро вернуть тебя в контекст.

## Что читать первым

1. [`start-here.md`](./start-here.md) - быстрый старт: что установить, как создать `.env`, как поднять базу и запустить приложение.
2. [`project-structure.md`](./project-structure.md) - карта проекта: какие папки за что отвечают.
3. [`commands.md`](./commands.md) - команды из `package.json`, Docker и Prisma человеческим языком.
4. [`backend-basics.md`](./backend-basics.md) - базовые backend-понятия без душного учебника.
5. [`api.md`](./api.md) - какие ручки уже есть и где смотреть Swagger.

## Текущий стек

В проекте сейчас используется:

- **NestJS 11** - основа backend-приложения.
- **TypeScript** - язык проекта.
- **Prisma 7** - клиент для работы с базой.
- **PostgreSQL 16** - база данных.
- **Docker Compose** - локально поднимает PostgreSQL.
- **Swagger** - браузерная документация API.

## Самая короткая версия запуска

```bash
npm install
cp .env.example .env
docker compose up -d
npm run db:generate
npm run start:dev
```

После запуска:

- API health-check: `http://localhost:3000/api/health`
- Проверка базы: `http://localhost:3000/api/health/db`
- Swagger: `http://localhost:3000/docs`

Если что-то не завелось, почти всегда стоит начать с [`start-here.md`](./start-here.md).
