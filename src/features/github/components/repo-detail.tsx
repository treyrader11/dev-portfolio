import {
  RiStarLine,
  RiGitForkLine,
  RiEyeLine,
  RiErrorWarningLine,
  RiGithubFill,
  RiExternalLinkLine,
  RiGitRepositoryLine,
  RiScales3Line,
} from "react-icons/ri";
import { cn, titleCaseFromSlug } from "@/lib/utils";
import type { GithubRepoDetail } from "../lib/github";

interface Props {
  repo: GithubRepoDetail;
}

// A small deterministic palette for the language bar (by index).
const LANG_COLORS = [
  "#3178c6",
  "#f1e05a",
  "#e34c26",
  "#563d7c",
  "#2b7489",
  "#89e051",
  "#dea584",
  "#00ADD8",
  "#701516",
  "#a270ba",
];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2">
      <Icon className="size-4 text-secondary" />
      <span className="font-semibold text-dark">
        {value.toLocaleString()}
      </span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

export default function RepoDetail({ repo }: Props) {
  const langs = Object.entries(repo.languages).sort((a, b) => b[1] - a[1]);
  const totalBytes = langs.reduce((sum, [, b]) => sum + b, 0) || 1;

  return (
    <section className="w-full bg-[#F1F1F1] pb-28">
      <div className="mx-auto w-full max-w-3xl px-4 pt-40 sm:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-gray-500">
              <RiGitRepositoryLine className="size-5" />
              <span className="truncate text-sm">{repo.full_name}</span>
            </div>
            <h1 className="mt-1 break-words font-pp-acma text-4xl font-bold text-dark">
              {titleCaseFromSlug(repo.name)}
            </h1>
            {repo.description && (
              <p className="mt-3 max-w-2xl text-lg text-gray-600">
                {repo.description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-2">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-dark px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
            >
              <RiGithubFill className="size-5" />
              View on GitHub
            </a>
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-dark px-5 py-2.5 text-sm font-medium text-dark transition-colors hover:bg-dark hover:text-white"
              >
                <RiExternalLinkLine className="size-4" />
                Live site
              </a>
            )}
          </div>
        </div>

        {/* Topics */}
        {repo.topics.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {repo.topics.map((t) => (
              <span
                key={t}
                className="rounded-full bg-secondary/10 px-3 py-1 text-sm text-secondary"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Stat icon={RiStarLine} label="stars" value={repo.stargazers_count} />
          <Stat icon={RiGitForkLine} label="forks" value={repo.forks_count} />
          <Stat icon={RiEyeLine} label="watchers" value={repo.watchers_count} />
          <Stat
            icon={RiErrorWarningLine}
            label="open issues"
            value={repo.open_issues_count}
          />
        </div>

        {/* Meta */}
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-black/10 bg-white p-4 sm:grid-cols-4">
          <Meta label="Created" value={formatDate(repo.created_at)} />
          <Meta label="Last push" value={formatDate(repo.pushed_at)} />
          <Meta label="Default branch" value={repo.default_branch} />
          <Meta
            label="License"
            value={repo.license ?? "—"}
            icon={repo.license ? RiScales3Line : undefined}
          />
        </div>

        {/* Languages */}
        {langs.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-dark">Languages</h2>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-black/5">
              {langs.map(([name, bytes], i) => (
                <div
                  key={name}
                  title={`${name} ${((bytes / totalBytes) * 100).toFixed(1)}%`}
                  style={{
                    width: `${(bytes / totalBytes) * 100}%`,
                    backgroundColor: LANG_COLORS[i % LANG_COLORS.length],
                  }}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              {langs.map(([name, bytes], i) => (
                <span key={name} className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block size-2.5 rounded-full"
                    style={{
                      backgroundColor: LANG_COLORS[i % LANG_COLORS.length],
                    }}
                  />
                  {name} {((bytes / totalBytes) * 100).toFixed(1)}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* README */}
        {repo.readmeHtml && (
          <div className="mt-10">
            <h2 className="mb-3 text-lg font-semibold text-dark">README</h2>
            <div
              className={cn(
                "github-readme rounded-xl border border-black/10 bg-white p-6",
                "prose-headings:font-bold text-gray-800",
              )}
              // Own repos only; GitHub returns already-rendered, sanitized HTML.
              dangerouslySetInnerHTML={{ __html: repo.readmeHtml }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function Meta({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-0.5 flex items-center gap-1 font-medium text-dark">
        {Icon && <Icon className="size-4 text-secondary" />}
        {value}
      </p>
    </div>
  );
}
