# Coolify deployment

## Create the app

1. In Coolify, create a new application from your GitHub repository (or the server path `/var/www/text-corrector`).
2. Use the included `Dockerfile` (multi-stage Next.js 14 standalone). Nixpacks is optional via `nixpacks.toml` if you prefer a Node build without Docker.

## Environment variables

Set these in the Coolify app environment:

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; never expose to the client |
| `LANGUAGETOOL_URL` | Default: `http://172.17.0.1:8010` (Coolify container → host Docker bridge) |
| `ADMIN_EMAILS` | Comma-separated admin emails for `/admin` (e.g. `you@example.com`) |

Build args for public Supabase values can be empty at image build time; inject them at runtime.

## LanguageTool on the host

- Keep LanguageTool bound to **`127.0.0.1:8010`** on the host (see `docker-compose.languagetool.yml`).
- Do **not** expose LT through Traefik / a public domain.
- From Coolify containers, reach the host LT via `http://172.17.0.1:8010`.

```bash
docker compose -f docker-compose.languagetool.yml up -d
```

Image: `silviof/docker-languagetool`.

## Database

Apply migrations via the Supabase Studio SQL editor (or your migration workflow) before relying on auth / leads:

1. `supabase/migrations/001_init.sql` — profiles, documents, error_events, user_stats, quiz_attempts
2. `supabase/migrations/002_leads.sql` — acquisition leads table (service-role only)

## Acquisition funnel

- Public playground: `/try` (2 free corrections, email gate on the 3rd → +30 credits)
- Landing CTA → `/try`
- Authenticated: `/workspace` (editor), `/dashboard` (user), `/admin` (leads KPIs, `ADMIN_EMAILS` only)

## Health checks

After deploy:

- `GET /` — app home (expect `200`)
- `GET /try` — public playground (expect `200`)
- `POST /api/check` with JSON `{"text":"...","language":"fr"}` — grammar check (rate-limited; works without a session)
- `POST /api/leads` with JSON `{"email":"test@example.com"}` — lead capture (sets `tc_lead` cookie)
