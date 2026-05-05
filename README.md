# OnlyCarPool

> India's Premium Multi-Channel Carpooling Platform

Built with React + Vite + Supabase + Capacitor (Android)

## Features

- **Daily Commute** — Fixed route broadcasting with passenger management
- **School Ledger** — Monthly billing registry for school runs
- **Snap-Trip** — Real-time GPS-based ride matching
- **Multi-Ride Architecture** — Drivers and passengers can manage multiple simultaneous rides
- **Royal Command Hub** — Centralized active operations modal
- **Royal Premium 3D UI** — Ivory/gold neumorphic design system

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS v3
- Supabase (Auth + Realtime DB)
- Capacitor 8 (Android)
- Lucide React Icons

## Local Development

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_ORG/onlycarpool-web.git
cd onlycarpool-web

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Supabase URL and anon key in .env

# 4. Start dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## Build for Production

```bash
npm run build
```

## Android APK Build

See [BUILD_GUIDE.md](./BUILD_GUIDE.md) for full instructions.

```bash
npm run build
npx cap sync
npx cap open android
```

## Deployment

Deployed on Vercel. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in your Vercel project settings.
