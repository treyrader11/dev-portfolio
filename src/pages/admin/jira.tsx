import { AdminJiraPage } from "@/features/jira";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getJiraCredentials, jiraFetch } from "@/features/jira/lib/jira-client";
import type { GetServerSideProps } from "next";
import type { JiraIssue } from "@/features/jira/types";

export default AdminJiraPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }

  const credentials = await getJiraCredentials();
  if (!credentials) {
    return { props: { configured: false, issues: [], jiraError: null } };
  }

  try {
    // Default: show In Progress tickets
    const defaultJql = "assignee = currentUser() AND status = 'In Progress' ORDER BY updated DESC";
    const fields = "summary,status,project,priority,assignee,reporter,creator,updated,created";
    const response = await jiraFetch(
      `/rest/api/3/search/jql?jql=${encodeURIComponent(defaultJql)}&maxResults=50&fields=${fields}`,
      credentials
    );

    if (!response.ok) {
      return {
        props: {
          configured: true,
          issues: [],
          jiraError: `Jira returned ${response.status}: ${response.statusText}`,
        },
      };
    }

    const data = await response.json();
    return {
      props: {
        configured: true,
        issues: data.issues || [],
        jiraError: null,
      },
    };
  } catch (e) {
    return {
      props: {
        configured: true,
        issues: [],
        jiraError: `Failed to connect to Jira: ${(e as Error).message}`,
      },
    };
  }
};
