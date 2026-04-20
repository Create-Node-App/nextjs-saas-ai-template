# Agent Instructions for nextjs-saas-ai-template

## Overview

Production-ready Next.js 16 SaaS starter with AI, Auth.js, Drizzle ORM, PostgreSQL.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- PostgreSQL + Drizzle ORM
- Auth.js v5 (next-auth)
- Tailwind CSS v4
- pnpm 10+

## Key Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Database
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Run migrations
pnpm db:push     # Push schema
pnpm db:seed     # Seed demo data

# Tests
pnpm test
pnpm test:coverage
```

## Code Style

- ESLint flat config
- Prettier for formatting
- Conventional commits
