# Next.js SaaS AI Template

> Production-ready Next.js boilerplate for multi-tenant SaaS with AI built-in

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/Create-Node-App/nextjs-saas-ai-template?style=social)](https://github.com/Create-Node-App/nextjs-saas-ai-template)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

[![Built with create-awesome-node-app](https://img.shields.io/badge/Built%20with-create--awesome--node--app-blue?style=flat-square)](https://www.npmjs.com/package/create-awesome-node-app)

</div>

A fully-featured, production-ready Next.js 15 template for building multi-tenant SaaS applications with AI capabilities built-in. Part of the [Create-Node-App](https://github.com/Create-Node-App) ecosystem.

---

## 🛠️ How to Use This Template

> [!TIP]
> **Using the CLI is always recommended over cloning this repo directly.**
> This template repository may become outdated over time. The CLI always fetches the latest version of the template plus lets you add extensions (Tailwind, shadcn/ui, Auth.js, Drizzle, i18n, and more) in a single command.

### ⚡ Option 1 — CLI (Recommended — always up to date)

Use **[`create-awesome-node-app`](https://www.npmjs.com/package/create-awesome-node-app)** to scaffold the latest version of this template with optional addons:

```bash
npx create-awesome-node-app my-saas-app \
  --template nextjs-saas-ai-starter
```

Browse all available templates, extensions, and docs at **[create-awesome-node-app.vercel.app](https://create-awesome-node-app.vercel.app/)**.

> [!NOTE]
> The CLI automatically pulls the latest template version and lets you compose extensions on top of it.
> This repo snapshot may lag behind. **Always prefer the CLI for new projects.**

---

### 🐙 Option 2 — GitHub Template (quick start, may be outdated)

Click the **"Use this template"** button at the top of this page, or:

```bash
gh repo create my-saas-app --template Create-Node-App/nextjs-saas-ai-template --clone
cd my-saas-app
```

> [!WARNING]
> This repository is a point-in-time snapshot. It may not include the latest updates, bug fixes, or new extensions available through the CLI. For production projects, **Option 1 is strongly recommended**.

---

## 🚀 Getting Started

Once you have created your project (via the CLI or GitHub template above), start the local development environment using **DevContainer** — no manual setup needed.

**Prerequisites:** [Docker](https://www.docker.com/) + IDE with Dev Containers support (VS Code, Cursor)

```bash
cd my-saas-app
# Open in VS Code/Cursor and click "Reopen in Container"
pnpm dev
```

Or with the DevContainer CLI:

```bash
npm install -g @devcontainers/cli

cd my-saas-app
devcontainer up --workspace-folder .
devcontainer exec --workspace-folder . pnpm dev
```

The DevContainer automatically configures PostgreSQL + pgvector, environment variables, and all tooling.

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Create `.env.local` only if you need to override specific values (e.g., `OPENAI_API_KEY` for AI features).

---

## ✨ Features

- 🏢 **Multi-tenant architecture** — tenant-scoped routes (`/t/[tenant]`), full tenant isolation in DB
- 🔐 **Auth.js v5 + Auth0** — SSO, database sessions, development credentials provider
- 🗄️ **PostgreSQL 17 + pgvector + Drizzle ORM** — type-safe queries, vector similarity search
- 🤖 **AI assistant** — OpenAI/Anthropic via Vercel AI SDK, RAG with embeddings
- 🔑 **Permission-Based Access Control (PBAC)** — roles are bundles of permissions, multi-role support
- 🔗 **Integration architecture** — GitHub OAuth2 example, extensible via `integration_sync_control`
- 🛡️ **Admin panel** — member management, roles, settings, webhooks, bulk import
- 📣 **Outbound webhooks** — configurable with delivery tracking
- 📋 **Audit logging** — all sensitive operations are tracked
- 📁 **File uploads** — AWS S3 in production, MinIO for local dev
- 📦 **DevContainer + direnv** — zero-config local development environment
- 🌍 **i18n** — next-intl with English and Spanish out of the box
- 📚 **Storybook** — component development and visual testing
- ⚡ **GitHub Actions CI** — build, lint, type-check, tests, mega-linter
- 🧩 **Feature template** — `_feature-template_` scaffold for adding new features

---

## 🛠️ Tech Stack

| Category     | Technology                                            |
| ------------ | ----------------------------------------------------- |
| Framework    | Next.js 15 (App Router, RSC, Turbopack)               |
| Language     | TypeScript 5+ (strict)                                |
| Styling      | Tailwind CSS v4 + shadcn/ui                           |
| Database     | PostgreSQL 17 + pgvector + Drizzle ORM                |
| Auth         | Auth.js v5 + Auth0 (SSO) + database sessions          |
| AI           | OpenAI / Anthropic via Vercel AI SDK + RAG/embeddings |
| File Storage | AWS S3 (production) / MinIO (local dev)               |
| i18n         | next-intl (EN + ES)                                   |
| Testing      | Jest + React Testing Library                          |
| Linting      | ESLint 9 (flat config) + Prettier + Mega Linter       |
| CI/CD        | GitHub Actions                                        |
| Dev Env      | DevContainer + direnv                                 |

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, tenant selection)
│   ├── (tenant)/t/[tenant]/ # Tenant-scoped routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── features/              # Feature modules
│   ├── admin/             # Admin panel
│   ├── assistant/         # AI assistant
│   ├── auth/              # Authentication
│   └── _feature-template_/ # Template for new features
├── shared/                # Shared infrastructure
│   ├── components/ui/     # shadcn/ui components
│   ├── db/                # Database (Drizzle + pgvector)
│   └── lib/               # Utilities (auth, permissions, env)
└── i18n/                  # Translations (EN, ES)
```

---

## 📜 Scripts

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `pnpm dev`        | Start development server      |
| `pnpm build`      | Build for production          |
| `pnpm lint`       | Run ESLint                    |
| `pnpm type-check` | Run TypeScript check          |
| `pnpm test`       | Run tests                     |
| `pnpm storybook`  | Start Storybook (port 6006)   |
| `pnpm db:push`    | Push schema to database (dev) |
| `pnpm db:migrate` | Run pending migrations        |
| `pnpm db:studio`  | Open Drizzle Studio           |

---

## 📖 Documentation

The **single source of truth** is **[docs/](./docs/)**.

- **Full index:** [docs/README.md](./docs/README.md)
- **Architecture:** [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)
- **Auth:** [docs/AUTHENTICATION.md](./docs/AUTHENTICATION.md)
- **Database:** [docs/DATABASE.md](./docs/DATABASE.md)
- **Permissions (PBAC):** [docs/ROLES_AND_PERMISSIONS.md](./docs/ROLES_AND_PERMISSIONS.md)
- **API:** [docs/API.md](./docs/API.md)
- **Integrations:** [docs/INTEGRATIONS.md](./docs/INTEGRATIONS.md)
- **Deployment:** [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- **Contributing:** [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.

---

_Part of the [Create-Node-App](https://github.com/Create-Node-App) ecosystem — spin up production-ready applications with best practices baked in._
