import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import {
  generateText,
  stepCountIs,
  Output,
  type LanguageModel,
  type ToolSet,
} from "ai";
import { z } from "zod";
import { getProviderOrder } from "@/features/fqd/lib/ai-settings";

// Mirrors the French Quarter Direct AI engine (fqd-research.ts): provider
// fallback (admin-default order) + web search + schema-enforced structured
// output.

const GEMINI_MODEL = "gemini-flash-latest";
const ANTHROPIC_MODEL = "claude-sonnet-4-6";
const OPENAI_MODEL = "gpt-4o";
export type JobProvider = "gemini" | "anthropic" | "openai";

export class JobsResearchError extends Error {
  attempts: string[];
  constructor(attempts: string[]) {
    super(`AI job search failed:\n${attempts.join("\n")}`);
    this.name = "JobsResearchError";
    this.attempts = attempts;
  }
}

// Rate-limit / quota / credits failure vs. a genuine error (for amber vs. red).
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

function providerClient(provider: JobProvider): {
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
  if (provider === "openai") {
    const openai = createOpenAI({ apiKey: requireKey("OPENAI_API_KEY") });
    return {
      model: openai(OPENAI_MODEL),
      searchTools: { web_search: openai.tools.webSearch({}) },
    };
  }
  const anthropic = createAnthropic({ apiKey: requireKey("ANTHROPIC_API_KEY") });
  return {
    model: anthropic(ANTHROPIC_MODEL),
    searchTools: {
      web_search: anthropic.tools.webSearch_20250305({ maxUses: 5 }),
    },
  };
}

// One researched job listing (schema-enforced).
const jobSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string().nullable(),
  remote: z.boolean().nullable(),
  url: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  jobType: z.string().nullable(),
});

export type ResearchedJob = z.infer<typeof jobSchema>;

async function arraySearch<E>(
  provider: JobProvider,
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

// Web-search for current job postings matching the given keyword query. Uses the
// same Gemini → Anthropic fallback as FQD (no fallback when `only` is set).
export async function researchJobsWithFallback(
  query: string,
  only?: JobProvider,
): Promise<{ jobs: ResearchedJob[]; provider: JobProvider }> {
  const system = `You are a tech job-search assistant. Search the web for CURRENT, open software/developer job postings matching the given keywords. Return only genuinely open roles you can find on real job boards or company career pages, each with: title, hiring company, location, whether it is remote, the direct application/listing URL, relevant skill tags, and the job type (e.g. Full-time, Contract). Prefer recent postings. Return up to 20; if you find none, return an empty array.`;
  const prompt = `Find current job postings matching these keywords: ${query}`;

  // Respect the admin default AI model when none is forced.
  const order: JobProvider[] = only
    ? [only]
    : (await getProviderOrder()).filter(
        (p): p is JobProvider =>
          p === "gemini" || p === "anthropic" || p === "openai",
      );
  const errors: string[] = [];
  for (const provider of order) {
    try {
      const jobs = await arraySearch<ResearchedJob>(
        provider,
        system,
        prompt,
        jobSchema,
      );
      return {
        jobs: jobs.filter((j) => j.title?.trim() && j.company?.trim()),
        provider,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`${provider}: ${message}`);
      console.warn(
        `[jobs-research] ${provider} failed${only ? "" : ", trying next provider"}. Reason: ${message}`,
      );
    }
  }
  throw new JobsResearchError(errors);
}
