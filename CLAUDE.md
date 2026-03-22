# CLAUDE.md — Dev Portfolio Development Guide

> This file configures Claude AI agent behavior when working on this codebase. Keep it at the project root and update it as the project evolves.

---

## Project Identity

- **Name:** Dev Portfolio
- **Purpose:** Personal developer portfolio + admin CMS (manage content, Jira tickets, PDF invoices, email)
- **URL (local):** http://localhost:3000
- **Package Manager:** Bun (NEVER use npm, yarn, or pnpm)
- **Runtime:** Bun + Node.js compatible
- **Framework:** Next.js (Pages Router ONLY — this project uses `pages/`, NOT `app/`)
- **Language:** TypeScript (strict mode)

---

## Current Structure vs Target Structure

> **This project is actively being refactored from a flat structure to a feature-based structure.** When touching any file, migrate it toward the feature-based layout described below. Never create new flat files under `src/components/` for feature-specific code — always put new work in the correct `src/features/` directory.

### Current (flat — being phased out)

```
src/
  components/       ← shared + feature components mixed together (being split)
  hooks/            ← all hooks mixed together (being split)
  icons/            ← keep as-is (shared icon library)
  lib/              ← utilities, db, auth, external clients
  pages/
    admin/          ← experiences, invoices, jira, jobs, profile, projects, references, settings, signin, skills
    api/            ← API route handlers
    contact/
    info/
    portfolio/
    project/
    _app.tsx
    _document.tsx
    404.tsx
    index.tsx
  types/            ← global types (keep, but co-locate feature types in features/)
  globals.css
  middleware.ts
```

### Target (feature-based — build toward this)

```
src/
  features/
    admin/                     ← admin dashboard shell, layout, sidebar nav
    experiences/               ← work experience CRUD (admin + public display)
    invoices/                  ← PDF invoice generation and management
    jira/                      ← Jira ticket integration (create, list, delete)
    jobs/                      ← job listings/applications management
    portfolio/                 ← portfolio projects (public display + admin CRUD)
    profile/                   ← personal profile info (bio, avatar, links)
    references/                ← professional references management
    skills/                    ← skills list management
    contact/                   ← contact form + Resend email sending
    email/                     ← shared email templates (React Email)
  components/
    ui/                        ← shadcn primitives only
    layout/                    ← Navbar, Footer, PageWrapper, AdminLayout
    shared/                    ← truly shared components used across 3+ features
  hooks/                       ← truly shared hooks (useMediaQuery, useDebounce, etc.)
  icons/                       ← icon library (unchanged)
  lib/
    db.ts                      ← Drizzle client
    auth.ts                    ← NextAuth config
    utils.ts                   ← cn() and general utilities
    resend.ts                  ← Resend client instance
    jira.ts                    ← Jira API client/helpers
    s3.ts                      ← AWS S3 presigned URL helpers (if used)
  pages/                       ← ONLY Next.js routing files live here
    admin/                     ← thin page files that import from features/admin/*
    api/                       ← API route handlers
    contact/
    info/
    portfolio/
    project/
    _app.tsx
    _document.tsx
    404.tsx
    index.tsx
  types/                       ← global/shared types only
  globals.css
  middleware.ts
```

### Migration Rule

When you touch a file during any task, check if it belongs in `features/`. If yes, move it. The `pages/` files should be thin shells: import the feature component and export it as the default. Example:

```typescript
// pages/admin/invoices.tsx — THIN SHELL (correct)
import { InvoicesPage } from "@/features/invoices/components/invoices-page"
import { AdminLayout } from "@/components/layout/admin-layout"

export default function Invoices() {
  return (
    <AdminLayout>
      <InvoicesPage />
    </AdminLayout>
  )
}
```

---

## Critical Rules (Always Follow)

### Commands

- ALWAYS use `bun` for installs: `bun add <package>`, `bun add -D <package>`
- ALWAYS use `bunx` for CLI tools: `bunx drizzle-kit generate`
- Dev server: `bun dev`
- Build: `bun run build`
- Lint: `bun run lint`
- **After completing ANY task that modifies code, run `bun run build` to confirm zero errors before declaring the task done.**

### CI Check (MANDATORY After Every Code Task)

Before ending any response that changed code:

1. Mentally confirm no TypeScript errors were introduced
2. State that the user should run `bun run build` to verify
3. If you ran bash commands during the task, actually execute `bun run build` and confirm it passes
4. If build fails, fix all errors before ending the response — never leave the build broken

### TypeScript & React

- ALWAYS use TypeScript — never create `.js` or `.jsx` files (except config files that require it)
- This project uses the **Pages Router** — NEVER use `app/` directory patterns, `metadata` exports, Server Components, Server Actions, or `"use server"` directives
- Data fetching uses `getServerSideProps`, `getStaticProps`, or client-side fetch — choose appropriately
- Use `getServerSideProps` for pages that need auth-protected or real-time data (admin pages)
- Use `getStaticProps` with `revalidate` for public pages where data changes infrequently (portfolio, skills, info)
- Client-side fetch with SWR or `useEffect` is acceptable for admin dashboard mutations and live updates
- NEVER use `React.FC` — use plain function declarations with typed props
- Destructure props in function parameters: `function ProjectCard({ title, href }: ProjectCardProps)`
- Use `satisfies` operator for type-safe object literals where appropriate

### Pages Router Specifics

- `_app.tsx` is the global layout wrapper — add providers here (ThemeProvider, SessionProvider, Toaster)
- `_document.tsx` is for HTML shell customization only (fonts, meta charset, etc.)
- API routes live in `pages/api/` — these are the mutation layer (equivalent to Server Actions in App Router)
- Middleware (`middleware.ts`) handles auth protection for `/admin/*` routes
- Dynamic routes use file-based patterns: `pages/project/[slug].tsx`
- Use `next/router` (`useRouter`) for client-side navigation — NOT `next/navigation`
- Use `next/link` for all internal links
- Use `next/image` for all images — never raw `<img>` tags
- Use `next/head` for per-page metadata (title, description, og tags)
- Use `next/dynamic` for heavy client components: `dynamic(() => import('...'), { ssr: false })`

---

## Feature Breakdown & Patterns

### Admin CMS

The admin dashboard (`pages/admin/`) is a private CMS protected by NextAuth middleware. Each admin page manages a specific domain of content.

**Admin pages and their purpose:**

| Page                | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `admin/index`       | Dashboard overview, recent activity, quick stats |
| `admin/experiences` | CRUD for work experience entries                 |
| `admin/jobs`        | Job listings or application tracker              |
| `admin/projects`    | CRUD for portfolio projects                      |
| `admin/skills`      | Manage skills list                               |
| `admin/references`  | Manage professional references                   |
| `admin/profile`     | Edit personal bio, avatar, social links          |
| `admin/invoices`    | Generate and manage PDF invoices                 |
| `admin/jira`        | Create, view, and delete Jira tickets            |
| `admin/settings`    | App settings (email config, API keys UI)         |
| `admin/signin`      | Auth sign-in page                                |

All admin pages must:

- Check session server-side in `getServerSideProps` and redirect to `/admin/signin` if unauthenticated
- Use `AdminLayout` component that wraps content with sidebar nav
- Return `{ redirect }` from `getServerSideProps` rather than relying solely on middleware for defense in depth

**Standard admin page pattern:**

```typescript
// pages/admin/experiences.tsx
import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminLayout } from "@/components/layout/admin-layout"
import { ExperiencesPage } from "@/features/experiences/components/experiences-page"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) {
    return { redirect: { destination: "/admin/signin", permanent: false } }
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

### API Routes Pattern

API routes in `pages/api/` are the mutation layer. Keep them thin — import logic from `features/` or `lib/`.

```typescript
// pages/api/experiences/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

### Invoice PDF Generation

Invoice generation uses `pdf-lib`. Keep all invoice logic in `src/features/invoices/`.

- Generate PDFs server-side in API routes (`pages/api/invoices/`)
- Return PDF as a `Buffer` with `Content-Type: application/pdf`
- Store invoice metadata in the database; store the generated PDF in S3 if persistence is needed
- Never generate PDFs client-side — always a server API route

### Jira Integration

Jira client config lives in `src/lib/jira.ts`. Feature logic lives in `src/features/jira/`.

- Use Jira REST API v3 with Basic Auth (email + API token)
- Jira API token goes in `.env.local` as `JIRA_API_TOKEN`, email as `JIRA_EMAIL`, domain as `JIRA_DOMAIN`
- All Jira calls must happen in API routes or `getServerSideProps` — NEVER expose credentials client-side
- The Jira page should support: list issues, create issue, delete/transition issue

### Email (Resend)

- Resend client lives in `src/lib/resend.ts`
- Email templates live in `src/features/email/templates/` using React Email
- All email sends happen in API routes only — never from client-side code
- Always include a plain text fallback
- Contact form submits to `pages/api/contact.ts` which sends via Resend

```typescript
// src/lib/resend.ts
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
```

### Authentication (NextAuth v5)

- Config lives in `src/lib/auth.ts` — export `authOptions` for use in API routes
- Use `getServerSession(req, res, authOptions)` in API routes and `getServerSideProps`
- Use `useSession()` client-side for session state
- Middleware protects `/admin/*` routes at the edge
- Sign-in page lives at `/admin/signin`
- Use credentials provider for simple email/password or magic link — keep it minimal for a personal portfolio

### Database (Drizzle ORM)

- Drizzle client lives in `src/lib/db.ts`
- Schema files live in `src/drizzle/schema/` — one file per domain
- Column naming: snake_case in DB, camelCase in TypeScript
- Always include `created_at` and `updated_at` timestamps
- Use UUID primary keys: `uuid("id").defaultRandom().primaryKey()`
- Run migrations with: `bunx drizzle-kit generate` → `bunx drizzle-kit migrate`

---

## Styling

- Use Tailwind CSS utility classes — never write custom CSS unless absolutely necessary
- Use `cn()` from `src/lib/utils.ts` for conditional class merging
- Use CVA (`class-variance-authority`) for component variants
- Use shadcn/ui components as the base — customize via Tailwind, never rewrite from scratch
- ALWAYS support dark mode via `next-themes` — use `dark:` variants or CSS variables
- Never use inline styles unless dynamic values require it

---

## File & Folder Conventions

- Feature-based structure: group components, hooks, actions/queries, and types inside `src/features/<feature-name>/`
- Each feature directory should have an `index.ts` barrel export
- Shared UI primitives: `src/components/ui/` (shadcn only)
- Shared layout: `src/components/layout/`
- Truly shared components (3+ features): `src/components/shared/`
- File naming: kebab-case for files (`invoice-card.tsx`), PascalCase for component exports (`InvoiceCard`)
- Types co-located with their feature; global types in `src/types/`

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
  types/
    invoice-types.ts
  index.ts
```

---

## Dependency Hygiene

- **Mailchimp**: If any Mailchimp-related packages or code exist, remove them — they are no longer used.
- Before adding any new package, check if the functionality already exists in an installed dependency.
- Keep `package.json` accurate — if you remove a dependency from code, run `bun remove <package>`.
- After removing unused dependencies, run `bun run build` to confirm nothing broke.

---

## Code Quality Checks

Before considering any task complete, verify:

1. **No TypeScript errors** — `bun run build` succeeds
2. **No lint errors** — `bun run lint` passes
3. **No `any` types** — use proper typing or `unknown` with type guards
4. **No unused imports or variables**
5. **No `console.log`** left in production code
6. **Dark mode works** — check both light and dark themes
7. **Mobile responsive** — test at 375px, 768px, 1024px, 1440px
8. **Loading states** — every async operation shows a loading indicator
9. **Error states** — every async operation handles errors gracefully
10. **Auth protected** — all admin routes check session before rendering or returning data
11. **Build verified** — explicitly confirm `bun run build` passes at the end of every code task

---

## What NOT to Do

- ❌ Don't install packages with npm/yarn/pnpm — always `bun`
- ❌ Don't use App Router patterns (`app/` dir, Server Components, `"use server"`, `metadata` export, `generateMetadata`)
- ❌ Don't use `next/navigation` — use `next/router` (`useRouter`) for this Pages Router project
- ❌ Don't put secrets in `NEXT_PUBLIC_` env vars
- ❌ Don't expose API keys (Resend, Jira, S3) to the client — API routes only
- ❌ Don't write custom CSS when Tailwind utilities exist
- ❌ Don't skip loading and error states
- ❌ Don't use `var` — always `const` or `let`
- ❌ Don't use default exports except for page files, `_app.tsx`, `_document.tsx`, and React components
- ❌ Don't create feature-specific components inside `src/components/` — use `src/features/<name>/components/`
- ❌ Don't leave Mailchimp or other deprecated integrations in code
- ❌ Don't leave the build broken — always verify `bun run build` passes

---

## Environment Variables

Keep `.env.example` updated whenever you add or remove variables. Required variables:

```bash
# Auth
AUTH_SECRET=
AUTH_URL=

# Database
DATABASE_URL=

# Email (Resend)
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Jira
JIRA_EMAIL=
JIRA_API_TOKEN=
JIRA_DOMAIN=
JIRA_PROJECT_KEY=

# AWS S3 (if used for invoice/asset storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
```

---

## Git Commit Messages (MANDATORY)

After completing ANY task that changes code, always end your response with a ready-to-copy commit message.

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

### Rules

- Include a scope when relevant: `feat(invoices):`, `fix(auth):`, `refactor(jira):`
- Keep subject line under 72 characters
- No hyphens or bullet points in the message body — use plain sentences or fragments separated by newlines
- No `git commit -m` wrapper — just the raw message text
- Always label it "Commit message:" on its own line, then a fenced code block so the copy icon appears
- Never use inline backticks for the commit message — always a fenced code block
- Always provide a commit message, no exceptions

### Example

Commit message:

```
refactor(invoices): migrate to feature-based structure

Move invoice components from src/components to src/features/invoices
Add invoice actions module with get, create, delete functions
Thin out pages/admin/invoices.tsx to shell import pattern
Run bun run build confirmed passing
```

---

## Refactoring Priority Order

When refactoring the project to feature-based structure, tackle in this order:

1. **`src/features/admin/`** — shared admin layout, sidebar, nav items
2. **`src/features/portfolio/`** — portfolio project display + admin CRUD
3. **`src/features/experiences/`** — work experience display + admin CRUD
4. **`src/features/skills/`** — skills display + admin management
5. **`src/features/invoices/`** — PDF generation, invoice management
6. **`src/features/jira/`** — Jira ticket integration
7. **`src/features/contact/`** — contact form + email sending
8. **`src/features/references/`** — references display + admin management
9. **`src/features/profile/`** — bio, avatar, links
10. **`src/features/jobs/`** — job/application tracking
11. **`src/features/email/`** — React Email templates

For each migration: create the feature directory, move components/hooks/types in, update imports, thin the page file to a shell, then run `bun run build` to confirm zero errors before moving to the next feature.
