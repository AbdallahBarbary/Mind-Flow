# MindFlow

MindFlow is a premium mobile app for calm productivity: brain dump notes, deep focus sessions, and quiet weekly analytics.

## What is included

- Figma design system file with product strategy, tokens, typography, elevation, and reusable component variants.
- Canva branding candidates for logo/app icon and social launch visuals.
- Expo React Native frontend with TypeScript, React Navigation, Reanimated, Axios, and Zustand.
- Node.js Express backend with TypeScript, Prisma, PostgreSQL, JWT auth, bcrypt, validation, notes, focus sessions, and stats.
- Product, motion, and setup documentation.

## Folder Structure

```text
mobile app/
  frontend/
    src/
      animations/
      assets/
      components/
      hooks/
      navigation/
      screens/
      services/
      store/
      theme/
  backend/
    prisma/
    src/
      config/
      controllers/
      middleware/
      routes/
      services/
      validators/
  docs/
```

## Quick Start

1. Install frontend dependencies:

```bash
cd "C:\Users\elbar\OneDrive\Desktop\mobile app\frontend"
npm install
npm run start
```

2. Install backend dependencies:

```bash
cd "C:\Users\elbar\OneDrive\Desktop\mobile app\backend"
npm install
copy .env.example .env
npm run prisma:generate
npm run dev
```

3. Start PostgreSQL with Docker, if needed:

```bash
cd "C:\Users\elbar\OneDrive\Desktop\mobile app"
docker compose up -d
```

## Design Links

- Figma: https://www.figma.com/design/ZZkjYdpPGecobyC0yhxR14
- Canva logo/icon candidates and launch visuals are listed in `docs/canva-assets.md`.

Note: the Figma account hit the Starter-plan MCP call limit after the design-system pass. The full screen system is implemented in the Expo app and documented locally; the Figma file contains the professional foundations and component library.
