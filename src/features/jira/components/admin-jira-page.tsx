import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/features/admin/components/admin-layout";
import { useTimer } from "../hooks/use-timer";
import Link from "next/link";
import * as Popover from "@radix-ui/react-popover";
import { RiMore2Fill, RiTimeLine, RiDeleteBinLine } from "react-icons/ri";
import type { JiraIssue } from "../types";

interface JiraProject {
  id: string;
  key: string;
  name: string;
}

interface JiraMember {
  accountId: string;
  displayName: string;
  emailAddress: string | null;
  avatarUrl: string | null;
}

type MemberFilterType = "assignee" | "reporter" | "creator";

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
  "blue-gray": "bg-dark-600 text-white",
  blue: "bg-blue-900/40 text-blue-400",
  yellow: "bg-yellow-900/40 text-yellow-400",
  green: "bg-green-900/40 text-green-400",
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

export function AdminJiraPage({ configured, issues: initialIssues, jiraError }: Props) {
  const [issues, setIssues] = useState(initialIssues);
  const [jql, setJql] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("in_progress");
  const [timerNotes, setTimerNotes] = useState("");
  const [openPopoverKey, setOpenPopoverKey] = useState<string | null>(null);
  const [transitions, setTransitions] = useState<JiraTransition[]>([]);
  const [transitionLoading, setTransitionLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [createForm, setCreateForm] = useState({
    projectKey: "",
    summary: "",
    description: "",
    issueType: "Task",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [members, setMembers] = useState<JiraMember[]>([]);
  const [memberFilterType, setMemberFilterType] = useState<MemberFilterType>("assignee");
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);
  const [openActionsKey, setOpenActionsKey] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const { activeEntry, elapsedSeconds, isRunning, startTimer, stopTimer, formatTime } =
    useTimer();

  // Fetch org members on mount
  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch("/api/admin/jira/users");
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        }
      } catch {
        // ignore
      }
    }
    if (configured) fetchMembers();
  }, [configured]);

  function handleMemberFilter(accountId: string, filterType: MemberFilterType) {
    setSelectedMember(accountId);
    setMemberFilterType(filterType);
    if (!accountId) {
      // Reset to active status filter
      const currentFilter = STATUS_FILTERS.find((f) => f.key === activeFilter);
      if (currentFilter) {
        searchIssues(currentFilter.jql);
      }
      return;
    }
    const jqlField = filterType === "assignee" ? "assignee" : filterType === "reporter" ? "reporter" : "creator";
    const statusFilter = STATUS_FILTERS.find((f) => f.key === activeFilter);
    const statusClause = statusFilter
      ? statusFilter.jql.replace(/assignee = currentUser\(\) AND /, "").replace(/ ORDER BY.*/, "")
      : "";
    const jql = statusClause
      ? `${jqlField} = "${accountId}" AND ${statusClause} ORDER BY updated DESC`
      : `${jqlField} = "${accountId}" ORDER BY updated DESC`;
    searchIssues(jql);
  }

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/jira/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        if (data.length > 0 && !createForm.projectKey) {
          setCreateForm((prev) => ({ ...prev, projectKey: data[0].key }));
        }
      }
    } catch {
      // ignore
    }
  }, [createForm.projectKey]);

  useEffect(() => {
    if (showCreateForm && projects.length === 0) {
      fetchProjects();
    }
  }, [showCreateForm, projects.length, fetchProjects]);

  async function handleCreateTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.projectKey || !createForm.summary) return;

    setCreateLoading(true);
    setCreateError("");
    try {
      const res = await fetch("/api/admin/jira/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        setShowCreateForm(false);
        setCreateForm({ projectKey: projects[0]?.key || "", summary: "", description: "", issueType: "Task" });
        // Refresh the "All Open" filter to show the new ticket
        setActiveFilter("open");
        await searchIssues("assignee = currentUser() AND statusCategory != Done ORDER BY updated DESC");
      } else {
        const data = await res.json();
        setCreateError(data.error || "Failed to create ticket");
      }
    } catch {
      setCreateError("Failed to create ticket");
    }
    setCreateLoading(false);
  }

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

  function handleFilterClick(filter: (typeof STATUS_FILTERS)[number]) {
    setActiveFilter(filter.key);
    if (selectedMember) {
      // Combine member filter with status filter
      const jqlField = memberFilterType === "assignee" ? "assignee" : memberFilterType === "reporter" ? "reporter" : "creator";
      const statusClause = filter.jql.replace(/assignee = currentUser\(\) AND /, "").replace(/ ORDER BY.*/, "");
      searchIssues(`${jqlField} = "${selectedMember}" AND ${statusClause} ORDER BY updated DESC`);
    } else {
      searchIssues(filter.jql);
    }
  }

  async function handlePopoverOpen(issueKey: string, isOpen: boolean) {
    if (!isOpen) {
      setOpenPopoverKey(null);
      return;
    }
    setOpenPopoverKey(issueKey);
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
        setOpenPopoverKey(null);
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

  async function handleDeleteIssue(issueKey: string) {
    if (!confirm(`Are you sure you want to delete ${issueKey}? This cannot be undone.`)) return;
    setDeleteLoading(issueKey);
    try {
      const res = await fetch(`/api/admin/jira/issue/${issueKey}`, { method: "DELETE" });
      if (res.ok || res.status === 204) {
        setIssues((prev) => prev.filter((i) => i.key !== issueKey));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete issue");
      }
    } catch {
      alert("Failed to delete issue");
    }
    setDeleteLoading(null);
    setOpenActionsKey(null);
  }

  if (!configured) {
    return (
      <AdminLayout title="Jira Tickets">
        <div className="bg-blue-950/40 border border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400">Jira is not configured</h3>
          <p className="text-sm text-blue-400 mt-1">
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
          <div className="bg-green-950/40 border border-green-800 rounded-lg p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-mono text-lg font-bold text-green-400">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
              <p className="text-sm text-green-400 mt-1">
                <span className="font-medium">{activeEntry.ticketKey}</span> —{" "}
                {activeEntry.ticketSummary}
              </p>
            </div>
            <input
              value={timerNotes}
              onChange={(e) => setTimerNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="px-3 py-2 border border-green-800 rounded-lg text-sm w-64"
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

        {/* Search Bar + Create Button */}
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
            className="flex-1 px-3 py-2 border border-dark-600 rounded-lg text-sm"
          />
          <button
            onClick={() => {
              setActiveFilter(null as unknown as FilterKey);
              searchIssues();
            }}
            disabled={loading}
            className="px-4 py-2 bg-dark-600 text-white text-sm font-medium rounded-lg hover:bg-dark-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Search"}
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-secondary text-white text-sm font-medium rounded-lg hover:bg-secondary/80 whitespace-nowrap"
          >
            + Create Ticket
          </button>
        </div>

        {/* Create Ticket Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-dark-400 rounded-lg shadow-xl w-full max-w-lg mx-4">
              <div className="flex items-center justify-between p-6 border-b border-dark-600">
                <h2 className="text-lg font-semibold text-white">Create Jira Ticket</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-light-400 hover:text-light-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Project</label>
                  <select
                    value={createForm.projectKey}
                    onChange={(e) => setCreateForm({ ...createForm, projectKey: e.target.value })}
                    className="w-full px-3 py-2 border border-dark-600 rounded-lg text-sm"
                    required
                  >
                    {projects.length === 0 && <option value="">Loading projects...</option>}
                    {projects.map((p) => (
                      <option key={p.key} value={p.key}>
                        {p.name} ({p.key})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Issue Type</label>
                  <select
                    value={createForm.issueType}
                    onChange={(e) => setCreateForm({ ...createForm, issueType: e.target.value })}
                    className="w-full px-3 py-2 border border-dark-600 rounded-lg text-sm"
                  >
                    <option value="Task">Task</option>
                    <option value="Bug">Bug</option>
                    <option value="Story">Story</option>
                    <option value="Epic">Epic</option>
                    <option value="Subtask">Subtask</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Summary</label>
                  <input
                    value={createForm.summary}
                    onChange={(e) => setCreateForm({ ...createForm, summary: e.target.value })}
                    placeholder="Brief description of the issue"
                    className="w-full px-3 py-2 border border-dark-600 rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Description <span className="text-light-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    placeholder="Detailed description..."
                    rows={4}
                    className="w-full px-3 py-2 border border-dark-600 rounded-lg text-sm resize-none"
                  />
                </div>
                {createError && (
                  <div className="text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-lg p-3">
                    {createError}
                  </div>
                )}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-sm font-medium text-white border border-dark-600 rounded-lg hover:bg-dark-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading || !createForm.summary || !createForm.projectKey}
                    className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/80 disabled:opacity-50"
                  >
                    {createLoading ? "Creating..." : "Create Ticket"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleFilterClick(filter)}
              className={`px-3 py-1.5 text-xs font-medium border rounded-full transition-colors ${
                activeFilter === filter.key
                  ? "bg-dark-600 text-white border-dark-600"
                  : "border-dark-600 text-white hover:bg-dark-600"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Member Filter */}
        {members.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium text-light-400 uppercase tracking-wider">Filter by</span>
            <select
              value={memberFilterType}
              onChange={(e) => {
                const type = e.target.value as MemberFilterType;
                setMemberFilterType(type);
                if (selectedMember) {
                  handleMemberFilter(selectedMember, type);
                }
              }}
              className="px-2 py-1.5 text-xs border border-dark-600 rounded-lg bg-dark-400"
            >
              <option value="assignee">Assigned To</option>
              <option value="reporter">Reported By</option>
              <option value="creator">Created By</option>
            </select>
            <Popover.Root open={memberDropdownOpen} onOpenChange={setMemberDropdownOpen}>
              <Popover.Trigger asChild>
                <button className="flex items-center gap-2 px-2 py-1.5 text-xs border border-dark-600 rounded-lg bg-dark-400 min-w-[180px] hover:bg-dark-600 transition">
                  {selectedMember ? (
                    <>
                      {(() => {
                        const m = members.find((m) => m.accountId === selectedMember);
                        if (!m) return <span>All Members</span>;
                        return (
                          <>
                            {m.avatarUrl ? (
                              <img src={m.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
                            ) : (
                              <span className="w-5 h-5 rounded-full bg-dark-600 flex items-center justify-center text-[10px] font-medium text-white">
                                {m.displayName?.[0]}
                              </span>
                            )}
                            <span className="flex-1 text-left text-white">{m.displayName}</span>
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <span className="flex-1 text-left text-light-400">All Members</span>
                  )}
                  <svg className="w-3 h-3 text-light-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  className="z-50 bg-dark-400 border border-dark-600 rounded-lg shadow-lg min-w-[220px] max-h-[280px] overflow-y-auto py-1"
                >
                  <button
                    onClick={() => {
                      handleMemberFilter("", memberFilterType);
                      setMemberDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-dark-600 ${!selectedMember ? "bg-dark-400 font-medium" : ""}`}
                  >
                    All Members
                  </button>
                  {members.map((m) => (
                    <button
                      key={m.accountId}
                      onClick={() => {
                        handleMemberFilter(m.accountId, memberFilterType);
                        setMemberDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-dark-600 flex items-center gap-2 ${selectedMember === m.accountId ? "bg-dark-400 font-medium" : ""}`}
                    >
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} alt="" className="w-5 h-5 rounded-full flex-shrink-0" />
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-dark-600 flex items-center justify-center text-[10px] font-medium text-white flex-shrink-0">
                          {m.displayName?.[0]}
                        </span>
                      )}
                      <span className="text-white">{m.displayName}</span>
                    </button>
                  ))}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
            {selectedMember && (
              <button
                onClick={() => {
                  setSelectedMember("");
                  const currentFilter = STATUS_FILTERS.find((f) => f.key === activeFilter);
                  if (currentFilter) searchIssues(currentFilter.jql);
                }}
                className="px-2 py-1 text-xs text-light-400 hover:text-white border border-dark-600 rounded-full hover:bg-dark-600"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Error */}
        {jiraError && (
          <div className="bg-red-950/40 border border-red-800 rounded-lg p-4 text-sm text-red-400">
            {jiraError}
          </div>
        )}

        {/* Issues Table */}
        <div className="bg-dark-400 rounded-lg border border-dark-600 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-dark-400 border-b border-dark-600">
                <th className="text-left px-4 py-3 text-xs font-medium text-light-400 uppercase">
                  Key
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-light-400 uppercase">
                  Summary
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-light-400 uppercase">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-light-400 uppercase">
                  Assignee
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-light-400 uppercase">
                  Reporter
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-light-400 uppercase">
                  Project
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-light-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => {
                const colorName = issue.fields?.status?.statusCategory?.colorName || "";
                const badgeClass = statusColors[colorName] || "bg-dark-600 text-white";
                const isTimerOnThis =
                  isRunning && activeEntry?.ticketKey === issue.key;

                return (
                  <tr key={issue.id} className="border-b border-dark-600 hover:bg-dark-600">
                    <td className="px-4 py-3 text-sm font-medium text-blue-400 whitespace-nowrap">
                      {issue.key}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {issue.fields?.summary || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Popover.Root
                        open={openPopoverKey === issue.key}
                        onOpenChange={(isOpen) => handlePopoverOpen(issue.key, isOpen)}
                      >
                        <Popover.Trigger asChild>
                          <button
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-dark-600 transition ${badgeClass}`}
                            title="Change status"
                          >
                            {issue.fields?.status?.name || "Unknown"}
                            <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </Popover.Trigger>
                        <Popover.Portal>
                          <Popover.Content
                            side="bottom"
                            align="start"
                            sideOffset={4}
                            className="z-50 bg-dark-400 border border-dark-600 rounded-lg shadow-lg min-w-[180px] animate-slide-up"
                          >
                            {transitionLoading ? (
                              <div className="px-4 py-3 text-xs text-light-400">Loading...</div>
                            ) : transitions.length === 0 ? (
                              <div className="px-4 py-3 text-xs text-light-400">No transitions available</div>
                            ) : (
                              <div className="py-1">
                                <div className="px-3 py-1.5 text-[10px] font-semibold text-light-400 uppercase tracking-wider">
                                  Move to
                                </div>
                                {transitions.map((t) => {
                                  const tColor = statusColors[t.to.statusCategory.colorName] || "bg-dark-600 text-white";
                                  return (
                                    <button
                                      key={t.id}
                                      onClick={() => doTransition(issue.key, t.id)}
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-dark-600 flex items-center gap-2"
                                    >
                                      <span className={`inline-block px-1.5 py-0.5 text-[10px] font-medium rounded ${tColor}`}>
                                        {t.to.name}
                                      </span>
                                      <span className="text-light-400 text-xs">{t.name}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </Popover.Content>
                        </Popover.Portal>
                      </Popover.Root>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {issue.fields?.assignee ? (
                        <div className="flex items-center gap-2">
                          {issue.fields.assignee.avatarUrls?.["24x24"] ? (
                            <img
                              src={issue.fields.assignee.avatarUrls["24x24"]}
                              alt=""
                              className="w-5 h-5 rounded-full"
                            />
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-dark-600 flex items-center justify-center text-[10px] font-medium text-white">
                              {issue.fields.assignee.displayName?.[0]}
                            </span>
                          )}
                          <span className="text-sm text-white">{issue.fields.assignee.displayName}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-light-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {issue.fields?.reporter ? (
                        <div className="flex items-center gap-2">
                          {issue.fields.reporter.avatarUrls?.["24x24"] ? (
                            <img
                              src={issue.fields.reporter.avatarUrls["24x24"]}
                              alt=""
                              className="w-5 h-5 rounded-full"
                            />
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-dark-600 flex items-center justify-center text-[10px] font-medium text-white">
                              {issue.fields.reporter.displayName?.[0]}
                            </span>
                          )}
                          <span className="text-sm text-white">{issue.fields.reporter.displayName}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-light-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-light-400 whitespace-nowrap">
                      {issue.fields?.project?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isTimerOnThis ? (
                        <span className="text-xs text-green-400 font-medium">
                          Tracking...
                        </span>
                      ) : (
                        <Popover.Root
                          open={openActionsKey === issue.key}
                          onOpenChange={(isOpen) => setOpenActionsKey(isOpen ? issue.key : null)}
                        >
                          <Popover.Trigger asChild>
                            <button className="p-1.5 rounded-lg hover:bg-dark-600 transition">
                              <RiMore2Fill className="w-4 h-4 text-light-400" />
                            </button>
                          </Popover.Trigger>
                          <Popover.Portal>
                            <Popover.Content
                              side="bottom"
                              align="end"
                              sideOffset={4}
                              className="z-50 bg-dark-400 border border-dark-600 rounded-lg shadow-lg min-w-[160px] py-1"
                            >
                              {issue.fields?.status?.name === "In Progress" && (
                                <button
                                  onClick={() => {
                                    startTimer(
                                      issue.key,
                                      issue.fields?.summary || issue.key,
                                      issue.fields?.project?.key,
                                      issue.fields?.project?.name
                                    );
                                    setOpenActionsKey(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs hover:bg-green-950/40 flex items-center gap-2 text-green-400"
                                >
                                  <RiTimeLine className="w-4 h-4" />
                                  Start Timer
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteIssue(issue.key)}
                                disabled={deleteLoading === issue.key}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-red-950/40 flex items-center gap-2 text-red-400 disabled:opacity-50"
                              >
                                <RiDeleteBinLine className="w-4 h-4" />
                                {deleteLoading === issue.key ? "Deleting..." : "Delete"}
                              </button>
                            </Popover.Content>
                          </Popover.Portal>
                        </Popover.Root>
                      )}
                    </td>
                  </tr>
                );
              })}
              {issues.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-light-400"
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
