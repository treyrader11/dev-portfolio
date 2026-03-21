import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { getJiraCredentials, jiraFetch } from "@/lib/jira";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const credentials = await getJiraCredentials();
  if (!credentials) {
    return res.status(400).json({ error: "Jira not configured" });
  }

  try {
    // Fetch users assignable to any project in the organization
    // This effectively gets all active members
    const response = await jiraFetch(
      `/rest/api/3/users/search?maxResults=200`,
      credentials
    );

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const users = await response.json();

    // Filter to only active users with accountType "atlassian" (not app or customer)
    const members = users
      .filter(
        (u: { active: boolean; accountType: string; displayName: string }) =>
          u.active && u.accountType === "atlassian" && u.displayName
      )
      .map(
        (u: {
          accountId: string;
          displayName: string;
          emailAddress?: string;
          avatarUrls?: Record<string, string>;
        }) => ({
          accountId: u.accountId,
          displayName: u.displayName,
          emailAddress: u.emailAddress || null,
          avatarUrl: u.avatarUrls?.["24x24"] || null,
        })
      )
      .sort((a: { displayName: string }, b: { displayName: string }) =>
        a.displayName.localeCompare(b.displayName)
      );

    return res.json(members);
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message });
  }
}
