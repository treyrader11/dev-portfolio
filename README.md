# Dev Portfolio

A personal developer portfolio **and** a private admin CMS, built with the Next.js Pages Router. The public site showcases work, projects, and GitHub activity with rich motion/3D; the admin dashboard manages every piece of content and includes **French Quarter Direct (FQD)** — an AI-powered New Orleans event-management tool with LLM web research, Cloudinary image handling, and multi-format exports.

- **Live:** https://treyrader.dev
- **AI agent development guide:** [CLAUDE.md](./CLAUDE.md)

### Product Screenshots

![](./screenshots/landing.png)

![](./screenshots/about.png)

![](./screenshots/projects.png)

---

## Features

### Public site

- Animated, motion-rich landing / about / portfolio pages (Framer Motion, GSAP, Lenis smooth scroll)
- Three.js / React Three Fiber visuals
- Portfolio projects + a live **GitHub contribution calendar** and repos (GitHub REST + GraphQL APIs)
- Contact form with Resend email delivery and Google reCAPTCHA v2 protection
- Shared page-transition system (slide/perspective/opacity) keyed on the route path

### Admin CMS (`/admin`)

Private, session-protected dashboard (NextAuth + `ADMIN_EMAIL` whitelist) to manage:

- **Profile / hero** — bio, avatar, social links
- **Experience**, **Projects**, **Skills**, **References**, **Jobs** — full CRUD
- **Jira** — list / create / transition tickets and log time entries (credentials stored in the DB)
- **Invoices** — generate PDF invoices from tracked time
- **Settings** — app config and integration credentials
- **French Quarter Direct** — the event CMS (below)

### French Quarter Direct (FQD)

An AI event pipeline for New Orleans events:

- **Discover** upcoming events via LLM web search, excluding ones already in the app (fuzzy title de-dupe) and past-dated ones
- **Research / auto-fill** every event field from the web, with a per-page **AI model selector** (Gemini by default, Claude fallback), per-field AI search, and AI category/subcategory + attendance generation
- **Images** — AI image search + website scraping, uploaded to Cloudinary
- **Manage** — poster-style grid or list, filters (missing fields, added-to-Joomla, "new today"), bulk actions, search
- **Notifications** — scheduled emails when events start/expire (Vercel Cron)
- **Exports** — per-event and bulk ZIPs containing a formatted **DOCX**, image **PNGs**, and a **JEvents-compatible CSV** (`event.csv` per folder + `_all-events.csv` at the root); also PDF and email-a-zip

---

## Tech Stack

| Area           | Tech                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------- |
| Framework      | **Next.js 15** (Pages Router), **React 19**, **TypeScript** (strict)                          |
| Package mgr    | **Bun** (never npm/yarn/pnpm)                                                                  |
| Database / ORM | **PostgreSQL** + **Prisma**                                                                    |
| Auth           | **NextAuth v4** — Google + GitHub OAuth, Prisma adapter, `ADMIN_EMAIL` whitelist               |
| Styling        | **Tailwind CSS** + `cn()` (`clsx` + `tailwind-merge`); dark-only theme                         |
| Animation      | Framer Motion, GSAP, Lenis, Three.js / React Three Fiber                                       |
| Images         | **Cloudinary** (upload, transform, PNG delivery)                                               |
| Email          | **Resend** + React Email templates                                                            |
| AI             | **Vercel AI SDK** — `@ai-sdk/google` (Gemini), `@ai-sdk/anthropic` (Claude), `@ai-sdk/openai` |
| Docs / exports | `@react-pdf/renderer` (PDF), `docx` (Word), `date-fns` (CSV dates), `jszip` (ZIP)              |
| State / forms  | Zustand, React Hook Form + Zod, `p-limit` (AI concurrency)                                     |
| Hosting        | Vercel (+ Vercel Cron for FQD jobs)                                                           |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (this project uses Bun exclusively)
- A PostgreSQL database (e.g. Neon or Supabase)

### Setup

```bash
# 1. Install dependencies
bun install

# 2. Configure environment
cp .env.example .env.local
#    then fill in the values (see below)

# 3. Apply the database schema
bunx prisma migrate dev

# 4. Start the dev server (http://localhost:3000)
bun dev
```

### Scripts

| Command               | Description                             |
| --------------------- | --------------------------------------- |
| `bun dev`             | Start the dev server on port 3000       |
| `bun run build`       | `prisma generate` then `next build`     |
| `bun start`           | Start the production server             |
| `bun run lint`        | Run ESLint                              |
| `bun run email`       | Preview React Email templates locally   |
| `bunx prisma studio`  | Browse the database                     |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values. The full set the app uses:

- **App / Auth:** `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET`, `GITHUB_AUTH_TOKEN`, `ADMIN_EMAIL`
- **Email / contact:** `RESEND_API_KEY`, `CONTACT_FORM_TO_EMAIL`, `RESEND_CONTACT_FROM_EMAIL`, `RESEND_AUTOREPLY_FROM_EMAIL`, `RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- **AI (FQD):** `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
- **Cloudinary:** `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_URL`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- **Cron:** `CRON_SECRET`

> There are no `JIRA_*` or AWS/S3 env vars — Jira credentials live in the database (admin settings) and images use Cloudinary.

---

## Project Structure

```
src/
  features/        Feature modules (admin, fqd, portfolio, experiences, skills,
                   references, profile, jobs, invoices, jira, github)
    <feature>/
      components/  UI for the feature
      hooks/       Feature hooks
      actions/     Server-side data access (Prisma)
      lib/         Feature logic (e.g. fqd/lib/fqd-research.ts, event-csv.ts)
      types/       Feature types
  components/       Shared UI, layout, and ui/ primitives
  hooks/            Shared hooks
  icons/            Shared icon library
  lib/              prisma.ts, cloudinary.ts, jira.ts, utils.ts, emails/
  pages/
    admin/          Thin admin route shells that import feature components
    api/            API routes (the mutation layer)
    ...             Public routes
  types/            Global types
  middleware.ts     Protects /admin/*
prisma/schema.prisma  Single Prisma schema
```

Architecture notes: **Pages Router only** (no `app/`, Server Components, or `"use server"`), feature-based organization, API routes as the mutation layer, and `getServerSideProps` session checks on admin pages. See [CLAUDE.md](./CLAUDE.md) for the full conventions.

---

## Deployment

Deployed on **Vercel**. A daily Vercel Cron job hits `/api/fqd/process-events` (protected by `CRON_SECRET`) to send FQD start/expiry notifications and clean up past events. `bun run build` runs `prisma generate` automatically.

---

## AI Agent Guide

This repo is developed with AI coding agents. [CLAUDE.md](./CLAUDE.md) documents the mandatory conventions, tech stack, environment, and workflow rules agents must follow — and is kept up to date as the app evolves.
