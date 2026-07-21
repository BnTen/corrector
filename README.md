# Text Corrector

Correcteur de texte français : Next.js 14, LanguageTool, et Supabase (auth + Postgres).

## Setup

```bash
cp .env.example .env.local
# Remplir NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, LANGUAGETOOL_URL
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
```

Crée `profiles`, `documents`, `error_events`, `user_stats`, `quiz_attempts`, RLS, et le trigger `on_auth_user_created`.

## Deploy

See [docs/COOLIFY.md](docs/COOLIFY.md).
