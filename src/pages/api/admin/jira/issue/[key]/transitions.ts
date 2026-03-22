import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/features/admin/lib/admin-auth";
import { getJiraCredentials, jiraFetch } from "@/lib/jira";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await requireAdmin(req, res))) return;

  const credentials = await getJiraCredentials();
  if (!credentials) {
    return res.status(400).json({ error: "Jira not configured" });
  }

  const key = req.query.key as string;

  if (req.method === "GET") {
    // Get available transitions for an issue
    const response = await jiraFetch(
      `/rest/api/3/issue/${key}/transitions`,
      credentials
    );

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    return res.json(data);
  }

  if (req.method === "POST") {
    // Transition an issue to a new status
    const { transitionId } = req.body;
    if (!transitionId) {
      return res.status(400).json({ error: "transitionId is required" });
    }

    const response = await jiraFetch(
      `/rest/api/3/issue/${key}/transitions`,
      credentials,
      {
        method: "POST",
        body: JSON.stringify({ transition: { id: transitionId } }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    // Jira returns 204 No Content on success
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
