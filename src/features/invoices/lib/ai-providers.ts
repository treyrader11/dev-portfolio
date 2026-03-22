import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export type AIProviderName = "openai" | "anthropic" | "gemini";

export type AIProviderConfig = {
  name: AIProviderName;
  label: string;
  model: string;
  available: boolean;
};

const PROVIDER_MODELS: Record<AIProviderName, string> = {
  openai: "gpt-4o",
  anthropic: "claude-sonnet-4-20250514",
  gemini: "gemini-2.0-flash",
};

const PROVIDER_LABELS: Record<AIProviderName, string> = {
  openai: "OpenAI (GPT-4o)",
  anthropic: "Anthropic (Claude Sonnet)",
  gemini: "Google (Gemini Flash)",
};

export function getAvailableProviders(): AIProviderConfig[] {
  const providers: { name: AIProviderName; key: string | undefined }[] = [
    { name: "openai", key: process.env.OPENAI_API_KEY },
    { name: "anthropic", key: process.env.ANTHROPIC_API_KEY },
    { name: "gemini", key: process.env.GEMINI_API_KEY },
  ];

  return providers.map((p) => ({
    name: p.name,
    label: PROVIDER_LABELS[p.name],
    model: PROVIDER_MODELS[p.name],
    available: !!p.key,
  }));
}

export function getModel(provider: AIProviderName) {
  switch (provider) {
    case "openai": {
      const key = process.env.OPENAI_API_KEY;
      if (!key) throw new Error("OPENAI_API_KEY is not configured");
      return createOpenAI({ apiKey: key })(PROVIDER_MODELS.openai);
    }
    case "anthropic": {
      const key = process.env.ANTHROPIC_API_KEY;
      if (!key) throw new Error("ANTHROPIC_API_KEY is not configured");
      return createAnthropic({ apiKey: key })(PROVIDER_MODELS.anthropic);
    }
    case "gemini": {
      const key = process.env.GEMINI_API_KEY;
      if (!key) throw new Error("GEMINI_API_KEY is not configured");
      return createGoogleGenerativeAI({ apiKey: key })(PROVIDER_MODELS.gemini);
    }
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export function getFirstAvailableModel() {
  const available = getAvailableProviders().filter((p) => p.available);
  if (available.length === 0) throw new Error("No AI providers configured");
  return getModel(available[0].name);
}
