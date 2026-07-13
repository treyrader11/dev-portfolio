import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, stepCountIs } from "ai";
import { z } from "zod";
import {
  eventResearchSchema,
  discoveredEventSchema,
  type EventResearch,
  type DiscoveredEvent,
  type FqdProvider,
} from "../types/fqd-types";
import { splitListings, chunk } from "./split-listings";

const MODEL = "claude-sonnet-4-20250514";

export const PROVIDER_META: Record<
  FqdProvider,
  { providerLabel: string; searchEngine: string }
> = {
  anthropic: { providerLabel: "Claude (Anthropic)", searchEngine: "Anthropic Web Search" },
  gemini: { providerLabel: "Gemini (Google)", searchEngine: "Google Search" },
  openai: { providerLabel: "ChatGPT (OpenAI)", searchEngine: "Bing Search" },
};

const SHAPE = `{
  "title": string,
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD" | null,
  "startTime": string | null,
  "locationName": string | null,
  "address": string | null,
  "description": string | null,
  "admission": string | null,
  "website": string | null,
  "category": string | null,
  "subcategory": string | null,
  "ticketUrl": string | null,
  "organizer": string | null,
  "expectedAttendance": string | null,
  "ageRequirement": string | null,
  "notes": string | null
}`;

// Per-field formatting rules. Category/subcategory hold MULTIPLE comma-separated
// labels (the form renders them as pills), and expected attendance should be
// estimated rather than left blank.
const FIELD_GUIDANCE = `Field rules:
- "category": one or two broad category labels as a comma-separated string, e.g. "Festival, Music".
- "subcategory": two or three specific subcategory labels as a comma-separated string, e.g. "Jazz Concert, Second Line Parade, Outdoor Festival". Include multiple when more than one applies — do not return just one when several fit.
- "expectedAttendance": the expected number of attendees as a number or range, e.g. "5,000" or "10,000-15,000". If it isn't explicitly stated, give a reasonable estimate based on the event's type, venue, and scale rather than null.`;

const FQD_SYSTEM_PROMPT = `You are a New Orleans event data researcher. Given an event name, search query, or raw event listing text, extract structured event information and return ONLY a valid JSON object. No markdown, no backticks, no preamble. Return null for any field you cannot determine with reasonable confidence.

Return this exact shape:
${SHAPE}

${FIELD_GUIDANCE}`;

const FQD_BULK_SYSTEM_PROMPT = `You are a New Orleans event data extractor. The input contains one or more event listings. Return ONLY a valid JSON ARRAY — no markdown, no backticks, no preamble — with exactly one object per distinct listing, in the same order. Return null for any field you cannot determine.

Each element must be this exact shape:
${SHAPE}

${FIELD_GUIDANCE}`;

export class FqdAllProvidersError extends Error {
  attempts: string[];
  constructor(attempts: string[]) {
    super(`All AI providers failed:\n${attempts.join("\n")}`);
    this.name = "FqdAllProvidersError";
    this.attempts = attempts;
  }
}

function extractJson(text: string, openCh: "{" | "[", closeCh: "}" | "]"): unknown {
  const start = text.indexOf(openCh);
  const end = text.lastIndexOf(closeCh);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("response did not contain the expected JSON");
  }
  return JSON.parse(text.slice(start, end + 1));
}

const validateOne = (text: string): EventResearch =>
  eventResearchSchema.parse(extractJson(text, "{", "}"));

const validateMany = (text: string): EventResearch[] =>
  z.array(eventResearchSchema).parse(extractJson(text, "[", "]"));

// A JSON array of http(s) URL strings (used by image-source research).
const validateUrlList = (text: string): string[] => {
  const arr = extractJson(text, "[", "]");
  if (!Array.isArray(arr)) throw new Error("response was not a JSON array");
  const urls = arr.filter(
    (u): u is string => typeof u === "string" && /^https?:\/\//i.test(u),
  );
  if (urls.length === 0) throw new Error("no usable URLs in response");
  return urls.slice(0, 15);
};

// A JSON array of short classification labels (category / subcategory).
const cleanLabelList = (text: string): string[] => {
  const arr = extractJson(text, "[", "]");
  if (!Array.isArray(arr)) throw new Error("response was not a JSON array");
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
  if (labels.length === 0) throw new Error("no usable labels in response");
  return labels.slice(0, 4);
};

function requireKey(name: string): string {
  const key = process.env[name];
  if (!key) throw new Error(`${name} not configured`);
  return key;
}

// ---- Provider text runners (return raw model text) -----------------------

type Runner = (
  system: string,
  prompt: string,
  useSearch: boolean,
) => Promise<string>;

const callAnthropic: Runner = async (system, prompt, useSearch) => {
  const anthropic = createAnthropic({ apiKey: requireKey("ANTHROPIC_API_KEY") });
  const { text } = await generateText({
    model: anthropic(MODEL),
    system,
    prompt,
    maxOutputTokens: 4096,
    ...(useSearch
      ? {
          tools: { web_search: anthropic.tools.webSearch_20250305({ maxUses: 5 }) },
          stopWhen: stepCountIs(6),
        }
      : {}),
  });
  return text;
};

const callGemini: Runner = async (system, prompt, useSearch) => {
  const google = createGoogleGenerativeAI({ apiKey: requireKey("GEMINI_API_KEY") });
  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    system,
    prompt,
    maxOutputTokens: 4096,
    ...(useSearch
      ? { tools: { google_search: google.tools.googleSearch({}) }, stopWhen: stepCountIs(6) }
      : {}),
  });
  return text;
};

const callOpenAI: Runner = async (system, prompt, useSearch) => {
  const openai = createOpenAI({ apiKey: requireKey("OPENAI_API_KEY") });
  const { text } = await generateText({
    model: openai.responses("gpt-4o"),
    system,
    prompt,
    maxOutputTokens: 4096,
    ...(useSearch
      ? { tools: { web_search_preview: openai.tools.webSearchPreview({}) }, stopWhen: stepCountIs(6) }
      : {}),
  });
  return text;
};

const RUNNERS: { key: FqdProvider; run: Runner }[] = [
  { key: "anthropic", run: callAnthropic },
  { key: "gemini", run: callGemini },
  { key: "openai", run: callOpenAI },
];

// Try each provider in order; any error (missing key, API failure, or a
// validation failure of the returned JSON) falls through to the next.
async function withFallback<T>(
  system: string,
  prompt: string,
  useSearch: boolean,
  validate: (text: string) => T,
): Promise<{ data: T; provider: FqdProvider; raw: string }> {
  const errors: string[] = [];
  for (const { key, run } of RUNNERS) {
    try {
      const text = await run(system, prompt, useSearch);
      return { data: validate(text), provider: key, raw: text };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`${key}: ${message}`);
      console.warn(`[fqd-research] ${key} failed, trying next provider. Reason: ${message}`);
    }
  }
  throw new FqdAllProvidersError(errors);
}

export interface FallbackResult {
  data: EventResearch;
  provider: FqdProvider;
  raw: string;
}

// Mode 1: research an event by name/query (web search).
export function researchEventWithFallback(query: string): Promise<FallbackResult> {
  return withFallback(
    FQD_SYSTEM_PROMPT,
    `Research this New Orleans event and return the JSON object. Search the web for accurate, current details. Query: ${query}`,
    true,
    validateOne,
  );
}

// Mode 2: parse a single raw listing (no web search).
export function parseEventWithFallback(text: string): Promise<FallbackResult> {
  return withFallback(
    FQD_SYSTEM_PROMPT,
    `Extract the event from this listing text and return the JSON object:\n\n${text}`,
    false,
    validateOne,
  );
}

// Mode 3: generate concise category or subcategory labels from an event's
// description (plus optional title/category for context). No web search.
export async function generateClassificationsWithFallback(
  field: "category" | "subcategory",
  ctx: { description: string; title?: string | null; category?: string | null },
): Promise<{ values: string[]; provider: FqdProvider }> {
  const kind = field === "category" ? "top-level category" : "subcategory";
  const count = field === "category" ? "1 to 2" : "1 to 3";
  const examples =
    field === "category"
      ? '"Food & Drink", "Nightlife", "Festival"'
      : '"Spirits Industry Conference", "Second Line Parade", "Jazz Concert"';
  const system = `You classify New Orleans events. Given an event's description (and optional title/category), respond with ONLY a JSON array of ${count} concise ${kind} labels of 2 to 4 words each, e.g. ${examples}. No markdown, no preamble — just the JSON array of strings.`;
  const prompt = [
    ctx.title ? `Title: ${ctx.title}` : null,
    field === "subcategory" && ctx.category ? `Category: ${ctx.category}` : null,
    `Description: ${ctx.description}`,
    `\n${kind} labels:`,
  ]
    .filter(Boolean)
    .join("\n");
  const { data, provider } = await withFallback(
    system,
    prompt,
    false,
    cleanLabelList,
  );
  return { values: data, provider };
}

// The model replies with a plain description; trim and sanity-check length.
const cleanDescription = (text: string): string => {
  const d = text.trim().replace(/^["']|["']$/g, "").trim();
  if (d.length < 20) throw new Error("no usable description in response");
  return d;
};

// Mode 5: web-search for a factual description of an event.
export function researchEventDescriptionWithFallback(
  query: string,
): Promise<{ data: string; provider: FqdProvider; raw: string }> {
  const system = `You are a New Orleans event researcher. Search the web for the given event and write a concise, factual description of 2 to 4 sentences suitable for an event listing — what the event is, its key highlights, and what attendees can expect. Return ONLY the description text: no title, no markdown, no preamble, no quotes.`;
  return withFallback(
    system,
    `Write a description for this New Orleans event. Search the web for accurate, current details.\n${query}`,
    true,
    cleanDescription,
  );
}

// What to look for per field, used by the single-field web search.
export const FIELD_INSTRUCTIONS: Record<string, string> = {
  startDate: "the start date in YYYY-MM-DD format",
  endDate:
    "the end date in YYYY-MM-DD format, or exactly NONE if it's a single-day event",
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

// The model replies with a single value on its own; take the first non-empty
// line and strip stray quotes.
const cleanFieldValue = (text: string): string => {
  const line =
    text
      .split("\n")
      .map((l) => l.trim())
      .find(Boolean) ?? "";
  const v = line.replace(/^["']+|["']+$/g, "").trim();
  if (!v) throw new Error("empty field value in response");
  return v;
};

// Mode 6: web-search for a single event field's value. The model returns the
// bare value, or "NONE" when it can't be found.
export function researchEventFieldWithFallback(
  field: string,
  query: string,
): Promise<{ data: string; provider: FqdProvider; raw: string }> {
  const instruction = FIELD_INSTRUCTIONS[field] ?? `the event's ${field}`;
  const system = `You are a New Orleans event researcher. Search the web for the given event and determine ${instruction}. Respond with ONLY that value — no label, no preamble, no markdown, no surrounding quotes. If you genuinely cannot determine it, respond with exactly: NONE`;
  return withFallback(
    system,
    `Find ${instruction} for this New Orleans event. Search the web for accurate, current details.\n${query}`,
    true,
    cleanFieldValue,
  );
}

// Mode 4: web-search for image SOURCES for an event (official page, ticketing,
// news, socials). Returns a list of URLs — direct image URLs or pages to scrape.
export function researchEventImageSourcesWithFallback(
  query: string,
): Promise<{ data: string[]; provider: FqdProvider; raw: string }> {
  const system = `You are an event image researcher. Given event details, search the web and return ONLY a JSON array (no markdown, no preamble) of up to 15 URLs most likely to contain photos of THIS specific event. Prefer the official event page, ticketing pages, reputable news articles, and the event's own social posts. Include as many distinct, relevant image sources as you can find. Include direct image URLs (ending in .jpg/.jpeg/.png/.webp) when you find them; otherwise include the page URL. Return only the JSON array of URL strings.`;
  return withFallback(
    system,
    `Find image sources for this New Orleans event:\n${query}`,
    true,
    validateUrlList,
  );
}

// ---- Discover upcoming events (web search + dedupe) ----------------------

const FQD_DISCOVER_SYSTEM_PROMPT = `You are a New Orleans events researcher. Search the web for UPCOMING, planned New Orleans events scheduled in the future — festivals, parades, second lines, concerts, food & drink events, cultural celebrations, sports, markets, and similar public happenings.

You will be given a list of events ALREADY in our system. Do NOT include any event that is the same as one already listed, even when the wording differs slightly. Treat titles as the same event when they refer to the same recurring or specific happening — e.g. "Running of the Bulls 2026" is the same as "Running of the Bulls", and "36th Annual Oak Street Po-Boy Festival" is the same as "Oak Street Po-Boy Festival". When in doubt, exclude it.

Only include events taking place on or after today — never include events whose date has already passed.

Return ONLY a valid JSON ARRAY (no markdown, no backticks, no preamble) of NEW events that are not already in the system. Each element must be exactly this shape:
{
  "title": string,
  "startDate": "YYYY-MM-DD" | null,
  "endDate": "YYYY-MM-DD" | null,
  "locationName": string | null,
  "category": string | null,
  "description": string | null
}
Return up to 25 well-sourced events with real, specific dates. If you find none, return exactly: []`;

// Parse the discovered-events array leniently: keep valid, titled entries and
// silently drop malformed ones. Crucially, a response with NO JSON array (e.g.
// the model replying in prose that it found nothing) is treated as "found
// nothing" (empty), NOT a failure — otherwise every provider "fails" and the
// genuine no-new-events case looks like a hard error.
const validateDiscovered = (text: string): DiscoveredEvent[] => {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return [];
  let arr: unknown;
  try {
    arr = JSON.parse(text.slice(start, end + 1));
  } catch {
    return [];
  }
  if (!Array.isArray(arr)) return [];
  const out: DiscoveredEvent[] = [];
  for (const item of arr) {
    const parsed = discoveredEventSchema.safeParse(item);
    if (parsed.success && parsed.data.title.trim()) out.push(parsed.data);
  }
  return out;
};

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
): Promise<DiscoverResult> {
  const list = existing.length
    ? existing
        .map((e) => `- ${e.title} (${e.startDate.slice(0, 10)})`)
        .join("\n")
    : "(none yet)";
  const prompt = `Find upcoming New Orleans events that are NOT already in our system.

Today's date is ${today}. Only include events happening on or after today (${today}) — never events whose date has already passed.

Events already in our system (exclude these and any close variant of them):
${list}

Return the JSON array of new events.`;
  const { data, provider, raw } = await withFallback(
    FQD_DISCOVER_SYSTEM_PROMPT,
    prompt,
    true,
    validateDiscovered,
  );
  return { events: data, provider, raw };
}

// ---- Bulk parse ----------------------------------------------------------

export interface BulkParseResult {
  events: EventResearch[];
  provider: FqdProvider | null;
}

// Parse many listings into an array of events. Splits deterministically, then
// AI-extracts in small batches (so a big doc never blows the output limit or
// gets truncated). Batches run through the provider fallback chain; a failed
// batch is skipped rather than aborting the whole import.
export async function bulkParseEvents(text: string): Promise<BulkParseResult> {
  const blocks = splitListings(text);
  if (blocks.length === 0) return { events: [], provider: null };

  const batches = chunk(blocks, 5);
  const events: EventResearch[] = [];
  let provider: FqdProvider | null = null;

  for (const batch of batches) {
    try {
      const result = await withFallback(
        FQD_BULK_SYSTEM_PROMPT,
        `Extract every event listing below into the JSON array (one element per numbered listing):\n\n${batch.join(
          "\n\n",
        )}`,
        false,
        validateMany,
      );
      events.push(...result.data);
      provider = provider ?? result.provider;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[fqd-research] bulk batch failed, skipping. Reason: ${message}`);
    }
  }

  return { events, provider };
}
