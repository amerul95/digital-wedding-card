# Docker PostgreSQL Setup

This Docker Compose file sets up only PostgreSQL for local development.

## Prerequisites

- Docker and Docker Compose installed on your system

## Quick Start

1. **Start PostgreSQL container:**
   ```bash
   docker-compose up -d
   ```

2. **Check if PostgreSQL is running:**
   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f postgres
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables (or use the defaults):

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=wedding_app
POSTGRES_PORT=5432
```

## Database Connection

Update your `DATABASE_URL` in `.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wedding_app?schema=public"
```

## Prisma Setup

After starting PostgreSQL, run Prisma migrations:

```bash
pnpx prisma migrate dev
```

Or generate Prisma client:

```bash
pnpx prisma generate
```

## Useful Commands

- **Stop PostgreSQL:**
  ```bash
  docker-compose down
  ```

- **Stop and remove volumes (⚠️ deletes all data):**
  ```bash
  docker-compose down -v
  ```

- **Access PostgreSQL CLI:**
  ```bash
  docker-compose exec postgres psql -U postgres -d wedding_app
  ```

- **Restart PostgreSQL:**
  ```bash
  docker-compose restart postgres
  ```

## Default Credentials

- **User:** postgres
- **Password:** postgres
- **Database:** wedding_app
- **Port:** 5432

⚠️ **Note:** Change these credentials in production!

