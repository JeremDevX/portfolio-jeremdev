# Portfolio JeremDev

Portfolio personnel construit avec Next.js App Router, TypeScript et next-intl.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- next-intl (FR/EN)
- Sass modules
- framer-motion

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
npm install
cp .env.example .env
```

Variable d'environnement requise pour les données GitHub:

```env
GITHUB_TOKEN_USER_DATA=your_github_token
```

## Commands

- `npm run dev`: lance le serveur de dev
- `npm run lint`: lint TypeScript/React
- `npm run test`: tests smoke + unit
- `npm run build`: build production
- `npm run check:agent`: lint + typecheck + tests + build (commande de validation complète)

## Architecture rapide

- `src/app/[locale]`: routes App Router localisées
- `src/i18n`: config de routing et chargement des messages
- `src/components/custom/GithubData`: intégration GitHub (server fetch + UI client)
- `content/fr` et `content/en`: messages de traduction

## Documentation locale

- `src/i18n/README.md`
- `src/components/custom/GithubData/README.md`
