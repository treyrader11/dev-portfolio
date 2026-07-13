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
import { authOptions } from '@/lib/auth'
import { AdminLayout } from '@/components/layout/admin-layout'
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
- `src/features/fqd/lib/fqd-types.ts` — Zod schemas and TypeScript types for all 16 event fields
- `src/features/fqd/lib/scrape-images.ts` — og:image regex scraper with SSRF guard
- `src/features/fqd/lib/serialize.ts` — data transformation between DB and client shapes

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

### Database (Drizzle ORM)

- Drizzle client lives in `src/lib/db.ts`
- Schema files live in `src/drizzle/schema/` — one file per domain
- Column naming: snake_case in DB, camelCase in TypeScript
- Always include `created_at` and `updated_at` timestamps
- Use UUID primary keys: `uuid('id').defaultRandom().primaryKey()`
- Run migrations with: `bunx drizzle-kit generate` then `bunx drizzle-kit migrate`

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
- Reusable generic components (dropdowns, inputs, accordions, buttons, etc.): `src/components/shared/`
- File naming: kebab-case for files (`invoice-card.tsx`), PascalCase for component exports (`InvoiceCard`)
- Types co-located with their feature; global types in `src/types/`

**Feature directory structure:**

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
5. **No `console.log`** left in production code
6. **Dark mode works** — check both light and dark themes
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
- Do not expose API keys (Resend, Jira, S3, Anthropic, Gemini, OpenAI) to the client — API routes only
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

# AI providers (FQD event research)
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
```

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
8. `src/features/contact/` — contact form + email sending
9. `src/features/references/` — references display + admin management
10. `src/features/profile/` — bio, avatar, links
11. `src/features/jobs/` — job/application tracking
12. `src/features/email/` — React Email templates

For each migration: create the feature directory, move components/hooks/types in, update imports, thin the page file to a shell, then run `bun run build` to confirm zero errors before moving to the next feature.
