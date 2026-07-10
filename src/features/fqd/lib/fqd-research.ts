import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, stepCountIs } from "ai";
import {
  eventResearchSchema,
  type EventResearch,
  type FqdProvider,
} from "../types/fqd-types";

// Human-readable label + underlying search engine per provider, for the UI.
export const PROVIDER_META: Record<
  FqdProvider,
  { providerLabel: string; searchEngine: string }
> = {
  anthropic: {
    providerLabel: "Claude (Anthropic)",
    searchEngine: "Anthropic Web Search",
  },
  gemini: {
    providerLabel: "Gemini (Google)",
    searchEngine: "Google Search",
  },
  openai: {
    providerLabel: "ChatGPT (OpenAI)",
    searchEngine: "Bing Search",
  },
};

const FQD_SYSTEM_PROMPT = `You are a New Orleans event data researcher. Given an event name, search query, or raw event listing text, extract structured event information and return ONLY a valid JSON object. No markdown, no backticks, no preamble. Return null for any field you cannot determine with reasonable confidence.

Return this exact shape:
{
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

// Thrown when every provider in the chain fails; carries the per-provider
// reasons so the route can surface a 503 listing what was attempted.
export class FqdAllProvidersError extends Error {
  attempts: string[];
  constructor(attempts: string[]) {
    super(`All AI providers failed:\n${attempts.join("\n")}`);
    this.name = "FqdAllProvidersError";
    this.attempts = attempts;
  }
}

// Pull the JSON object out of the model's text (tolerates stray prose/citations).
function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("response did not contain a JSON object");
  }
  return JSON.parse(text.slice(start, end + 1));
}

// Validate + normalize; a Zod failure is treated as a provider failure so the
// chain falls through to the next provider.
function validate(text: string): EventResearch {
  return eventResearchSchema.parse(extractJson(text));
}

function requireKey(name: string): string {
  const key = process.env[name];
  if (!key) throw new Error(`${name} not configured`);
  return key;
}

interface ProviderOutput {
  fields: EventResearch;
  raw: string;
}

// ---- Provider implementations --------------------------------------------

async function runAnthropic(
  prompt: string,
  useSearch: boolean,
): Promise<ProviderOutput> {
  const anthropic = createAnthropic({ apiKey: requireKey("ANTHROPIC_API_KEY") });
  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: FQD_SYSTEM_PROMPT,
    prompt,
    ...(useSearch
      ? {
          tools: {
            web_search: anthropic.tools.webSearch_20250305({ maxUses: 5 }),
          },
          stopWhen: stepCountIs(6),
        }
      : {}),
  });
  return { fields: validate(text), raw: text };
}

async function runGemini(
  prompt: string,
  useSearch: boolean,
): Promise<ProviderOutput> {
  const google = createGoogleGenerativeAI({ apiKey: requireKey("GEMINI_API_KEY") });
  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    system: FQD_SYSTEM_PROMPT,
    prompt,
    ...(useSearch
      ? {
          tools: { google_search: google.tools.googleSearch({}) },
          stopWhen: stepCountIs(6),
        }
      : {}),
  });
  return { fields: validate(text), raw: text };
}

async function runOpenAI(
  prompt: string,
  useSearch: boolean,
): Promise<ProviderOutput> {
  const openai = createOpenAI({ apiKey: requireKey("OPENAI_API_KEY") });
  const { text } = await generateText({
    model: openai.responses("gpt-4o"),
    system: FQD_SYSTEM_PROMPT,
    prompt,
    ...(useSearch
      ? {
          tools: { web_search_preview: openai.tools.webSearchPreview({}) },
          stopWhen: stepCountIs(6),
        }
      : {}),
  });
  return { fields: validate(text), raw: text };
}

// ---- Fallback orchestrator -----------------------------------------------

const PROVIDERS = [
  { key: "anthropic", fn: runAnthropic },
  { key: "gemini", fn: runGemini },
  { key: "openai", fn: runOpenAI },
] as const;

export interface FallbackResult {
  data: EventResearch;
  provider: FqdProvider;
  raw: string;
}

// Try each provider in order; on any failure (missing key, API error, rate
// limit, or Zod validation) log and fall through to the next. Throws
// FqdAllProvidersError only if all three fail.
async function withFallback(
  prompt: string,
  useSearch: boolean,
): Promise<FallbackResult> {
  const errors: string[] = [];
  for (const { key, fn } of PROVIDERS) {
    try {
      const { fields, raw } = await fn(prompt, useSearch);
      return { data: fields, provider: key, raw };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`${key}: ${message}`);
      console.warn(
        `[fqd-research] ${key} failed, trying next provider. Reason: ${message}`,
      );
    }
  }
  throw new FqdAllProvidersError(errors);
}

// Mode 1: research an event by name/query using each provider's web search.
export function researchEventWithFallback(query: string): Promise<FallbackResult> {
  return withFallback(
    `Research this New Orleans event and return the JSON object. Search the web for accurate, current details. Query: ${query}`,
    true,
  );
}

// Mode 2: extract fields from raw listing text (no web search needed).
export function parseEventWithFallback(text: string): Promise<FallbackResult> {
  return withFallback(
    `Extract the event from this listing text and return the JSON object:\n\n${text}`,
    false,
  );
}
