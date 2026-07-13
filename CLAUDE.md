# CLAUDE.md — Dev Portfolio Development Guide

> Configures AI-agent behavior for this codebase. Keep it at the project root.

## Keeping this file current (MANDATORY)

**Claude Code must update this file as part of any task that changes what it documents.** Before finishing a task, check whether the work invalidates or extends anything here — and if so, edit CLAUDE.md in the same change. This includes:

- New or changed **tech / dependencies** (a `bun add`/`bun remove`) → update the Tech Stack and, if relevant, the README
- New or changed **environment variables** → update the Environment Variables section to mirror `.env.example` exactly
- New **features, admin pages, API routes, or exports** → document them in Feature Breakdown & Patterns
- New **conventions or rules** the user establishes during a task → capture them so they persist
- Anything here that becomes **false** (renamed files, changed architecture) → correct it

Never let CLAUDE.md drift from the actual codebase. When you finish a task, if nothing here needed changing, that's fine — but you must have checked.

## Project Identity

- **Name:** Dev Portfolio
- **Purpose:** Personal developer portfolio + private admin CMS — portfolio projects, work experience, skills, references, jobs, Jira tickets with time tracking, PDF invoices, a GitHub contribution showcase, a contact form, and **French Quarter Direct (FQD)**, an AI-powered New Orleans event-management tool.
- **URL (local):** http://localhost:3000
- **Framework:** Next.js 15 (**Pages Router ONLY** — `pages/`, NOT `app/`)
- **Language:** TypeScript (strict), React 19
- **Package Manager:** Bun (NEVER npm/yarn/pnpm)

## Tech Stack (actual)

- **Database / ORM:** PostgreSQL + **Prisma** — `prisma/schema.prisma`, client at `src/lib/prisma.ts`
- **Auth:** **NextAuth v4** — Google + GitHub OAuth, Prisma adapter, `ADMIN_EMAIL` whitelist for admin access
- **Styling:** Tailwind CSS + `cn()` (`clsx` + `tailwind-merge`). No CVA, no shadcn/ui, no `next-themes`. Dark-only theme.
- **Animation:** Framer Motion, GSAP, Lenis smooth scroll, Three.js / React Three Fiber (public site)
- **Images:** Cloudinary (upload, transform, PNG delivery) — `src/lib/cloudinary.ts`. No AWS S3.
- **Email:** Resend + React Email templates (`src/lib/emails/`, `src/features/fqd/emails/`)
- **AI:** Vercel AI SDK (`ai`) with `@ai-sdk/google` (Gemini, default), `@ai-sdk/anthropic` (Claude), `@ai-sdk/openai`
- **Docs/exports:** `@react-pdf/renderer` (PDF), `docx` (Word), `jszip` (zips), `mammoth`/`pdf-parse` (ingest)
- **State/forms:** Zustand, React Hook Form + Zod; `p-limit` for AI concurrency; Vercel Cron for FQD jobs

## Commands

- Dev server: `bun dev`
- Build (runs `prisma generate` first): `bun run build`
- Lint: `bun run lint`
- Prisma: `bunx prisma migrate dev --name <change>`, `bunx prisma generate`, `bunx prisma studio`
- Install deps: `bun add <pkg>` / `bun add -D <pkg>`; CLI tools: `bunx <tool>`
- **After any code change, run `bun run build` and confirm it passes before finishing.**

---

## Naming Convention (MANDATORY)

This project is migrating from PascalCase barrel files to kebab-case feature-based files. All new files and any files touched during a task must follow the new convention:

- **File names:** kebab-case — `event-card.tsx`, `use-events.ts`, `fqd-research.ts`
- **Component exports:** named exports, PascalCase — `export function EventCard()`
- **Page files:** default export only (Next.js requirement) — `export default function CreateEventPage()`
- **Barrel files (`index.ts`):** allowed per feature directory for clean imports, but do not create new barrel files in `src/components/` for feature-specific code
- Do not rename existing PascalCase files unless you are already touching that file for another reason — avoid noisy diffs

---

## Feature Breakdown & Patterns

### Admin CMS

The admin dashboard (`pages/admin/`) is a private CMS protected by NextAuth middleware. Each admin page manages a specific domain of content.

**Admin pages and their purpose:**

| Page                          | Purpose                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `admin/index`                 | Dashboard overview, recent activity, quick stats                              |
| `admin/experiences`           | CRUD for work experience entries                                              |
| `admin/jobs`                  | Job listings or application tracker                                           |
| `admin/projects`              | CRUD for portfolio projects                                                   |
| `admin/skills`                | Manage skills list                                                            |
| `admin/references`            | Manage professional references                                                |
| `admin/profile`               | Edit personal bio, avatar, social links                                       |
| `admin/invoices`              | Generate and manage PDF invoices                                              |
| `admin/jira`                  | Create, view, and delete Jira tickets                                         |
| `admin/settings`              | App settings (email config, API keys UI)                                      |
| `admin/signin`                | Auth sign-in page                                                             |
| `admin/french-quarter-direct` | FQD event listing CMS — discover, research, enrich, export New Orleans events |

All admin pages must:

- Check session server-side in `getServerSideProps` and redirect to `/admin/signin` if unauthenticated
- Use `AdminLayout` component that wraps content with sidebar nav
- Return `{ redirect }` from `getServerSideProps` rather than relying solely on middleware for defense in depth

**Standard admin page pattern:**

```typescript
// pages/admin/experiences.tsx
import type { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import AdminLayout from '@/features/admin/components/admin-layout'
import { ExperiencesPage } from '@/features/experiences/components/experiences-page'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) {
    return { redirect: { destination: '/admin/signin', permanent: false } }
  }
  return { props: {} }
}

export default function Experiences() {
  return (
    <AdminLayout>
      <ExperiencesPage />
    </AdminLayout>
  )
}
```

### French Quarter Direct (FQD)

The FQD subsystem lives in `src/features/fqd/` and `src/pages/api/fqd/`. It is an AI-powered event listing CMS that discovers and researches New Orleans events via LLM web search, enriches them with images hosted on Cloudinary, stores them in Postgres, and exports them as DOCX/PDF/ZIP for manual publishing to a Joomla site.

**Key files:**

- `src/features/fqd/lib/fqd-research.ts` — single AI engine, 7 modes, provider fallback chain
- `src/features/fqd/types/fqd-types.ts` — Zod schemas and TypeScript types for all 16 event fields
- `src/features/fqd/lib/scrape-images.ts` — og:image regex scraper with SSRF guard
- `src/features/fqd/lib/serialize.ts` — data transformation between DB and client shapes (`FqdEventListItem`)
- `src/features/fqd/lib/event-zip.ts` — assembles the export ZIP (one folder per event)
- `src/features/fqd/lib/event-listing-docx.ts` — the per-event listing `.docx`
- `src/features/fqd/lib/event-csv.ts` — JEvents-compatible CSV generator

**Exports (ZIP structure):**

`buildEventsZip` (in `event-zip.ts`) builds the bulk export; the route is `pages/api/fqd/events/export-zip.ts`. Events flow through the export as the serialized `FqdEventListItem` (ISO date strings), NOT the Prisma `FqdEvent`. Each ZIP contains, per event, a folder named by slug with:

- `<slug>.docx` — formatted listing (mirrors the event detail page fields)
- `event.csv` — single-row JEvents CSV (header + that event)
- image `PNG`s (unless `includeImages: false`, used by the email-a-zip path)

Plus, at the ZIP root: `_all-events.csv` — a combined JEvents CSV (one header + one row per event). CSV columns are fixed: `CATEGORIES, SUMMARY, LOCATION, DESCRIPTION, CONTACT, X-EXTRAINFO, DTSTART, DTEND, TIMEZONE, RRULE`; every field is double-quoted with inner quotes doubled; dates use `date-fns` and `TIMEZONE` is `America/Chicago`. When changing exports, do not alter the DOCX, image, or PDF logic or the `addedToJoomla` flag unless the task requires it.

**Provider order (Gemini first — it is free tier):**

The fallback chain must always be: Gemini → Anthropic. OpenAI is not in the FQD chain. When a preferred provider is passed from the UI selector, use it directly with no fallback — do not silently switch providers on the user.

**AI model selector (create-event page):**

The create-event page has a top-level AI provider/model dropdown that defaults to Gemini. Every AI action on the page (auto-fill, per-field generate, description, image search, classification) must read from this selector and pass the chosen provider through to the API route and into `fqd-research.ts`. Never hardcode a provider on the create-event page.

**Error feedback colors (create-event page):**

- Green: results returned successfully
- Amber: quota exceeded, rate limited, no results found
- Red: network errors, validation failures, unexpected errors

**Cost rules:**

- Gemini free tier handles the majority of calls — default to it
- Anthropic is the paid fallback — only used when Gemini fails or is explicitly selected
- Never run more than 2 concurrent AI calls (p-limit concurrency 2)
- Use `generateObject` with Zod schemas from `fqd-types.ts` — never `generateText` with post-hoc JSON parsing

### API Routes Pattern

API routes in `pages/api/` are the mutation layer. Keep them thin — import logic from `features/` or `lib/`.

```typescript
// pages/api/experiences/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  getExperiences,
  createExperience,
} from "@/features/experiences/actions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const data = await getExperiences();
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const result = await createExperience(req.body);
    return res.status(201).json(result);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
```

### Invoice / PDF Generation

Invoices and FQD event PDFs use **`@react-pdf/renderer`** (React components → PDF). Invoice logic lives in `src/features/invoices/` (template at `src/features/invoices/lib/invoice-template.tsx`).

- Generate PDFs server-side in API routes (e.g. `pages/api/admin/invoices/[id].ts`)
- Return the PDF as a `Buffer` with `Content-Type: application/pdf`
- Store invoice metadata in the database (`Invoice` / `InvoiceLineItem` models)
- Never generate PDFs client-side — always a server API route
- DOCX exports use `docx`; multi-file downloads are zipped with `jszip`

### Jira Integration

Jira request helpers live in `src/lib/jira.ts`; the authenticated client is `src/features/jira/lib/jira-client.ts`; feature UI lives in `src/features/jira/`.

- Use the Jira REST API v3 with Basic Auth (email + API token)
- Credentials are **stored in the database** (`SiteConfig`) and edited via the admin settings page — there are NO `JIRA_*` env vars
- All Jira calls happen in API routes or `getServerSideProps` — NEVER expose credentials client-side
- Supports: list issues, create issue, delete/transition issue, and log time entries

### Email (Resend)

- Resend is instantiated inline where it is used (`new Resend(process.env.RESEND_API_KEY)`) — there is no `src/lib/resend.ts`
- React Email templates live in `src/lib/emails/` (shared) and `src/features/fqd/emails/` (event start/expiry notifications)
- All email sends happen in API routes / server code only — never from the client
- Contact form submits to `pages/api/contact.tsx` (Resend + reCAPTCHA verification)
- FQD notification/export emails send via `src/features/fqd/lib/event-notifications.ts` and `pages/api/fqd/events/email-export.ts`

### Authentication (NextAuth v4)

- Config + `authOptions` live in `src/pages/api/auth/[...nextauth].ts`
- Providers: **Google OAuth** and **GitHub OAuth**; admin access is gated by the `ADMIN_EMAIL` whitelist (comma-separated)
- Sessions/accounts persist to Postgres via `@auth/prisma-adapter`
- Use `getServerSession(req, res, authOptions)` in API routes and `getServerSideProps`; `useSession()` client-side
- `src/middleware.ts` protects `/admin/*` routes at the edge; sign-in page is `/admin/signin`

### Database (Prisma + PostgreSQL)

- Prisma client singleton lives in `src/lib/prisma.ts` (import as `import { prisma } from "@/lib/prisma"`)
- Single schema file: `prisma/schema.prisma` (models: User, Account, Session, VerificationToken, SiteConfig, Experience, Project, Skill, Reference, TimeEntry, Invoice, InvoiceLineItem, FqdEvent, FqdEventImage)
- UUID primary keys; camelCase fields in TypeScript; `createdAt` / `updatedAt` timestamps
- `bun run build` runs `prisma generate` automatically. For schema changes: `bunx prisma migrate dev --name <change>` then `bunx prisma generate`
- Never wipe the database — migrations must be additive; verify before applying

---

## Styling

- Use Tailwind CSS utility classes — never write custom CSS unless absolutely necessary
- Use `cn()` from `src/lib/utils.ts` (`clsx` + `tailwind-merge`) for conditional class merging
- The project does NOT use CVA, shadcn/ui, or `next-themes` — do not introduce them; build components with plain Tailwind + `cn()`
- The app is **dark by default** (custom theme colors like `dark`, `dark-400/500/600`, `secondary`, `light-400`); the admin is permanently dark. There is no light/dark toggle — do not add `dark:` variants expecting a theme switch
- Icons come from `react-icons` (mainly `react-icons/ri`); `@tabler/icons-react` is also available
- **Dropdown / select controls:** use the **custom dropdown** (the `Popover`-based component, e.g. `@/components/ui/popover`) on **desktop**, and a **native `<select>`** on **mobile** (so the OS renders its nicely-animated native picker). Render both and switch with responsive classes (`hidden sm:block` for the custom one, `sm:hidden` for the native `<select>`); keep them driven by the same state. The events-list filter (`events-list-page.tsx`) is the reference implementation.
- Never use inline styles unless dynamic values require it

---

## File & Folder Conventions

- Feature-based structure: group components, hooks, actions/queries, and types inside `src/features/<feature-name>/`
- Each feature directory can have an `index.ts` barrel export
- Shared UI primitives: `src/components/ui/` (plain Tailwind components, e.g. `chip.tsx`, `popover.tsx`, `multi-step-loader.tsx`)
- Shared layout / admin shell: `src/components/`, `src/features/admin/components/`
- Reusable generic components (dropdowns, inputs, accordions, buttons, etc.): `src/components/shared/`
- Shared icon library: `src/icons/`; shared hooks: `src/hooks/`
- File naming: kebab-case for files (`invoice-card.tsx`), PascalCase for component exports (`InvoiceCard`)
- Types co-located with their feature; global types in `src/types/`
- Actual feature directories: `admin`, `fqd`, `portfolio`, `experiences`, `skills`, `references`, `profile`, `jobs`, `invoices`, `jira`, `github`

**Feature directory structure:**

```
src/features/invoices/
  components/
    invoices-page.tsx
    invoice-card.tsx
    invoice-form.tsx
  hooks/
    use-invoices.ts
  actions/
    get-invoices.ts
    create-invoice.ts
    delete-invoice.ts
  lib/
    invoice-template.tsx
  types/
    invoice-types.ts
  index.ts
```

---

## Dependency Hygiene

- **Mailchimp**: If any Mailchimp-related packages or code exist, remove them — they are no longer used
- Before adding any new package, check if the functionality already exists in an installed dependency
- Keep `package.json` accurate — if you remove a dependency from code, run `bun remove <package>`
- After removing unused dependencies, run `bun run build` to confirm nothing broke

---

## Code Quality Checks

Before considering any task complete, verify:

1. **No TypeScript errors** — `bun run build` succeeds
2. **No lint errors** — `bun run lint` passes
3. **No `any` types** — use proper typing or `unknown` with type guards
4. **No unused imports or variables**
5. **No `console.log`** left in production code (intentional server-side diagnostics are fine)
6. **Dark theme** — the app is dark-only; new UI must read well on the dark surface (there is no light theme)
7. **Mobile responsive** — test at 375px, 768px, 1024px, 1440px
8. **Loading states** — every async operation shows a loading indicator
9. **Error states** — every async operation handles errors gracefully
10. **Auth protected** — all admin routes check session before rendering or returning data
11. **Build verified** — explicitly confirm `bun run build` passes at the end of every code task

---

## What NOT to Do

- Do not install packages with npm/yarn/pnpm — always `bun`
- Do not use App Router patterns (`app/` dir, Server Components, `'use server'`, `metadata` export, `generateMetadata`)
- Do not use `next/navigation` — use `next/router` (`useRouter`) for this Pages Router project
- Do not put secrets in `NEXT_PUBLIC_` env vars
- Do not expose secrets (Resend, Jira, Cloudinary secret, Anthropic, Gemini, OpenAI, `GITHUB_AUTH_TOKEN`) to the client — server/API routes only
- Do not write custom CSS when Tailwind utilities exist
- Do not skip loading and error states
- Do not use `var` — always `const` or `let`
- Do not use default exports except for page files, `_app.tsx`, `_document.tsx`, and React components
- Do not create feature-specific components inside `src/components/` — use `src/features/<name>/components/`
- Do not build one-off versions of standard UI elements inside feature directories — create reusable components in `src/components/shared/` first
- Do not leave Mailchimp or other deprecated integrations in code
- Do not leave the build broken — always verify `bun run build` passes
- Do not use double quotes in commit messages — single quotes only if quoting is needed

---

## Environment Variables

Keep `.env.example` updated whenever you add or remove variables. This mirrors `.env.example` exactly — every variable the app actually uses:

```bash
# App / Site
NEXTAUTH_URL=http://localhost:3000
# Public site URL — absolute URLs in email templates (images, links)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Database (PostgreSQL — Neon, Supabase, etc.)
DATABASE_URL=

# Auth (NextAuth v4)
NEXTAUTH_SECRET=
# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
# GitHub PAT (read:user) — higher REST rate limits + GraphQL contribution
# calendar on /portfolio. Without it the GithubContributions section is hidden.
GITHUB_AUTH_TOKEN=
# Admin whitelist (comma-separated emails)
ADMIN_EMAIL=

# Email (Resend)
RESEND_API_KEY=
CONTACT_FORM_TO_EMAIL=
# "From" addresses (must be on a verified Resend domain)
RESEND_CONTACT_FROM_EMAIL="Dev Portfolio <contact@yourdomain.com>"
RESEND_AUTOREPLY_FROM_EMAIL="Your Name <noreply@yourdomain.com>"

# Google reCAPTCHA v2 (contact form)
RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

# AI services (FQD research; Gemini is the default/free provider)
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=

# Cloudinary (image uploads/delivery)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_URL=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# Vercel Cron auth — sent as "Authorization: Bearer <CRON_SECRET>" to protect
# the scheduled event-processing route (/api/fqd/process-events).
CRON_SECRET=
```

> There are no `JIRA_*` or `AWS_*` env vars — Jira credentials are stored in the DB via admin settings, and images use Cloudinary (not S3).

---

## Git Commit Messages (MANDATORY)

After completing ANY task that changes code, always end your response with TWO commit messages in this exact format.

### Rules

- Single quotes only if quoting is needed inside a message — never double quotes (they break shell git commit -m)
- No special characters that could escape shell quoting: no backticks, no parentheses in the subject line, no angle brackets
- Use only letters, numbers, spaces, hyphens, colons, commas, and periods
- Subject line under 72 characters
- Prefix with scope when relevant: `feat(fqd):`, `fix(auth):`, `refactor(jira):`
- Never wrap in `git commit -m` — just the raw message text in a fenced code block so the copy icon appears

### Prefixes

| Prefix      | Use For                                               |
| ----------- | ----------------------------------------------------- |
| `feat:`     | New features                                          |
| `fix:`      | Bug fixes                                             |
| `refactor:` | Code restructuring, no behavior change                |
| `chore:`    | Build process, dependency updates, removing dead code |
| `docs:`     | Documentation only                                    |
| `style:`    | Formatting, no logic change                           |
| `perf:`     | Performance improvements                              |
| `test:`     | Tests                                                 |

### Format (always provide both)

**Brief commit message:**

feat(fqd): add Gemini-first provider chain with model selector

**PR-style commit message:**

feat(fqd): add Gemini-first provider chain with model selector
Swap fallback order to Gemini then Anthropic, remove OpenAI from FQD chain
Add top-level AI model dropdown on create-event page defaulting to Gemini
Thread selected provider through all AI actions and API routes
Add p-limit concurrency cap of 2 on all AI loops
Switch generateText to generateObject using existing Zod schemas
Show green for results, amber for quota and no results, red for errors
Run bun run build confirmed passing

---

## Refactoring Priority Order

When refactoring the project to feature-based structure, tackle in this order:

1. `src/features/admin/` — shared admin layout, sidebar, nav items
2. `src/features/fqd/` — French Quarter Direct event CMS
3. `src/features/portfolio/` — portfolio project display + admin CRUD
4. `src/features/experiences/` — work experience display + admin CRUD
5. `src/features/skills/` — skills display + admin management
6. `src/features/invoices/` — PDF generation, invoice management
7. `src/features/jira/` — Jira ticket integration
8. `src/features/references/` — references display + admin management
9. `src/features/profile/` — bio, avatar, links
10. `src/features/jobs/` — job/application tracking
11. `src/features/github/` — GitHub repos + contribution calendar (public portfolio)

> Contact form lives in `pages/api/contact.tsx` + `src/components`; React Email templates live in `src/lib/emails/` and `src/features/fqd/emails/` (there is no standalone `email` feature directory).

For each migration: create the feature directory, move components/hooks/types in, update imports, thin the page file to a shell, then run `bun run build` to confirm zero errors before moving to the next feature.
