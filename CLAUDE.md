# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Read [`BRIEF.md`](./BRIEF.md) and [`README.md`](./README.md) first for context and requirements.

## Development environment

- **Node**: 24.x (pinned via `.nvmrc`)
- **pnpm**: 10.x (pinned in `package.json`)
- **TypeScript**: 5.8 strict mode everywhere

## Key development commands

```bash
# Full stack (backend + frontend)
pnpm dev

# Individual services
pnpm -F backend dev        # NestJS at :3001
pnpm -F frontend dev       # Next.js at :3000

# Quality checks
pnpm lint                  # Run ESLint across all packages
pnpm lint:fix              # Auto-fix linting issues
pnpm check-types           # Type-check entire monorepo
pnpm build                 # Production build

# Testing (backend only)
pnpm -F backend test       # Run all Jest tests
pnpm -F backend test -- <pattern>  # Run specific test file
```

The linter will fail on convention violations — **that's the lint telling you the convention**, not a warning.

## Monorepo structure

```
├── apps/
│   ├── backend/          # NestJS 11
│   │   └── src/
│   │       ├── {trainer|training-session|booking}/
│   │       │   ├── controllers/      # *.controller.ts
│   │       │   ├── services/         # *.service.ts
│   │       │   ├── repositories/     # *.repository.ts
│   │       │   └── types/            # *.repository.types.ts
│   │       ├── utils/                # BaseRepository, helpers
│   │       └── seed/                 # Database seeding
│   └── frontend/         # Next.js 16 (App Router)
│       ├── app/          # Route pages (trainers, training-sessions)
│       ├── components/   # React components
│       ├── services/api/ # API client hooks
│       └── lib/          # Utilities
└── packages/
    ├── api/              # Shared DTOs, constants, types
    ├── ui/               # shadcn components (button, card, table, etc.)
    ├── utils/            # Formatters (date, name, currency)
    ├── eslint-config/    # Enforced conventions
    ├── tailwind-config/  # Certalis brand palette
    └── typescript-config/
```

## ESLint rules (enforced)

Three custom rules enforce architectural conventions:

1. **`enforce-backend-file-naming`** — Backend files must follow naming patterns:
   - Controllers: `*.controller.ts` (in `controllers/`)
   - Services: `*.service.ts` (in `services/`)
   - Repositories: `*.repository.ts` (in `repositories/`)
   - Entities: `*.entity.ts` (in `entities/`)
   - DTOs: `*.dto.ts` (in `dto/` or `packages/api/`)

2. **`enforce-tsx-kebab-case`** — UI components in `packages/ui/` must use kebab-case:
   - ✅ `button.tsx`, `card-header.tsx`
   - ❌ `Button.tsx`, `CardHeader.tsx`
   - Exception: `index.tsx` is allowed

3. **`enforce-type-naming`** — Repository types must follow naming patterns:
   - `<Entity>For<UseCase>` (e.g., `TrainerForGet`, `SessionForList`)
   - `Base<Entity>` for base types (e.g., `BaseTrainer`)
   - `<Entity>With<Details>` (e.g., `SessionWithRelations`)
   - Other valid patterns: `<Entity>To<Action>`, `<Entity>After<Action>`, `<Entity>Created`

Run `pnpm lint` to verify — if it complains, adjust your code.

## Backend architecture (NestJS 3-module pattern)

- **Trainer module**: Manages trainer profiles and availability
- **TrainingSession module**: Manages training sessions (pending/confirmed/cancelled)
- **Booking module**: Manages attendee bookings for sessions
- **TypeORM with SQLite**: Auto-seeds on first boot (5 trainers, 15 sessions, 8 bookings)
- **Repositories**: Extend `BaseRepository` from `utils/helpers/base-repository.ts`
- **Type pattern**: Repository types live in `*.repository.types.ts` files

## Frontend architecture (Next.js 16 App Router)

- **Pages**: `/trainers` and `/training-sessions` (in `app/`)
- **Components**: Shared React components with shadcn/ui primitives
- **API calls**: SWR hooks in `services/api/` (one per entity: trainer, training-session, booking)
- **Forms**: react-hook-form + Zod for validation
- **Toast**: Sonner wired in root layout, ready to use
- **Styling**: Tailwind CSS with Certalis brand palette

## Testing

- **Backend**: Jest configured in `apps/backend/package.json`
  - Test files: `*.spec.ts` in any backend directory
  - Example: `trainer/services/trainer.service.spec.ts`
  - Run: `pnpm -F backend test`
  - Add tests for critical paths (services, mutation handlers)
- **Frontend**: No test setup in starter; add if needed

## Git workflow

`main` is protected — no direct push. Work on branches and open PRs:

```bash
git checkout -b <feature-branch>
# ... commit changes ...
gh pr create --repo <this-fork>
```

**Important**: When creating a PR with `gh pr create`, always pass `--repo <this-fork>` to avoid GitHub defaulting the base to the upstream source. Self-merge is allowed.

## Notes on conventions

- Stay concise — you're here to execute what was asked, not narrate the codebase
- Refactor what gets in your way, push code you'd be proud to ship
- If you change existing starter patterns, document it in `NOTES.md`
- The starter code is intentionally imperfect (duplicated patterns, inelegant structures) — treat it as legacy code you've inherited
- Production quality bar: your PR should be mergeable to prod as-is
