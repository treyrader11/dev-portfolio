import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface FqdNotificationSettings {
  // Email these recipients when an event starts (at its start time).
  emailOnStart: boolean;
  // Email these recipients when an event ends and is removed from the database.
  emailOnEnd: boolean;
  // Where the emails go. Empty falls back to the admin email at send time.
  recipientEmails: string[];
}

// Persisted shape may still carry the legacy single `recipientEmail`.
type StoredSettings = Partial<
  Omit<FqdNotificationSettings, "recipientEmails">
> & {
  recipientEmails?: unknown;
  recipientEmail?: unknown;
};

const KEY = "fqdNotifications";

const DEFAULTS: FqdNotificationSettings = {
  emailOnStart: true,
  emailOnEnd: true,
  recipientEmails: [],
};

// Read recipients from either the new array or the legacy single string.
function readRecipients(v: StoredSettings): string[] {
  if (Array.isArray(v.recipientEmails)) {
    return v.recipientEmails
      .filter((e): e is string => typeof e === "string")
      .map((e) => e.trim())
      .filter(Boolean);
  }
  if (typeof v.recipientEmail === "string" && v.recipientEmail.trim()) {
    return [v.recipientEmail.trim()];
  }
  return [];
}

export async function getFqdNotificationSettings(): Promise<FqdNotificationSettings> {
  try {
    const row = await prisma.siteConfig.findUnique({ where: { key: KEY } });
    if (row?.value) {
      const v = row.value as StoredSettings;
      return {
        emailOnStart:
          typeof v.emailOnStart === "boolean"
            ? v.emailOnStart
            : DEFAULTS.emailOnStart,
        emailOnEnd:
          typeof v.emailOnEnd === "boolean" ? v.emailOnEnd : DEFAULTS.emailOnEnd,
        recipientEmails: readRecipients(v),
      };
    }
  } catch (e) {
    console.error("[fqd] failed to read notification settings:", e);
  }
  return { ...DEFAULTS, recipientEmails: [] };
}

export async function saveFqdNotificationSettings(
  settings: FqdNotificationSettings,
): Promise<FqdNotificationSettings> {
  const value = settings as unknown as Prisma.InputJsonValue;
  await prisma.siteConfig.upsert({
    where: { key: KEY },
    create: { key: KEY, value },
    update: { value },
  });
  return settings;
}

// The addresses emails are sent to: the configured recipients, else the first
// ADMIN_EMAIL, else the project owner.
export function resolveRecipients(settings: FqdNotificationSettings): string[] {
  if (settings.recipientEmails.length > 0) return settings.recipientEmails;
  const fallback =
    process.env.ADMIN_EMAIL?.split(",")[0]?.trim() || "trey@treyrader.dev";
  return [fallback];
}
