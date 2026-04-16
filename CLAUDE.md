# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

XinCheng is a restaurant/brunch business application ("星橙早午餐"). It's a pnpm + Turborepo monorepo with four apps: a customer-facing frontend, a management dashboard, and two corresponding Cloudflare Workers backends.

## Monorepo Structure

- **apps/frontend** — Customer-facing Next.js 15 site (static export via `output: 'export'`), PWA-enabled, deployed to GitHub Pages
- **apps/xincheng-backend** — Hono API on Cloudflare Workers, uses D1 (SQLite) + Drizzle ORM, KV for token blacklist/auth
- **apps/xincheng-managerment** — Management dashboard, Next.js 15 (static export), PWA-enabled, deployed to GitHub Pages
- **apps/xincheng-managerment-backend** — Management API on Cloudflare Workers, D1 + Drizzle ORM
- **packages/typescript-config** — Shared tsconfig presets

## Commands

All commands run from the repo root unless noted.

```bash
pnpm install              # Install all dependencies
pnpm dev                  # Dev all apps (Turbo)
pnpm build                # Build all apps
pnpm lint                 # Lint all apps
pnpm lint:fix             # Auto-fix lint issues
pnpm format               # Prettier format all TS/TSX/MD files
pnpm check-types          # TypeScript type checking

# Run a single app
pnpm dev --filter=frontend
pnpm build --filter=xincheng-backend

# Backend-specific (run from app directory)
cd apps/xincheng-backend
pnpm dev                  # wrangler dev (local Workers)
pnpm deploy               # wrangler deploy --minify
pnpm db:generate          # drizzle-kit generate (new migration)
pnpm db:up                # drizzle-kit up (apply migrations)

# Frontend bundle analysis
cd apps/frontend
ANALYZE=true pnpm build
```

## Architecture Details

**Frontends** use Next.js App Router with static export — no server-side rendering. State management via Zustand. UI built with Radix UI primitives + Tailwind CSS v4 + shadcn/ui pattern (components.json present). The frontend app uses framer-motion for animations and embla-carousel/swiper for carousels.

**Backends** follow a layered pattern: `routes → controllers → services → db`. Both use Hono framework with middleware for CORS, CSRF, and error handling. Database access through Drizzle ORM over Cloudflare D1 (SQLite dialect). Auth uses bcryptjs for password hashing, JWT for sessions, and KV for token blacklist. The main backend also supports Google OAuth.

**Database migrations** live in `src/db/migrations/` within each backend app. Schema defined in `src/db/schema.ts`. Use `drizzle-kit generate` to create migrations and `drizzle-kit up` to apply.

**CI/CD**: GitHub Actions workflow (`.github/workflows/ghpage.yml`) builds frontends on push when their paths change. Backends are deployed separately via `wrangler deploy`.

## Code Style

- Prettier config: single quotes, no semicolons, no trailing commas, 2-space indent
- TypeScript throughout, Node >= 20, pnpm 9
- Package manager: pnpm (do not use npm or yarn)
