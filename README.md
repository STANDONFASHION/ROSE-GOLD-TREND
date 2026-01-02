# ROSE-GOLD-TREND

**ONLINE RETAIL SHOP — API**

## Overview
A minimal Node.js + Express API scaffold for the ROSE-GOLD-TREND project. Includes Dockerfile, basic tests, ESLint, and a GitHub Actions CI workflow.

## Quick start (local)

1. Install dependencies:

```bash
npm ci
```

2. Run tests:

```bash
npm test
```

3. Start the server:

```bash
npm start
# or for development with auto-reload
npm run dev
```

The API listens on `http://localhost:3000` by default. Endpoints:
- `GET /` — application info
- `GET /health` — health check
- `GET /products` — list products
- `GET /products/:id` — get product by id
- `POST /products` — create a product (JSON payload: `{ name, description, price }`)

## Docker

Build the image:

```bash
docker build -t rose-gold-trend .
```

Run the container:

```bash
docker run -p 3000:3000 rose-gold-trend
```

## Database & Migrations

This project uses **Postgres** in development and **sqlite (in-memory)** for fast tests.

- Run migrations (local Postgres):

```bash
# set DATABASE_URL or rely on default PG env vars
npm run migrate
```

- To run a local Postgres + app for development:

```bash
docker-compose up --build
```

- Tests use an in-memory sqlite database by default (no Postgres required):

```bash
npm test
```

## CI

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs `npm ci`, `npm test`, and `npm run lint` on push and pull requests to `main`.

## Development notes
- Tests: Jest + Supertest
- Linting: ESLint (`npm run lint`)

---
