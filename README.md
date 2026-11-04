# TechSiege Backend

Standalone API service for the TechSiege public site.

It owns registration, payment-proof storage, admin verification, ticket/PDF
generation, email delivery, check-in, analytics endpoints, and PostgreSQL
access. The frontend does not import server code; it proxies `/api/*` to this
service through `BACKEND_URL`.

## Development

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run dev                 # http://localhost:3200
```

The frontend runs separately on port 3000 and uses `BACKEND_URL` to reach this
service. Set `BACKEND_URL` to the deployed backend origin in production.
