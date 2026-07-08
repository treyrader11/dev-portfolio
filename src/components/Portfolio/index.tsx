"use client";

import { cn, getUnique } from "@/lib/utils";
import NoiseBg from "@/components/NoiseBg";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import PortfolioItem from "./components/PortfolioItem";
import { useScroll, useMotionValueEvent } from "framer-motion";
import ProjectCategories from "./components/ProjectCategories";
import Search from "./components/Search";
import CursorModal from "./components/CursorModal";
import { useCursorModal } from "./useCursorModal";
import { useIsInView } from "@/hooks/useIsInView";
import { useIsMobile } from "@/hooks/useWindowDimensions";
import LatestRepo from "./components/LatestRepo";
import GithubContributions from "@/features/github/components/GithubContributions";
import PageTitle from "../PageTitle";
import type { PortfolioPageProps } from "@/pages/portfolio";

export default function Portfolio({
  repositories,
  projects,
  intro,
  contributions,
  githubUsername,
}: PortfolioPageProps) {
  const [latestRepos, setLatestRepos] = useState(repositories);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState(0);

  const [isInView, setIsInView] = useState(false);

  const [categories] = useState(["All", ...getUnique(projects, "category")]);

  // Derive filtered projects from both category and search
  const filteredProjects = projects.filter((proj) => {
    const matchesCategory =
      activeCategory === "All" || proj.category === activeCategory;
    const matchesSearch =
      searchText.trim() === "" ||
      proj.tags.some((tag) =>
        tag.toLowerCase().includes(searchText.toLowerCase()),
      ) ||
      proj.title.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // GitHub repos are filtered by their title (name) using the same search term.
  const filteredRepos = latestRepos.filter((repo) => {
    if (searchText.trim() === "") return true;
    return repo.name.toLowerCase().includes(searchText.toLowerCase());
  });

  const isSearching = searchText.trim() !== "";

  const { scrollY } = useScroll();

  const inputRef = useRef<HTMLInputElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const reposRef = useRef<HTMLDivElement>(null);

  // When a search matches only GitHub repos (no main projects), the matches
  // live at the very bottom of the page. Scroll them into view so the results
  // aren't stranded off-screen. Guarded + debounced so it never fires while the
  // top projects list still has visible matches or mid-keystroke.
  useEffect(() => {
    if (!isSearching) return;
    if (filteredProjects.length > 0) return;
    if (filteredRepos.length === 0) return;

    const id = window.setTimeout(() => {
      reposRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);

    return () => window.clearTimeout(id);
  }, [isSearching, filteredProjects.length, filteredRepos.length]);

  // useIsInView(container.current, modalRef.current);

  const isElementInView = useIsInView(
    container?.current,
    modalRef?.current,
    100,
  );

  const filterProjects = (category: string, index: number) => {
    setSelected(index);
    gsap.to(container.current, {
      duration: 0.4,
      opacity: 0,
      y: 15,
      ease: "power4.out",
      onComplete: () => {
        setActiveCategory(category);
        gsap.to(container.current, {
          duration: 0.4,
          y: 0,
          opacity: 1,
          ease: "power4.out",
        });
      },
    });
  };

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setSearchText("");
  };

  const openSearch = () => {
    setFocused((prev) => !prev);
    if (!focused) {
      inputRef.current?.focus();
    }
    if (focused) {
      clearInput();
    }
  };

  const filterProjectsBySearch = (text: string) => {
    setSearchText(text);
  };

  // Cursor-following project modal (card + dot + "View" label), only on devices
  // with a real pointer — never on touch screens, which have no hover.
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { modalContainer, cursor, cursorLabel, modal, moveItems, manageModal } =
    useCursorModal(canHover);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsInView(latest > 200);
  });

  // Detect when the search header is stuck to the top of the viewport so we can
  // slide the search clear of the fixed resume corner badge (mobile only).
  const isMobile = useIsMobile();
  const [stuck, setStuck] = useState(false);
  const stickySentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stickySentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      onMouseMove={(e) => {
        if (canHover) moveItems(e.clientX, e.clientY);
      }}
      className="pb-8"
    >
      <div className={cn("relative overflow-hidden pt-12 pb-8 mx-0 bg-dark")}>
        <NoiseBg area="portfolioHeader" className="z-0" />
        <p className="relative z-10 px-6 text-white">{intro}</p>
      </div>

      {/* Sentinel: when it scrolls out of view the bar below is stuck to top */}
      <div ref={stickySentinelRef} aria-hidden className="h-px w-full" />

      <div
        className={cn(
          "sticky",
          "top-0",
          "z-40",
          "bg-dark",
          "flex",
          "items-center",
          "gap-[2rem]",
          "w-full",
          "py-3",
          "border-b",
          "border-white/10",
          "shadow-lg",
          "shadow-black/20",
          "transition-[padding]",
          "duration-300",
          "ease-out",
          // Slide the search right of the resume corner badge once stuck (mobile only)
          stuck && isMobile ? "pl-20" : "pl-5",
        )}
      >
        <Search
          ref={inputRef}
          onChange={filterProjectsBySearch}
          clearInput={clearInput}
          onClick={() => openSearch()}
          isFocused={focused}
        />

        <ProjectCategories
          selected={selected}
          filterProjects={filterProjects}
          categories={categories}
        />
      </div>

      <div
        ref={container}
        className={cn(
          "max-w-[1400px]",
          "w-full",
          "flex",
          "flex-col",
          "items-center",
          "justify-center",
          "mb-8",
        )}
      >
        {filteredProjects.map((proj, i) => {
          return (
            <PortfolioItem
              index={i}
              projectId={proj.video_key}
              {...proj}
              // Hover on a row drives the shared cursor modal (desktop only).
              manageModal={canHover ? manageModal : undefined}
              key={i}
            />
          );
        })}

        {filteredProjects.length === 0 && filteredRepos.length === 0 && (
          <div
            className={cn(
              "flex",
              "flex-col",
              "items-center",
              "justify-center",
              "gap-3",
              "py-40",
              "px-6",
              "text-center",
            )}
          >
            <p className="text-3xl font-semibold text-dark">Nothing found</p>
            <p className="text-dark/60">
              {isSearching ? (
                <>No projects or repos match &ldquo;{searchText}&rdquo;.</>
              ) : (
                <>No projects match the selected filter.</>
              )}
            </p>
          </div>
        )}

        {filteredRepos.length > 0 && (
          <div
            ref={reposRef}
            className={cn(
              "w-full",
              "overflow-hidden",
              "pt-52",
              "scroll-mt-28",
              "lg:-mt-10",
            )}
          >
            <div className="relative mx-auto flex max-w-6xl flex-col justify-center gap-y-6 px-8">
              <PageTitle
                once
                backgroundColor="transparent"
                title="Misc repos."
                className="text-left whitespace-nowrap"
                containerClass={cn("p-0 m-0")}
              />
              <p>A few smaller projects fetched from github</p>
            </div>

            {/* Repo cards */}
            <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 px-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRepos.map((repo) => (
                <LatestRepo {...repo} key={repo.name} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GitHub contributions heatmap — the last section on the page. Renders
          nothing when there's no contribution data (e.g. no token). */}
      <GithubContributions
        data={contributions}
        username={githubUsername}
      />

      {/* Cursor-following card + dot + "View" label — pointer devices only, so
          it never renders on touch screens. Shows the hovered project's poster;
          the modal slider picks the item by `index` from filteredProjects. */}
      {canHover && (
        <CursorModal
          projects={filteredProjects}
          active={modal.active}
          index={modal.index}
          modalContainer={modalContainer}
          cursor={cursor}
          cursorLabel={cursorLabel}
        />
      )}
    </section>
  );
}
