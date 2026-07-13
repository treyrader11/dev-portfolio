import { prisma } from "@/lib/prisma";
import { parseFqdProvider, type FqdProvider } from "../types/fqd-types";

// SiteConfig key for the admin-chosen default AI model, used across the app.
export const AI_SETTINGS_KEY = "aiSettings";

// Only providers with a runner can be the default (OpenAI has none in FQD).
export const DEFAULT_AI_PROVIDERS: FqdProvider[] = ["gemini", "anthropic"];

export interface AiSettings {
  defaultProvider: FqdProvider;
}

// The admin-configured default provider (falls back to Gemini).
export async function getDefaultAiProvider(): Promise<FqdProvider> {
  try {
    const row = await prisma.siteConfig.findUnique({
      where: { key: AI_SETTINGS_KEY },
    });
    const v = row?.value as { defaultProvider?: unknown } | null;
    const p = parseFqdProvider(v?.defaultProvider);
    return p && DEFAULT_AI_PROVIDERS.includes(p) ? p : "gemini";
  } catch {
    return "gemini";
  }
}

// The provider fallback order with the admin default first (runners only).
export async function getProviderOrder(): Promise<FqdProvider[]> {
  const def = await getDefaultAiProvider();
  return [def, ...DEFAULT_AI_PROVIDERS.filter((p) => p !== def)];
}
