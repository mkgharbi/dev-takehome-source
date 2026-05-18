# Certalis Takehome — Mini Training Marketplace

➡️ **Brief in [`BRIEF.md`](./BRIEF.md). Read it first.**

## Requirements

- **Node 24.x** (pinned via `.nvmrc` + `engines`)
- **pnpm 10** (pinned via `packageManager`)

## Quick start

```bash
pnpm install
pnpm dev
```

- Backend: http://localhost:3001 — NestJS 11 + TypeORM + SQLite
- Frontend: http://localhost:3000 — Next.js 16 + Tailwind + shadcn/ui + SWR

The SQLite DB auto-seeds on first boot (5 trainers, 15 sessions, 8 bookings).

## Stack

pnpm 10 + Turborepo, TypeScript 5.8 strict.

- **Backend**: NestJS 11, TypeORM, `class-validator`, `better-sqlite3`, Jest
- **Frontend**: Next.js 16 App Router, React 19.2, Tailwind, shadcn/ui, SWR, `react-hook-form` + `zod`
- **Shared packages**: `@repo/api`, `@repo/ui`, `@repo/utils`, `@repo/tailwind-config`, `@repo/eslint-config`, `@repo/typescript-config`

## Useful commands

```bash
pnpm dev               # backend + frontend
pnpm -F backend dev    # backend only
pnpm -F frontend dev   # frontend only

pnpm lint              # lint all packages
pnpm lint:fix          # auto-fix
pnpm check-types       # tsc --noEmit everywhere
pnpm build             # production build

pnpm -F backend test   # run backend Jest tests
```

## Repo structure

```
takehome-starter/
├── apps/
│   ├── backend/       # NestJS — 3 modules (trainer / training-session / booking)
│   └── frontend/      # Next.js — pages /trainers and /training-sessions
└── packages/
    ├── api/             # DTOs + AppPages + ApiRoutes
    ├── ui/              # shared shadcn primitives
    ├── utils/           # format-name, format-date, format-eur
    ├── tailwind-config/ # Certalis brand palette
    ├── eslint-config/   # 3 custom rules
    └── typescript-config/
```

