import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  generateObject,
  generateText,
  stepCountIs,
  Output,
  type LanguageModel,
  type ToolSet,
} from "ai";
import { z } from "zod";
import type { FqdEvent } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  eventResearchSchema,
  discoveredEventSchema,
  type EventResearch,
  type DiscoveredEvent,
  type FqdProvider,
} from "../types/fqd-types";
import { splitListings, chunk } from "./split-listings";

// `gemini-flash-latest` always resolves to the current stable Flash model, so
// it won't hit "model no longer available" as Google retires dated versions.
const GEMINI_MODEL = "gemini-flash-latest";
const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

// Fallback order: Gemini first (free), then Anthropic. OpenAI is intentionally
// not a runner here.
const PROVIDER_ORDER: FqdProvider[] = ["gemini", "anthropic"];

export const PROVIDER_META: Record<
  FqdProvider,
  { providerLabel: string; searchEngine: string }
> = {
  gemini: { providerLabel: "Gemini (Google)", searchEngine: "Google Search" },
  anthropic: {
    providerLabel: "Claude (Anthropic)",
    searchEngine: "Anthropic Web Search",
  },
  // Label kept only so the map covers the FqdProvider type — there is no OpenAI
  // runner; selecting it surfaces a clear "not available" error.
  openai: { providerLabel: "ChatGPT (OpenAI)", searchEngine: "OpenAI" },
};

// Per-field content rules. Category/subcategory hold MULTIPLE comma-separated
// labels (the form renders them as pills), and expected attendance should be
// estimated rather than left blank.
const FIELD_GUIDANCE = `Field rules:
- "category": one or two broad category labels as a comma-separated string, e.g. "Festival, Music".
- "subcategory": two or three specific subcategory labels as a comma-separated string, e.g. "Jazz Concert, Second Line Parade, Outdoor Festival". Include multiple when more than one applies — do not return just one when several fit.
- "startDate"/"endDate": use YYYY-MM-DD. Leave endDate null for a single-day event.
- "expectedAttendance": the expected number of attendees as a number or range, e.g. "5,000" or "10,000-15,000". If it isn't explicitly stated, give a reasonable estimate based on the event's type, venue, and scale rather than null.`;

const FQD_SYSTEM_PROMPT = `You are a New Orleans event data researcher. Given an event name, search query, or listing text, determine the event's structured details. Leave a field null only when you cannot determine it with reasonable confidence.

${FIELD_GUIDANCE}`;

const FQD_BULK_SYSTEM_PROMPT = `You are a New Orleans event data extractor. The input contains one or more event listings. Return one object per distinct listing, in the same order. Leave a field null when you cannot determine it.

${FIELD_GUIDANCE}`;

const FQD_DISCOVER_SYSTEM_PROMPT = `You are a New Orleans events researcher. Search the web for UPCOMING, planned New Orleans events scheduled in the future — festivals, parades, second lines, concerts, food & drink events, cultural celebrations, sports, markets, and similar public happenings.

You will be given a list of events ALREADY in our system. Do NOT include any event that is the same as one already listed, even when the wording differs slightly. Treat titles as the same event when they refer to the same recurring or specific happening — e.g. "Running of the Bulls 2026" is the same as "Running of the Bulls", and "36th Annual Oak Street Po-Boy Festival" is the same as "Oak Street Po-Boy Festival". When in doubt, exclude it.

Only include events taking place on or after today — never events whose date has already passed. Return up to 25 well-sourced events with real, specific dates. If you find none, return an empty array.`;

export class FqdAllProvidersError extends Error {
  attempts: string[];
  constructor(attempts: string[]) {
    super(`AI request failed:\n${attempts.join("\n")}`);
    this.name = "FqdAllProvidersError";
    this.attempts = attempts;
  }
}

// True when the failure messages indicate a rate-limit / quota / credits issue
// (vs. a genuine error), so callers can show the right (amber) message.
export function isQuotaError(attempts: string[]): boolean {
  return attempts.some((a) =>
    /(429|rate.?limit|quota|exceeded|insufficient_quota|billing|too many requests|overloaded|resource[_ ]?exhausted|credit)/i.test(
      a,
    ),
  );
}

function requireKey(name: string): string {
  const key = process.env[name];
  if (!key) throw new Error(`${name} not configured`);
  return key;
}

// The model + its web-search tool set for a provider. Throws for providers with
// no runner (e.g. openai), so selecting one surfaces a clear error.
function providerClient(provider: FqdProvider): {
  model: LanguageModel;
  searchTools: ToolSet;
} {
  if (provider === "gemini") {
    const google = createGoogleGenerativeAI({
      apiKey: requireKey("GEMINI_API_KEY"),
    });
    return {
      model: google(GEMINI_MODEL),
      searchTools: { google_search: google.tools.googleSearch({}) },
    };
  }
  if (provider === "anthropic") {
    const anthropic = createAnthropic({
      apiKey: requireKey("ANTHROPIC_API_KEY"),
    });
    return {
      model: anthropic(ANTHROPIC_MODEL),
      searchTools: {
        web_search: anthropic.tools.webSearch_20250305({ maxUses: 5 }),
      },
    };
  }
  throw new Error(`Provider "${provider}" is not available`);
}

// ---- Structured generation (generateObject / Output.object) ---------------
// generateObject enforces the schema at the SDK level (no post-hoc JSON parsing
// that triggers fallbacks). It can't use tools, so web-search modes use
// generateText + experimental_output, which is schema-enforced too.

async function objectSearch<T>(
  provider: FqdProvider,
  system: string,
  prompt: string,
  schema: z.ZodType<T>,
): Promise<T> {
  const { model, searchTools } = providerClient(provider);
  const { experimental_output } = await generateText({
    model,
    system,
    prompt,
    maxOutputTokens: 4096,
    tools: searchTools,
    stopWhen: stepCountIs(6),
    experimental_output: Output.object({ schema }),
  });
  return experimental_output;
}

async function arraySearch<E>(
  provider: FqdProvider,
  system: string,
  prompt: string,
  element: z.ZodType<E>,
): Promise<E[]> {
  const { model, searchTools } = providerClient(provider);
  const { experimental_output } = await generateText({
    model,
    system,
    prompt,
    maxOutputTokens: 4096,
    tools: searchTools,
    stopWhen: stepCountIs(6),
    experimental_output: Output.array({ element }),
  });
  return experimental_output;
}

async function objectNoSearch<T>(
  provider: FqdProvider,
  system: string,
  prompt: string,
  schema: z.ZodType<T>,
): Promise<T> {
  const { model } = providerClient(provider);
  const { object } = await generateObject({
    model,
    system,
    prompt,
    maxOutputTokens: 4096,
    schema,
  });
  return object;
}

async function arrayNoSearch<E>(
  provider: FqdProvider,
  system: string,
  prompt: string,
  element: z.ZodType<E>,
): Promise<E[]> {
  const { model } = providerClient(provider);
  const { object } = await generateObject({
    model,
    system,
    prompt,
    maxOutputTokens: 4096,
    output: "array",
    schema: element,
  });
  return object;
}

// Run `run` against the selected provider (no fallback) or the default chain
// (Gemini → Anthropic). Surfaces the exact failure reason(s).
async function withFallback<T>(
  run: (provider: FqdProvider) => Promise<T>,
  only?: FqdProvider,
): Promise<{ data: T; provider: FqdProvider }> {
  const order = only ? [only] : PROVIDER_ORDER;
  const errors: string[] = [];
  for (const provider of order) {
    // Retry the SAME provider once on a transient error (5xx / overloaded /
    // timeout) — a one-off web-search hiccup shouldn't fail the request. Not a
    // provider switch, so it respects the "use the selected model" rule. Quota
    // and config errors won't succeed on retry, so they fail fast.
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        return { data: await run(provider), provider };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        const transient =
          !isQuotaError([message]) &&
          /(5\d\d|overloaded|internal|temporar|timed? ?out|econnreset|fetch failed|network|unavailable|no object generated|response did not|could not parse)/i.test(
            message,
          );
        if (attempt === 1 && transient) {
          console.warn(
            `[fqd-research] ${provider} transient error, retrying once. Reason: ${message}`,
          );
          continue;
        }
        errors.push(`${provider}: ${message}`);
        console.warn(
          `[fqd-research] ${provider} failed${only ? "" : ", trying next provider"}. Reason: ${message}`,
        );
        break;
      }
    }
  }
  throw new FqdAllProvidersError(errors);
}

export interface FallbackResult {
  data: EventResearch;
  provider: FqdProvider;
  raw: string;
  cached?: boolean;
}

// ---- 7-day research cache -------------------------------------------------

const toDay = (d: Date | null): string | null =>
  d ? d.toISOString().slice(0, 10) : null;

function rowToResearch(row: FqdEvent): EventResearch {
  return {
    title: row.title,
    startDate: toDay(row.startDate),
    endDate: toDay(row.endDate),
    startTime: row.startTime,
    locationName: row.locationName,
    address: row.address,
    description: row.description,
    admission: row.admission,
    website: row.website,
    category: row.category,
    subcategory: row.subcategory,
    ticketUrl: row.ticketUrl,
    organizer: row.organizer,
    expectedAttendance: row.expectedAttendance,
    ageRequirement: row.ageRequirement,
    notes: row.notes,
  };
}

// Reuse a recently-researched event's data instead of paying for another web
// search: same title (case-insensitive), updated within 7 days, not a draft.
async function findCachedResearch(title: string): Promise<EventResearch | null> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  try {
    const row = await prisma.fqdEvent.findFirst({
      where: {
        title: { equals: title, mode: "insensitive" },
        updatedAt: { gte: since },
        status: { not: "draft" },
      },
      orderBy: { updatedAt: "desc" },
    });
    return row ? rowToResearch(row) : null;
  } catch (e) {
    console.error("[fqd-research] research cache lookup failed:", e);
    return null;
  }
}

// ---- Public modes ---------------------------------------------------------

// Mode 1: research an event by name/query (web search). Checks the 7-day cache
// first (when a title is supplied) to avoid an API call.
export async function researchEventWithFallback(
  query: string,
  provider?: FqdProvider,
  title?: string,
): Promise<FallbackResult> {
  if (title?.trim()) {
    const cached = await findCachedResearch(title.trim());
    if (cached) {
      console.log(
        `[fqd-research] cache hit for "${title.trim()}" (updated within 7 days) — no API call`,
      );
      return {
        data: cached,
        provider: provider ?? "gemini",
        raw: JSON.stringify(cached),
        cached: true,
      };
    }
  }
  const { data, provider: used } = await withFallback(
    (p) =>
      objectSearch(
        p,
        FQD_SYSTEM_PROMPT,
        `Research this New Orleans event, searching the web for accurate, current details. Query: ${query}`,
        eventResearchSchema,
      ),
    provider,
  );
  return { data, provider: used, raw: JSON.stringify(data) };
}

// Mode 2: parse a single raw listing (no web search).
export async function parseEventWithFallback(
  text: string,
  provider?: FqdProvider,
): Promise<FallbackResult> {
  const { data, provider: used } = await withFallback(
    (p) =>
      objectNoSearch(
        p,
        FQD_SYSTEM_PROMPT,
        `Extract the event from this listing text:\n\n${text}`,
        eventResearchSchema,
      ),
    provider,
  );
  return { data, provider: used, raw: JSON.stringify(data) };
}

// Trim/dedupe classification labels and cap at 4.
function cleanLabels(arr: string[]): string[] {
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const raw of arr) {
    const label = String(raw)
      .replace(/^["'\s]+|["'\s.]+$/g, "")
      .trim();
    const key = label.toLowerCase();
    if (label && label.length <= 60 && !seen.has(key)) {
      seen.add(key);
      labels.push(label);
    }
  }
  return labels.slice(0, 4);
}

// Mode 3: generate concise category or subcategory labels from an event's
// description (plus optional title/category for context). No web search.
export async function generateClassificationsWithFallback(
  field: "category" | "subcategory",
  ctx: { description: string; title?: string | null; category?: string | null },
  provider?: FqdProvider,
): Promise<{ values: string[]; provider: FqdProvider }> {
  const kind = field === "category" ? "top-level category" : "subcategory";
  const count = field === "category" ? "1 to 2" : "1 to 3";
  const examples =
    field === "category"
      ? '"Food & Drink", "Nightlife", "Festival"'
      : '"Spirits Industry Conference", "Second Line Parade", "Jazz Concert"';
  const system = `You classify New Orleans events. Given an event's description (and optional title/category), respond with ${count} concise ${kind} labels of 2 to 4 words each, e.g. ${examples}. Return them as an array of strings.`;
  const prompt = [
    ctx.title ? `Title: ${ctx.title}` : null,
    field === "subcategory" && ctx.category ? `Category: ${ctx.category}` : null,
    `Description: ${ctx.description}`,
  ]
    .filter(Boolean)
    .join("\n");
  const { data, provider: used } = await withFallback(
    (p) => arrayNoSearch(p, system, prompt, z.string()),
    provider,
  );
  return { values: cleanLabels(data), provider: used };
}

// Mode 5: web-search for a factual description of an event.
export async function researchEventDescriptionWithFallback(
  query: string,
  provider?: FqdProvider,
): Promise<{ data: string; provider: FqdProvider; raw: string }> {
  const system = `You are a New Orleans event researcher. Search the web for the given event and write a concise, factual description of 2 to 4 sentences suitable for an event listing — what the event is, its key highlights, and what attendees can expect. Set "description" to that text, or null if you cannot determine it.`;
  const { data, provider: used } = await withFallback(
    (p) =>
      objectSearch(
        p,
        system,
        `Write a description for this New Orleans event. Search the web for accurate, current details.\n${query}`,
        z.object({ description: z.string().nullable() }),
      ),
    provider,
  );
  const d = (data.description ?? "").trim().replace(/^["']|["']$/g, "").trim();
  return { data: d || "NONE", provider: used, raw: d };
}

// What to look for per field, used by the single-field web search.
export const FIELD_INSTRUCTIONS: Record<string, string> = {
  startDate: "the start date in YYYY-MM-DD format",
  endDate:
    "the end date in YYYY-MM-DD format, or null if it's a single-day event",
  startTime: "the start time of day, e.g. '6:30 PM'",
  locationName: "the venue or location name",
  address: "the full street address",
  admission: "the admission or ticket pricing details",
  website: "the official website URL",
  ticketUrl: "the ticket purchase URL",
  organizer: "the organizing person or entity",
  expectedAttendance: "the expected attendance (a number or range)",
  ageRequirement: "the age requirement, e.g. '21+' or 'All ages'",
  notes: "any additional noteworthy details worth listing",
};

// Mode 6: web-search for a single event field's value.
export async function researchEventFieldWithFallback(
  field: string,
  query: string,
  provider?: FqdProvider,
): Promise<{ data: string; provider: FqdProvider; raw: string }> {
  const instruction = FIELD_INSTRUCTIONS[field] ?? `the event's ${field}`;
  const system = `You are a New Orleans event researcher. Search the web for the given event and determine ${instruction}. Set "value" to that value, or null if you genuinely cannot determine it.`;
  const { data, provider: used } = await withFallback(
    (p) =>
      objectSearch(
        p,
        system,
        `Find ${instruction} for this New Orleans event. Search the web for accurate, current details.\n${query}`,
        z.object({ value: z.string().nullable() }),
      ),
    provider,
  );
  const v = (data.value ?? "").trim();
  return { data: v || "NONE", provider: used, raw: v };
}

// Mode 4: web-search for image SOURCES for an event (official page, ticketing,
// news, socials). Returns a list of URLs — direct image URLs or pages to scrape.
export async function researchEventImageSourcesWithFallback(
  query: string,
  provider?: FqdProvider,
): Promise<{ data: string[]; provider: FqdProvider; raw: string }> {
  const system = `You are an event image researcher. Given event details, search the web for up to 15 URLs most likely to contain photos of THIS specific event. Prefer the official event page, ticketing pages, reputable news articles, and the event's own social posts. Include as many distinct, relevant image sources as you can find. Include direct image URLs (ending in .jpg/.jpeg/.png/.webp) when you find them; otherwise include the page URL. Return the URLs as an array of strings.`;
  const { data, provider: used } = await withFallback(
    (p) =>
      arraySearch(
        p,
        system,
        `Find image sources for this New Orleans event:\n${query}`,
        z.string(),
      ),
    provider,
  );
  const urls = data
    .filter((u): u is string => typeof u === "string" && /^https?:\/\//i.test(u))
    .slice(0, 15);
  return { data: urls, provider: used, raw: JSON.stringify(urls) };
}

// ---- Discover upcoming events (web search + dedupe) ----------------------

export interface DiscoverResult {
  events: DiscoveredEvent[];
  provider: FqdProvider;
  raw: string;
}

// Mode 7: web-search for upcoming NOLA events not already in the system. The
// existing titles/dates are passed so the model can exclude what we already have
// (fuzzy title matching); a deterministic dedupe pass runs on top in the route.
export async function discoverEventsWithFallback(
  existing: { title: string; startDate: string }[],
  today: string,
  provider?: FqdProvider,
): Promise<DiscoverResult> {
  const list = existing.length
    ? existing
        .map((e) => `- ${e.title} (${e.startDate.slice(0, 10)})`)
        .join("\n")
    : "(none yet)";
  const prompt = `Find upcoming New Orleans events that are NOT already in our system.

Today's date is ${today}. Only include events happening on or after today (${today}) — never events whose date has already passed.

Events already in our system (exclude these and any close variant of them):
${list}`;
  const { data, provider: used } = await withFallback(
    (p) => arraySearch(p, FQD_DISCOVER_SYSTEM_PROMPT, prompt, discoveredEventSchema),
    provider,
  );
  const events = data.filter((e) => e.title?.trim());
  return { events, provider: used, raw: JSON.stringify(events) };
}

// ---- Bulk parse ----------------------------------------------------------

export interface BulkParseResult {
  events: EventResearch[];
  provider: FqdProvider | null;
}

// Parse many listings into an array of events. Splits deterministically, then
// AI-extracts in small batches (so a big doc never blows the output limit or
// gets truncated). A failed batch is skipped rather than aborting the import.
export async function bulkParseEvents(
  text: string,
  provider?: FqdProvider,
): Promise<BulkParseResult> {
  const blocks = splitListings(text);
  if (blocks.length === 0) return { events: [], provider: null };

  const batches = chunk(blocks, 5);
  const events: EventResearch[] = [];
  let used: FqdProvider | null = null;

  for (const batch of batches) {
    try {
      const { data, provider: p } = await withFallback(
        (pr) =>
          arrayNoSearch(
            pr,
            FQD_BULK_SYSTEM_PROMPT,
            `Extract every event listing below (one object per numbered listing):\n\n${batch.join(
              "\n\n",
            )}`,
            eventResearchSchema,
          ),
        provider,
      );
      events.push(...data);
      used = used ?? p;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[fqd-research] bulk batch failed, skipping. Reason: ${message}`);
    }
  }

  return { events, provider: used };
}
