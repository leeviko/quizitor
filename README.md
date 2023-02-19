# Quizitor

> Create, browse and do quizzes

## Stack

- Next.js
- tRPC
- PostgreSQL with Prisma ORM

## Features

- [x] Authentication
- [x] View public quizzes
- [x] Track quiz views
- [x] Create quizzes
  - [x] Make Public/private
  - [x] Make favorite
  - [x] Edit
  - [x] Delete
- [x] Save quiz score
- [x] Search quizzes
  - [x] Sorting
- [ ] ...

## Docker

Build and run:

```bash
docker build -t quizitor .
docker run -p 3000:3000 -p 5432:5432 -e DATABASE_URL="postgres://username:password@host.docker.internal:5432/quiz" -e JWT_SECRET="jwt_secret" quizitor
```

## Database diagram

![Db diagram](diagram.png)
