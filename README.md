# Text Corrector

Correcteur de texte français : Next.js 14, LanguageTool, et Supabase (auth + Postgres).

## Funnel

- Landing → `/try` playground (2 corrections gratuites)
- Au 3ᵉ crédit : capture email → +30 corrections
- Compte (`/signup`) → corrections illimitées + `/dashboard`
- Admin leads : `/admin` (`ADMIN_EMAILS`)

## Setup

```bash
cp .env.example .env.local
# Remplir NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, LANGUAGETOOL_URL, ADMIN_EMAILS
```

## Dev

```bash
npm install
npm run dev
```

## LanguageTool

```bash
docker compose -f docker-compose.languagetool.yml up -d
```

## Migration Supabase

```bash
docker exec -i supabase-db-<id> \
  psql -U postgres -d postgres < supabase/migrations/001_init.sql

docker exec -i supabase-db-<id> \
  psql -U postgres -d postgres < supabase/migrations/002_leads.sql
```

Crée `profiles`, `documents`, `error_events`, `user_stats`, `quiz_attempts`, `leads`, RLS, et le trigger `on_auth_user_created`.

## Deploy

See [docs/COOLIFY.md](docs/COOLIFY.md).
