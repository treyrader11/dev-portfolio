import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { getJiraCredentials, jiraFetch } from "@/lib/jira";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!(await requireAdmin(req, res))) return;

  const credentials = await getJiraCredentials();
  if (!credentials) {
    return res.status(400).json({ error: "Jira not configured" });
  }

  const response = await jiraFetch(
    "/rest/api/3/project/search?maxResults=50&orderBy=name",
    credentials
  );

  if (!response.ok) {
    const error = await response.text();
    return res.status(response.status).json({ error });
  }

  const data = await response.json();
  return res.json(data.values || []);
}
