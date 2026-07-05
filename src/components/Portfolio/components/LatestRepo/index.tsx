import Link from "next/link";
import { RiStarLine, RiGitForkLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  description: string | null;
  language?: string | null;
  stargazers_count?: number;
  forks_count?: number;
}

// A repo card on /portfolio. The whole card links to the repo's own detail page.
export default function LatestRepo({
  name,
  description,
  language,
  stargazers_count,
  forks_count,
}: Props) {
  return (
    <Link href={`/portfolio/repo/${name}`} scroll className="github-repo group block">
      <h1
        className={cn(
          "text-xl font-semibold text-gray-700 transition-colors group-hover:text-secondary",
        )}
      >
        {name}
      </h1>
      <p className="my-4 text-base font-normal text-gray-500">{description}</p>
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
        {language && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-secondary" />
            {language}
          </span>
        )}
        {typeof stargazers_count === "number" && (
          <span className="inline-flex items-center gap-1">
            <RiStarLine className="size-4" />
            {stargazers_count}
          </span>
        )}
        {typeof forks_count === "number" && (
          <span className="inline-flex items-center gap-1">
            <RiGitForkLine className="size-4" />
            {forks_count}
          </span>
        )}
        <span className="ml-auto inline-flex items-center gap-1 font-semibold text-gray-700">
          View details
          <span className="transition duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </span>
      </div>
    </Link>
  );
}
