# Portfolio

Personal portfolio site built with **Next.js 14 (App Router)**, TypeScript, and Tailwind CSS.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14 App Router (SSG + one future API route) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Content (planned) | MDX in `content/` |
| Tests | Vitest |

No external UI package — primitives live in this repo.

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest |

## Project layout

```
app/           # Routes (App Router)
components/    # Site UI
content/       # MDX projects & blog (next milestone)
lib/           # Config, pure helpers
tests/         # Unit tests
.cursor/rules/ # Engineering standards for agents & humans
```

## Git workflow

Branch from `develop` (`feature/*` or `chore/*`), Conventional Commits, merge via review. Local-only docs: `Portfolio_Site_Blueprint.md`, `TRACKER.md` (gitignored).
