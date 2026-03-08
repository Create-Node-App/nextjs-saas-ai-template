---
title: Integrations
description: GitHub, LinkedIn, Slack, Deel, BambooHR, Google Workspace, Resource Guru, Small Improvements, GitLab, Lattice, webhooks — OAuth setup, sync, and data mapping.
section: admin
order: 9
---

# Integrations

Agentic A8n Hub can connect to external systems so you can sync people, skills, or activity and enrich profiles. Admins configure **integrations** (OAuth, API keys, webhooks) and **data mapping** so the right data flows in and out.

## Supported Integrations (Overview)

| Integration            | Typical use                                                        | Setup notes                                              |
| ---------------------- | ------------------------------------------------------------------ | -------------------------------------------------------- |
| **GitHub**             | Link profiles to GitHub; sync repos, activity, or skills from code | OAuth app; map GitHub identity to Agentic A8n Hub person |
| **LinkedIn**           | Import profile or skills from LinkedIn                             | OAuth or API; data mapping for name, title, skills       |
| **Slack**              | Notifications, bot, or identity linking                            | OAuth; webhook or bot token for events                   |
| **Deel**               | Sync contractors/employees and contracts                           | API key; map Deel entities to tenant members             |
| **BambooHR**           | Sync HR data (name, title, department, manager)                    | API key; map fields to person and org structure          |
| **Google Workspace**   | Identity, calendar, or directory sync                              | OAuth; scope and mapping for calendar or directory       |
| **Resource Guru**      | Sync resource allocation or projects                               | API; map projects/resources to Agentic A8n Hub           |
| **Small Improvements** | Import goals, 1:1s, or feedback                                    | API; map to OKRs, 1:1 meetings, or feedback              |
| **GitLab**             | Similar to GitHub — repos, activity, skills                        | OAuth or token; map identity and projects                |
| **Lattice**            | Goals, performance, or engagement data                             | API; map to OKRs or performance as needed                |
| **Webhooks**           | Outbound events (e.g. person updated, assessment submitted)        | Configure URL, secret, events; optional retries          |

Exact availability depends on your tenant and deployment. Use **Admin** → **Integrations** to see which are enabled.

## OAuth Setup

For integrations that use **OAuth** (e.g. GitHub, LinkedIn, Slack, Google):

1. **Create an app** in the provider's developer portal. Get **Client ID** and **Client Secret**.
2. **Set redirect URI** — Use the URL Agentic A8n Hub gives you (e.g. `https://your-tenant.a8n-hub.app/api/auth/callback/github`). Must match exactly.
3. In **Admin** → **Integrations**, select the integration and enter **Client ID** and **Client Secret**. Save.
4. **Scopes** — Request only the scopes you need (e.g. read profile, read repos). Document why each scope is required for compliance.
5. Members can then **connect** their account from profile or settings; they authorize via the provider's consent screen.

> **Tip:** Use a dedicated OAuth app per environment (e.g. dev vs prod) and rotate secrets if they are exposed.

## Sync and Data Mapping

After an integration is connected:

- **Sync** — Trigger a one-time or scheduled sync. The integration fetches data (e.g. from BambooHR or Deel) and updates Agentic A8n Hub (persons, roles, relations).
- **Data mapping** — Define how provider fields map to Agentic A8n Hub:
  - **Person**: external ID → person ID; name, email, title, department → profile fields.
  - **Manager / 1:1**: provider hierarchy or relations → `person_relations` (e.g. manager, one_to_one).
  - **Custom fields**: map provider-specific fields to tenant custom fields if supported.

Mapping is usually configured in the integration's settings (Admin → Integrations → [Integration] → Mapping). Save and run a test sync to verify.

## Automatic Evidence from Syncs

Every time an integration sync processes a person, Agentic A8n Hub **automatically creates an evidence record** on that person's profile. This provides a traceable, transparent audit trail of what was synced and when.

| Integration            | Evidence title (example)                            | What it captures                                               |
| ---------------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| **GitHub**             | "GitHub Profile — 25 repos, TypeScript, Python"     | Repos scanned, languages found, skills inferred, contributions |
| **Deel**               | "Deel Profile — Senior Engineer, employee"          | Job title, employment type, country, timezone, dates           |
| **Resource Guru**      | "Resource Guru — 15 bookings across 3 projects"     | Bookings synced, projects, date range                          |
| **Small Improvements** | "Small Improvements — 5 objectives, 3 recognitions" | Objectives created/updated, recognitions received              |

- Evidence records appear in the person's **Evidence** tab (visible to the person and their manager).
- Each sync **updates** the existing evidence for that integration rather than creating duplicates. The **last synced date** is always current.
- Evidence type is shown as "Integration Sync" in the UI.

> **Tip:** Run syncs regularly to keep evidence records up to date. Each person can see their own integration evidence alongside uploaded CVs and links.

## Semantic Search and Embeddings

Integration syncs also contribute to **semantic search** (People Finder, AI Assistant). When a sync creates or updates data:

- **New skills** created by GitHub sync get embeddings for skill search.
- **Person profiles** updated by Deel or Resource Guru syncs get their profile embedding regenerated, so People Finder results stay current.
- **Bulk imports** (skills, capabilities, persons) also generate embeddings automatically.

This means the more integrations you use, the richer and more accurate People Finder and AI search results become.

## Webhooks (Outbound)

**Webhooks** send events from Agentic A8n Hub to your system (e.g. "person created", "assessment submitted"):

1. **Admin** → **Integrations** → **Webhooks** (or **Outbound**).
2. **Add webhook** — URL, optional secret for signing payloads, and **event types** to subscribe to.
3. Save. Agentic A8n Hub will POST a JSON payload to the URL on each selected event. Implement idempotency and verify the signature.

Use webhooks to keep external tools in sync or to trigger workflows (e.g. Slack, HRIS) when key events happen in Agentic A8n Hub.
