import Link from "next/link";
import { skipNextPageTransition } from "@/lib/page-transition";

interface Props {
  name: string;
  description: string | null;
  language?: string | null;
  stargazers_count?: number;
  forks_count?: number;
}

// A compact repo card. The whole card links to the repo's own detail page.
export default function LatestRepo({
  name,
  description,
  language,
  stargazers_count,
  forks_count,
}: Props) {
  return (
    <Link
      href={`/portfolio/repo/${name}`}
      scroll={false}
      onClick={() => skipNextPageTransition()}
      className="group flex flex-col gap-2 rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-400"
    >
      <h3 className="truncate text-sm font-medium text-dark">{name}</h3>
      <p className="line-clamp-3 flex-1 text-xs text-gray-500">{description}</p>
      <div className="mt-auto flex items-center gap-3 text-xs text-gray-400">
        {language && (
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-secondary" />
            {language}
          </span>
        )}
        {typeof stargazers_count === "number" && <span>☆ {stargazers_count}</span>}
        {typeof forks_count === "number" && <span>⑂ {forks_count}</span>}
      </div>
      <span className="mt-1 text-xs text-secondary group-hover:underline">
        View details →
      </span>
    </Link>
  );
}
