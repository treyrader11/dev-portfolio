import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { getJiraCredentials, jiraFetch } from "@/lib/jira";
import { useTimer } from "@/hooks/useTimer";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import type { JiraIssue } from "@/types/jira";

interface Props {
  configured: boolean;
  issues: JiraIssue[];
  jiraError: string | null;
}

interface JiraTransition {
  id: string;
  name: string;
  to: {
    name: string;
    statusCategory: { key: string; colorName: string };
  };
}

const statusColors: Record<string, string> = {
  "blue-gray": "bg-gray-100 text-gray-700",
  blue: "bg-blue-100 text-blue-700",
  yellow: "bg-yellow-100 text-yellow-700",
  green: "bg-green-100 text-green-700",
};

type FilterKey = "in_progress" | "open" | "cancelled" | "in_review" | "rejected" | "done";

const STATUS_FILTERS: { key: FilterKey; label: string; jql: string }[] = [
  {
    key: "in_progress",
    label: "In Progress",
    jql: "assignee = currentUser() AND status = 'In Progress' ORDER BY updated DESC",
  },
  {
    key: "open",
    label: "All Open",
    jql: "assignee = currentUser() AND statusCategory != Done ORDER BY updated DESC",
  },
  {
    key: "in_review",
    label: "In Review",
    jql: "assignee = currentUser() AND status = 'In Review' ORDER BY updated DESC",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    jql: "assignee = currentUser() AND status = 'Cancelled' ORDER BY updated DESC",
  },
  {
    key: "rejected",
    label: "Rejected",
    jql: "assignee = currentUser() AND status = 'Rejected' ORDER BY updated DESC",
  },
  {
    key: "done",
    label: "Done",
    jql: "assignee = currentUser() AND status = 'Done' ORDER BY updated DESC",
  },
];

export default function AdminJira({ configured, issues: initialIssues, jiraError }: Props) {
  const [issues, setIssues] = useState(initialIssues);
  const [jql, setJql] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("in_progress");
  const [timerNotes, setTimerNotes] = useState("");
  const [transitionMenuKey, setTransitionMenuKey] = useState<string | null>(null);
  const [transitions, setTransitions] = useState<JiraTransition[]>([]);
  const [transitionLoading, setTransitionLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { activeEntry, elapsedSeconds, isRunning, startTimer, stopTimer, formatTime } =
    useTimer();

  // Close transition menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setTransitionMenuKey(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function searchIssues(customJql?: string) {
    setLoading(true);
    try {
      const query = customJql || jql || "";
      const url = query
        ? `/api/admin/jira/issues?jql=${encodeURIComponent(query)}`
        : "/api/admin/jira/issues";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setIssues(data.issues || []);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }

  function handleFilterClick(filter: typeof STATUS_FILTERS[number]) {
    setActiveFilter(filter.key);
    searchIssues(filter.jql);
  }

  async function openTransitionMenu(issueKey: string) {
    if (transitionMenuKey === issueKey) {
      setTransitionMenuKey(null);
      return;
    }
    setTransitionMenuKey(issueKey);
    setTransitionLoading(true);
    try {
      const res = await fetch(`/api/admin/jira/issue/${issueKey}/transitions`);
      if (res.ok) {
        const data = await res.json();
        setTransitions(data.transitions || []);
      }
    } catch {
      setTransitions([]);
    }
    setTransitionLoading(false);
  }

  async function doTransition(issueKey: string, transitionId: string) {
    setTransitionLoading(true);
    try {
      const res = await fetch(`/api/admin/jira/issue/${issueKey}/transitions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transitionId }),
      });
      if (res.ok) {
        setTransitionMenuKey(null);
        // Refresh the current filter to reflect the status change
        const currentFilter = STATUS_FILTERS.find((f) => f.key === activeFilter);
        if (currentFilter) {
          await searchIssues(currentFilter.jql);
        } else {
          await searchIssues();
        }
      }
    } catch {
      // ignore
    }
    setTransitionLoading(false);
  }

  if (!configured) {
    return (
      <AdminLayout title="Jira Tickets">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900">Jira is not configured</h3>
          <p className="text-sm text-blue-700 mt-1">
            Go to{" "}
            <Link href="/admin/settings" className="underline font-medium">
              Settings
            </Link>{" "}
            to add your Jira credentials.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Jira Tickets">
      <div className="space-y-6">
        {/* Active Timer Bar */}
        {isRunning && activeEntry && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-mono text-lg font-bold text-green-800">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                <span className="font-medium">{activeEntry.ticketKey}</span> —{" "}
                {activeEntry.ticketSummary}
              </p>
            </div>
            <input
              value={timerNotes}
              onChange={(e) => setTimerNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="px-3 py-2 border border-green-300 rounded-lg text-sm w-64"
            />
            <button
              onClick={async () => {
                await stopTimer(timerNotes || undefined);
                setTimerNotes("");
              }}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
            >
              Stop
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex gap-2">
          <input
            value={jql}
            onChange={(e) => setJql(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setActiveFilter(null as unknown as FilterKey);
                searchIssues();
              }
            }}
            placeholder="JQL query (e.g., project = EM AND status = 'In Progress')"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            onClick={() => {
              setActiveFilter(null as unknown as FilterKey);
              searchIssues();
            }}
            disabled={loading}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleFilterClick(filter)}
              className={`px-3 py-1.5 text-xs font-medium border rounded-full transition-colors ${
                activeFilter === filter.key
                  ? "bg-gray-900 text-white border-gray-900"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {jiraError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            {jiraError}
          </div>
        )}

        {/* Issues Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Key
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Summary
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Project
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => {
                const colorName = issue.fields?.status?.statusCategory?.colorName || "";
                const badgeClass = statusColors[colorName] || "bg-gray-100 text-gray-700";
                const isTimerOnThis =
                  isRunning && activeEntry?.ticketKey === issue.key;

                return (
                  <tr key={issue.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">
                      {issue.key}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {issue.fields?.summary || "—"}
                    </td>
                    <td className="px-4 py-3 relative">
                      <button
                        onClick={() => openTransitionMenu(issue.key)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-gray-300 transition ${badgeClass}`}
                        title="Change status"
                      >
                        {issue.fields?.status?.name || "Unknown"}
                        <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {transitionMenuKey === issue.key && (
                        <div
                          ref={menuRef}
                          className="absolute left-4 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px]"
                        >
                          {transitionLoading ? (
                            <div className="px-4 py-3 text-xs text-gray-500">Loading...</div>
                          ) : transitions.length === 0 ? (
                            <div className="px-4 py-3 text-xs text-gray-500">No transitions available</div>
                          ) : (
                            <div className="py-1">
                              <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                Move to
                              </div>
                              {transitions.map((t) => {
                                const tColor = statusColors[t.to.statusCategory.colorName] || "bg-gray-100 text-gray-700";
                                return (
                                  <button
                                    key={t.id}
                                    onClick={() => doTransition(issue.key, t.id)}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <span className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded ${tColor}`}>
                                      {t.to.name}
                                    </span>
                                    <span className="text-gray-500 text-xs">{t.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {issue.fields?.project?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isTimerOnThis ? (
                        <span className="text-xs text-green-600 font-medium">
                          Tracking...
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            startTimer(
                              issue.key,
                              issue.fields?.summary || issue.key,
                              issue.fields?.project?.key,
                              issue.fields?.project?.name
                            )
                          }
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Start Timer
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {issues.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No issues found. Try a different filter or search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

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
    const fields = "summary,status,project,priority,assignee,updated,created";
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
