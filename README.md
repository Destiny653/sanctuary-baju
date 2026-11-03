# Our Lady of Mercy

Next.js App Router site for the sanctuary.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Env

Copy `.env.example` to `.env` / `.env.local` and set `NEXT_PUBLIC_SUPABASE_*` (legacy `VITE_*` names still work as fallback).

## Structure

- `src/app` — routes (App Router)
- `src/components` — UI and sanctuary sections
- `public/assets` — local images/video (`gallery`, `posts/*`, `leaders`, …)
