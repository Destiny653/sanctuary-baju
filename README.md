# Sanctuary of Our Lady of Mercy

Website for the Sanctuary of Our Lady of Mercy — bilingual (EN/FR), with a scroll-driven film, gallery, news, events, and a staff dashboard.

## Development

Requires Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd sanctuary
npm i
cp .env.example .env.local   # fill in Supabase (or other) values
npm run dev
```

Local dashboard auth on localhost uses the credentials noted in `.env.example`.
