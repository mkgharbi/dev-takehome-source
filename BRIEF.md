# Brief — Certalis Senior Dev Takehome

---

## Context

You're joining the Certalis team. We've built a mini training marketplace and we need a **"trainer dashboard"** page. The stack is already wired — Next.js + NestJS + SQLite — you run `pnpm dev` and you code.

---

## What a trainer should be able to do

1. See their upcoming sessions in a list, with date, location, attendee count, status (`pending` / `confirmed` / `cancelled`).
2. See total revenue + revenue this month.
3. Cancel a pending session (with a reason).
4. Bulk-confirm pending sessions older than 7 days.
5. Filter sessions by status and date range.
6. Export the visible sessions to CSV.
7. Receive a toast when a new booking comes in (polling the API every 30s is fine).

---

## Rules of the game

- **You have 1 hour. Not more.** We'd rather see a usable dashboard on 3 features than a dashboard that covers everything shallowly.
- **We don't expect everything done.** We expect **trade-offs**: what's essential for a real trainer, what can wait, what's a trap in disguise.
- **AI tools allowed**, like in real life. Use Cursor / Claude / Copilot however you want. We'll talk about it in the debrief.
- **Stack is fixed**: Next.js + NestJS + SQLite, already wired. No rewriting, no adding a heavy lib without a reason.
- **Respect the conventions**: this starter follows some Certalis production conventions — **read the code, the lint will tell you the rest**. Three custom ESLint rules are enforced. Run `pnpm lint` — if it complains, that's a convention talking to you.
- **Production-quality bar**: the PR you deliver should be one we could merge to prod.
- **Starter code is intentionally imperfect**: some patterns are duplicated, some structures are inelegant — that's how real codebases look. Treat the existing code as legacy you've just inherited: refactor what gets in your way, push code you'd be proud to ship. If you change something in the starter, mention it in your `NOTES.md`.

---

## What you send us — Loom **OR** NOTES.md (your choice)

The goal: that we understand **your decisions**, not that we re-read your diff. Pick the format you're most comfortable with.

- **Option A — Loom (≤ 4 min)**: walk through your screen. You don't need to say everything — cover the 4 points below.
- **Option B — `NOTES.md` at the repo root**: write it down. No length requirement, structured around the same 4 points.

### The 4 points to cover (Loom or NOTES.md)

#### 1. What you shipped

Quick demo or bullet list. 30 seconds / 5 lines max.

#### 2. Your product decisions

- Why this UX? What's driving the screen we see?
- **What did you decide not to do, and why?** *(the most important question in the deliverable)*
- If you had 30 more minutes, what would you add — and why that and not something else?

#### 3. Your technical decisions

- Architecture: how did you split front / back / shared types?
- Trade-offs: where did you take shortcuts on purpose (no tests, no optimization, mock vs real API, etc.)?
- What you'd do differently with more time: refactor, robustness, observability, other.

#### 4. Honesty

How much time you **actually** spent. We don't penalize a declared overrun; we penalize a hidden one.

---

## Delivery

`main` is protected: **no direct push**. Work on branches and open PRs — as many as you want, self-merge is fine.

> ⚠️ When you open a PR, GitHub defaults the **base repository** to the upstream source. Switch it to **your own fork** (`certalis/dev-takehome-<your-handle>`) before submitting. PRs opened against the upstream source are closed automatically.

Loom link in `NOTES.md`, or `NOTES.md` directly in the repo.

---

## What's already wired for you

So you focus on the feature, not the setup:

- 3 TypeORM entities with relations: `Trainer` ↔ `TrainingSession` ↔ `Booking`
- Auto-seed on startup if the DB is empty (5 trainers, 15 sessions, 8 bookings)
- `GET /trainers` (paginated list)
- `GET /training-sessions` (paginated list filterable by `trainerId`, `status`, `from`, `to`)
- `POST /bookings` (wired mutation with `class-validator`)
- `/trainers` page calling the API via an SWR hook
- 5 shadcn components: `button`, `input`, `card`, `table`, `badge`
- Toast via `sonner` already wired in the layout
- **Jest setup with one example test** (`trainer.service.spec.ts`) — run with `pnpm -F backend test`

---

## Out of scope (don't spend time on these)

- Authentication, roles, guards
- i18n / multi-language
- TypeORM migrations (`synchronize: true` is enough)
- Stack rewrites, heavy new libs

We're not asking you to write tests for everything, but if your change touches a critical path, adding a test is a good signal.

---

Good luck.
