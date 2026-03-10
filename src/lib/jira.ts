import { prisma } from "@/lib/prisma";
import type { JiraCredentials } from "@/types/jira";

export async function getJiraCredentials(): Promise<JiraCredentials | null> {
  const config = await prisma.siteConfig.findUnique({
    where: { key: "jiraCredentials" },
  });
  if (!config?.value) return null;
  const creds = config.value as unknown as JiraCredentials;
  if (!creds.domain || !creds.email || !creds.apiToken) return null;
  return creds;
}

export async function jiraFetch(
  path: string,
  credentials: JiraCredentials,
  options?: { method?: string; body?: string }
): Promise<Response> {
  const auth = Buffer.from(
    `${credentials.email}:${credentials.apiToken}`
  ).toString("base64");

  const headers: Record<string, string> = {
    Authorization: `Basic ${auth}`,
    Accept: "application/json",
  };

  if (options?.body) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`https://${credentials.domain}.atlassian.net${path}`, {
    method: options?.method || "GET",
    headers,
    body: options?.body,
  });
}
