import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { FqdRecipient } from "../types/fqd-types";

// The admin accounts are always in the recipient list and can't be removed.
export const ADMIN_RECIPIENTS = [
  "developertrey@gmail.com",
  "treyrdr09@gmail.com",
];

const KEY = "fqdRecipients";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

const norm = (e: string) => e.trim().toLowerCase();
const ADMIN_SET = new Set(ADMIN_RECIPIENTS.map(norm));

async function readStored(): Promise<string[]> {
  try {
    const row = await prisma.siteConfig.findUnique({ where: { key: KEY } });
    const v = row?.value as { emails?: unknown } | null;
    if (v && Array.isArray(v.emails)) {
      return v.emails
        .filter((e): e is string => typeof e === "string")
        .map(norm)
        .filter(Boolean);
    }
  } catch (e) {
    console.error("[fqd] failed to read recipients:", e);
  }
  return [];
}

async function writeStored(emails: string[]): Promise<void> {
  const value = { emails } as unknown as Prisma.InputJsonValue;
  await prisma.siteConfig.upsert({
    where: { key: KEY },
    create: { key: KEY, value },
    update: { value },
  });
}

// The full recipient list: the admin accounts first, then saved common
// recipients, deduped.
export async function getFqdRecipients(): Promise<FqdRecipient[]> {
  const stored = (await readStored()).filter((e) => !ADMIN_SET.has(e));
  const seen = new Set<string>();
  const list: FqdRecipient[] = [];
  for (const email of ADMIN_RECIPIENTS) {
    if (seen.has(norm(email))) continue;
    seen.add(norm(email));
    list.push({ email, isAdmin: true });
  }
  for (const email of stored) {
    if (seen.has(email)) continue;
    seen.add(email);
    list.push({ email, isAdmin: false });
  }
  return list;
}

export async function addFqdRecipient(email: string): Promise<FqdRecipient[]> {
  const clean = norm(email);
  if (!isValidEmail(clean)) throw new Error("Invalid email address");
  if (!ADMIN_SET.has(clean)) {
    const stored = await readStored();
    if (!stored.includes(clean)) await writeStored([...stored, clean]);
  }
  return getFqdRecipients();
}

export async function removeFqdRecipient(
  email: string,
): Promise<FqdRecipient[]> {
  const clean = norm(email);
  // Admin accounts can't be removed.
  if (ADMIN_SET.has(clean)) return getFqdRecipients();
  const stored = await readStored();
  await writeStored(stored.filter((e) => e !== clean));
  return getFqdRecipients();
}

// The set of addresses allowed as export-email recipients (admins + saved).
export async function allowedRecipientEmails(): Promise<Set<string>> {
  const list = await getFqdRecipients();
  return new Set(list.map((r) => norm(r.email)));
}
