"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, resolveImageSrc, slugify } from "@/lib/utils";
import { readVisits, recordVisit } from "@/lib/project-visits";
import type { ProjectData } from "@/types/data";

interface Props {
  // The project currently being viewed (excluded from the rail).
  currentProject: ProjectData;
  // All portfolio projects to pick from.
  projects: ProjectData[];
  className?: string;
}

// How alike two projects are — same category counts most, then shared tags,
// then shared technology features, then the same stack. Purely content-based and
// deterministic so it's stable across server and client renders.
function similarityScore(a: ProjectData, b: ProjectData): number {
  const overlap = (x?: string[], y?: string[]) => {
    const set = new Set((x ?? []).filter(Boolean).map((s) => s.toLowerCase()));
    return (y ?? []).filter((s) => s && set.has(s.toLowerCase())).length;
  };
  let score = 0;
  if (a.category && b.category && a.category === b.category) score += 3;
  score += overlap(a.tags, b.tags) * 2;
  score += overlap(a.technology_feature, b.technology_feature);
  if (a.stack && b.stack && a.stack.toLowerCase() === b.stack.toLowerCase())
    score += 1;
  return score;
}

// A horizontally scrollable rail of related projects shown at the bottom of a
// project page. Ordering: projects the visitor hasn't seen come first, most
// similar to the current project first; projects they've already seen trail,
// ordered by how recently they saw them (most recent first). "Seen" state lives
// in localStorage, so the initial paint is pure similarity (no hydration
// mismatch) and the seen-aware reorder happens after mount.
export default function SimilarProjects({
  currentProject,
  projects,
  className,
}: Props) {
  const currentSlug = slugify(currentProject.title);

  // Candidates in similarity order — the deterministic default used for SSR and
  // the first client render.
  const bySimilarity = useMemo(
    () =>
      projects
        .filter((p) => slugify(p.title) !== currentSlug)
        .map((p) => ({ project: p, score: similarityScore(currentProject, p) }))
        .sort((a, b) => b.score - a.score)
        .map((x) => x.project),
    [projects, currentProject, currentSlug],
  );

  const [ordered, setOrdered] = useState<ProjectData[]>(bySimilarity);

  useEffect(() => {
    const visits = readVisits();
    const unseen: ProjectData[] = [];
    const seen: { project: ProjectData; at: number }[] = [];
    // Walk in similarity order so unseen projects keep that order.
    for (const project of bySimilarity) {
      const at = visits[slugify(project.title)];
      if (at) seen.push({ project, at });
      else unseen.push(project);
    }
    seen.sort((a, b) => b.at - a.at); // most recently seen first
    setOrdered([...unseen, ...seen.map((s) => s.project)]);

    // Mark the current project as seen so it trails on other projects' rails.
    recordVisit(currentSlug);
  }, [bySimilarity, currentSlug]);

  if (ordered.length === 0) return null;

  return (
    <section className={cn("w-full", className)}>
      <h3 className="px-6 text-2xl font-bold text-dark sm:px-8 md:px-16">
        Similar projects
      </h3>

      {/* Full-width horizontal carousel — spans the whole screen, a single
          scrollable row, cards never wrap. Scrollbar hidden. */}
      <div className="mt-4 flex w-full gap-6 overflow-x-auto scroll-smooth px-6 pb-4 sm:px-8 md:px-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ordered.map((project) => {
          const slug = slugify(project.title);
          return (
            <Link
              key={slug}
              href={`/portfolio/${slug}`}
              scroll
              className="group w-[300px] flex-shrink-0 sm:w-[360px]"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/5 shadow-sm">
                <Image
                  src={resolveImageSrc(project.project_image || "", "/images")}
                  alt={`${project.title} poster`}
                  fill
                  sizes="(max-width: 640px) 16rem, 18rem"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 truncate font-semibold text-dark">
                {project.title}
              </p>
              {project.category && (
                <p className="truncate text-sm text-gray-500">
                  {project.category}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
