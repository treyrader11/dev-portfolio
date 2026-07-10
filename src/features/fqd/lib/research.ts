import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText, stepCountIs } from "ai";
import { eventResearchSchema, type EventResearch } from "../types/fqd-types";

// Model is fixed to the Anthropic Sonnet used elsewhere in this repo (the AI
// providers module points here too). Web search is only available on Anthropic,
// so this path always uses it directly rather than the generic provider picker.
const MODEL = "claude-sonnet-4-20250514";

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

function getAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");
  return createAnthropic({ apiKey });
}

// Pull the JSON object out of the model's text (tolerates any stray prose).
function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI response did not contain a JSON object");
  }
  return JSON.parse(text.slice(start, end + 1));
}

// The raw text + validated fields — the route persists `raw` as rawResearch.
export interface ResearchOutput {
  fields: EventResearch;
  raw: string;
}

// Mode 1: research an event by name/query using Anthropic web search.
export async function researchByQuery(query: string): Promise<ResearchOutput> {
  const anthropic = getAnthropic();
  const { text } = await generateText({
    model: anthropic(MODEL),
    system: FQD_SYSTEM_PROMPT,
    prompt: `Research this New Orleans event and return the JSON object. Search the web for accurate, current details. Query: ${query}`,
    tools: {
      web_search: anthropic.tools.webSearch_20250305({ maxUses: 5 }),
    },
    // Allow the model to run searches, then produce the final JSON.
    stopWhen: stepCountIs(6),
  });
  return { fields: eventResearchSchema.parse(extractJson(text)), raw: text };
}

// Mode 2: parse a raw listing (pasted/dropped text). No web search needed.
export async function parseFromText(text: string): Promise<ResearchOutput> {
  const anthropic = getAnthropic();
  const { text: out } = await generateText({
    model: anthropic(MODEL),
    system: FQD_SYSTEM_PROMPT,
    prompt: `Extract the event from this listing text and return the JSON object:\n\n${text}`,
  });
  return { fields: eventResearchSchema.parse(extractJson(out)), raw: out };
}
