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

## Registration setup

Registrations are stored in PostgreSQL by this service; no Firebase, Supabase,
or Google Sheets integration is required.

1. Set `DATABASE_URL` to a PostgreSQL database and run `npm run db:migrate`.
2. Set the frontend's `BACKEND_URL` to this service's public URL.
3. Place the current payment QR image at
   `frontend/public/payment-qr.png`. The public form requires both a UPI
   transaction ID and an image receipt.
4. For real confirmation emails, configure `SMTP_HOST`, `SMTP_PORT`,
   `SMTP_USER`, `SMTP_PASSWORD`, and `EMAIL_FROM`. Without SMTP
   credentials, mail is logged locally and is not delivered.
5. Update `frontend/lib/events.ts` with the official rules, judging
   criteria, timeline, coordinators, prizes, and deadlines before launch.
