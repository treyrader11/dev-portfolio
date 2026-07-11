import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, stepCountIs } from "ai";
import { z } from "zod";
import {
  eventResearchSchema,
  type EventResearch,
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

const FQD_SYSTEM_PROMPT = `You are a New Orleans event data researcher. Given an event name, search query, or raw event listing text, extract structured event information and return ONLY a valid JSON object. No markdown, no backticks, no preamble. Return null for any field you cannot determine with reasonable confidence.

Return this exact shape:
${SHAPE}`;

const FQD_BULK_SYSTEM_PROMPT = `You are a New Orleans event data extractor. The input contains one or more event listings. Return ONLY a valid JSON ARRAY — no markdown, no backticks, no preamble — with exactly one object per distinct listing, in the same order. Return null for any field you cannot determine.

Each element must be this exact shape:
${SHAPE}`;

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
  return urls.slice(0, 8);
};

// The model should reply with just a short label; take the first line and strip
// stray quotes/punctuation. Reject anything empty or implausibly long.
const cleanSubcategory = (text: string): string => {
  const line = (text.split("\n").find((l) => l.trim()) ?? "")
    .replace(/^["'\s]+|["'\s.]+$/g, "")
    .trim();
  if (!line || line.length > 60) {
    throw new Error("no usable subcategory in response");
  }
  return line;
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

// Mode 3: generate a concise subcategory label from an event's description
// (plus optional title/category for context). No web search.
export async function generateSubcategoryWithFallback(input: {
  description: string;
  title?: string | null;
  category?: string | null;
}): Promise<{ subcategory: string; provider: FqdProvider }> {
  const system = `You label New Orleans events with a concise subcategory. Given an event's description (and optional title/category), respond with ONLY a short subcategory label of 2 to 5 words, e.g. "Spirits Industry Conference", "Second Line Parade", "Jazz Concert", "Food Festival". No quotes, no trailing punctuation, no preamble — just the label.`;
  const prompt = [
    input.title ? `Title: ${input.title}` : null,
    input.category ? `Category: ${input.category}` : null,
    `Description: ${input.description}`,
    `\nSubcategory:`,
  ]
    .filter(Boolean)
    .join("\n");
  const { data, provider } = await withFallback(
    system,
    prompt,
    false,
    cleanSubcategory,
  );
  return { subcategory: data, provider };
}

// Mode 4: web-search for image SOURCES for an event (official page, ticketing,
// news, socials). Returns a list of URLs — direct image URLs or pages to scrape.
export function researchEventImageSourcesWithFallback(
  query: string,
): Promise<{ data: string[]; provider: FqdProvider; raw: string }> {
  const system = `You are an event image researcher. Given event details, search the web and return ONLY a JSON array (no markdown, no preamble) of up to 8 URLs most likely to contain photos of THIS specific event. Prefer the official event page, ticketing pages, reputable news articles, and the event's own social posts. Include direct image URLs (ending in .jpg/.jpeg/.png/.webp) when you find them; otherwise include the page URL. Return only the JSON array of URL strings.`;
  return withFallback(
    system,
    `Find image sources for this New Orleans event:\n${query}`,
    true,
    validateUrlList,
  );
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
