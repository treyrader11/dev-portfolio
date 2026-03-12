import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/admin-auth";
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

  if (req.method === "GET") {
    const jql =
      (req.query.jql as string) ||
      "assignee = currentUser() ORDER BY updated DESC";
    const maxResults = req.query.maxResults || "50";

    const fields = "summary,status,project,priority,assignee,updated,created";
    const response = await jiraFetch(
      `/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}&fields=${fields}`,
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
    const { projectKey, summary, description, issueType } = req.body;

    if (!projectKey || !summary) {
      return res.status(400).json({ error: "projectKey and summary are required" });
    }

    const response = await jiraFetch(
      "/rest/api/3/issue",
      credentials,
      {
        method: "POST",
        body: JSON.stringify({
          fields: {
            project: { key: projectKey },
            summary,
            description: description
              ? {
                  type: "doc",
                  version: 1,
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: description }],
                    },
                  ],
                }
              : undefined,
            issuetype: { name: issueType || "Task" },
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    return res.json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
