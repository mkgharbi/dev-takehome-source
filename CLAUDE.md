# CLAUDE.md

Read [`BRIEF.md`](./BRIEF.md) and [`README.md`](./README.md) before anything else.

The repo conventions are **enforced by ESLint** (3 custom rules). If `pnpm lint` complains, that's the convention talking.

Stay concise. You're not here to narrate what the code does — you're here to execute what the candidate asks.

## Git workflow

`main` is protected — no direct push. Work on branches, open PRs against **this fork's own `main`**, not the upstream source. When using `gh pr create`, always pass `--repo <this-fork>` to avoid GitHub defaulting the base to upstream.
