"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RiStarLine, RiGitForkLine, RiExternalLinkLine } from "react-icons/ri";
import AdminLayout from "@/features/admin/components/admin-layout";
import { ReorderableList } from "@/features/admin/components/reorderable-list";
import { useNotificationsContext } from "@/components/providers/NotificationsProvider";
import { cn } from "@/lib/utils";
import type { GithubRepoSummary, GithubRepoSettings } from "../types";

interface Props {
  repos: GithubRepoSummary[];
  settings: GithubRepoSettings;
}

export function AdminReposPage({ repos, settings }: Props) {
  const { addNotification } = useNotificationsContext();

  // Repos in the saved display order (order-listed first, then newest push).
  const initialOrder = useMemo(() => {
    const idx = new Map(settings.order.map((n, i) => [n, i]));
    return [...repos].sort((a, b) => {
      const ai = idx.has(a.name) ? (idx.get(a.name) as number) : Infinity;
      const bi = idx.has(b.name) ? (idx.get(b.name) as number) : Infinity;
      if (ai !== bi) return ai - bi;
      return b.pushed_at.localeCompare(a.pushed_at);
    });
  }, [repos, settings.order]);

  const [ordered, setOrdered] = useState<GithubRepoSummary[]>(initialOrder);
  const [excluded, setExcluded] = useState<string[]>(settings.excluded);
  const [count, setCount] = useState<number>(settings.count);
  const [saving, setSaving] = useState(false);

  const isExcluded = (name: string) => excluded.includes(name);
  const toggleExclude = (name: string) =>
    setExcluded((e) =>
      e.includes(name) ? e.filter((n) => n !== name) : [...e, name],
    );

  // The names actually shown publicly: first `count` non-excluded, in order.
  const visible = useMemo(() => {
    const set = new Set<string>();
    for (const r of ordered) {
      if (isExcluded(r.name)) continue;
      if (set.size >= count) break;
      set.add(r.name);
    }
    return set;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordered, excluded, count]);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config/githubRepos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: {
            count,
            order: ordered.map((r) => r.name),
            excluded,
          } satisfies GithubRepoSettings,
        }),
      });
      addNotification({
        text: res.ok ? "Repo settings saved" : "Couldn't save",
        variant: res.ok ? "success" : "error",
      });
    } catch {
      addNotification({ text: "Couldn't save", variant: "error" });
    }
    setSaving(false);
  }

  return (
    <AdminLayout title="GitHub Repositories">
      <div className="w-full max-w-4xl pb-28">
        <p className="mb-4 text-sm text-light-400">
          Drag to reorder, toggle a repo off to exclude it, and set how many show
          on the portfolio. Repos shown publicly are highlighted. Click a repo to
          open its public page.
        </p>

        {/* Fetch count */}
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-dark-600 bg-dark-400 p-4">
          <label className="text-sm font-medium text-white">
            Show on portfolio
          </label>
          <input
            type="number"
            min={0}
            max={repos.length}
            value={count}
            onChange={(e) => setCount(Math.max(0, Number(e.target.value) || 0))}
            className="w-20 rounded-lg border border-dark-600 bg-dark-600 px-3 py-1.5 text-sm text-white"
          />
          <span className="text-sm text-light-400">
            of {repos.length} fetched ({excluded.length} excluded)
          </span>
        </div>

        {repos.length === 0 ? (
          <p className="rounded-lg border border-dark-600 bg-dark-400 p-6 text-sm text-light-400">
            No repositories fetched. Check the GitHub username in Profile and the
            GITHUB_AUTH_TOKEN env var.
          </p>
        ) : (
          <ReorderableList
            items={ordered}
            getId={(r) => r.name}
            onReorder={setOrdered}
            renderItem={(repo) => {
              const excludedRow = isExcluded(repo.name);
              const shown = visible.has(repo.name);
              return (
                <div
                  className={cn(
                    "flex items-start justify-between gap-3",
                    excludedRow && "opacity-45",
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-white">
                        {repo.name}
                      </p>
                      {shown && (
                        <span className="rounded bg-success/20 px-1.5 py-0.5 text-[10px] font-medium uppercase text-success">
                          shown
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="mt-0.5 line-clamp-1 text-sm text-light-400">
                        {repo.description}
                      </p>
                    )}
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-light-400">
                      {repo.language && <span>{repo.language}</span>}
                      <span className="inline-flex items-center gap-1">
                        <RiStarLine className="size-3" />
                        {repo.stargazers_count}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <RiGitForkLine className="size-3" />
                        {repo.forks_count}
                      </span>
                    </div>
                  </div>

                  <div
                    data-no-drag
                    className="flex shrink-0 items-center gap-3"
                  >
                    <Link
                      href={`/portfolio/repo/${repo.name}`}
                      target="_blank"
                      aria-label={`Open ${repo.name} page`}
                      className="text-light-400 transition-colors hover:text-white"
                    >
                      <RiExternalLinkLine className="size-4" />
                    </Link>
                    <label className="flex cursor-pointer items-center gap-1.5 text-xs text-light-400">
                      <input
                        type="checkbox"
                        checked={!excludedRow}
                        onChange={() => toggleExclude(repo.name)}
                        className="size-4 accent-success"
                      />
                      Include
                    </label>
                  </div>
                </div>
              );
            }}
          />
        )}
      </div>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-dark-600 bg-dark-500/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success-600 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
