import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface FqdNotificationSettings {
  // Email the recipient when an event starts (at its start time).
  emailOnStart: boolean;
  // Email the recipient when an event ends and is removed from the database.
  emailOnEnd: boolean;
  // Where the emails go. Empty falls back to the admin email at send time.
  recipientEmail: string;
}

const KEY = "fqdNotifications";

const DEFAULTS: FqdNotificationSettings = {
  emailOnStart: true,
  emailOnEnd: true,
  recipientEmail: "",
};

export async function getFqdNotificationSettings(): Promise<FqdNotificationSettings> {
  try {
    const row = await prisma.siteConfig.findUnique({ where: { key: KEY } });
    if (row?.value) {
      const v = row.value as Partial<FqdNotificationSettings>;
      return {
        emailOnStart:
          typeof v.emailOnStart === "boolean"
            ? v.emailOnStart
            : DEFAULTS.emailOnStart,
        emailOnEnd:
          typeof v.emailOnEnd === "boolean" ? v.emailOnEnd : DEFAULTS.emailOnEnd,
        recipientEmail:
          typeof v.recipientEmail === "string" ? v.recipientEmail : "",
      };
    }
  } catch (e) {
    console.error("[fqd] failed to read notification settings:", e);
  }
  return { ...DEFAULTS };
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

// The address emails are sent to: the configured recipient, else the first
// ADMIN_EMAIL, else the project owner.
export function resolveRecipient(settings: FqdNotificationSettings): string {
  return (
    settings.recipientEmail?.trim() ||
    process.env.ADMIN_EMAIL?.split(",")[0]?.trim() ||
    "trey@treyrader.dev"
  );
}
