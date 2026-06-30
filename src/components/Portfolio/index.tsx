"use client";

import { projectsData } from "@/lib/data";
import { cn, getUnique } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import PortfolioItem from "./components/PortfolioItem";
import {
  motion,
  useSpring,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";
import { scaleAnimation } from "./anim";
import ProjectCategories from "./components/ProjectCategories";
import Search from "./components/Search";
import Video from "../Video";
import MouseoverModal from "../MouseoverModal";
import Modal from "./components/Modal";
import { useIsInView } from "@/hooks/useIsInView";
import { useIsMobile } from "@/hooks/useWindowDimensions";
import LatestRepo from "./components/LatestRepo";
import PageTitle from "../PageTitle";
import type { ProjectData } from "@/types/data";

interface Repository {
  name: string;
  description: string | null;
  clone_url: string;
}

interface Props {
  repositories: Repository[];
}

export default function Portfolio({ repositories }: Props) {
  const [latestRepos, setLatestRepos] = useState(repositories);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState(0);

  const [isInView, setIsInView] = useState(false);

  const [categories] = useState([
    "All",
    ...getUnique(projectsData, "category"),
  ]);

  // Derive filtered projects from both category and search
  const filteredProjects = projectsData.filter((proj) => {
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

  const spring = {
    stiffness: 150,
    damping: 15,
    mass: 0.1,
  };

  const mousePosition = {
    x: useSpring(0, spring),
    y: useSpring(0, spring),
  };

  const mouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const targetX = clientX - (window.innerWidth / 2) * 0.25;
    const targetY = clientY - (window.innerWidth / 2) * 0.3;
    mousePosition.x.set(targetX);
    mousePosition.y.set(targetY);
  };

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
    <section onMouseMove={mouseMove} className="pb-[100px]">
      <div className={cn("pt-12 pb-8 mx-0 bg-dark")}>
        <p className="px-6 text-white">
          The following projects showcase my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </p>
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
          stuck && isMobile ? "pl-24" : "pl-5",
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
          "mb-[100px]",
        )}
      >
        {filteredProjects.map((proj, i) => {
          return (
            <PortfolioItem
              index={i}
              projectId={proj.video_key}
              {...proj}
              isInView={isInView}
              // isInView={isElementInView}
              mousePosition={mousePosition}
              key={i}
              modalRef={modalRef}
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
              "pt-52",
              "scroll-mt-28",
              "grid",
              "max-w-6xl",
              "grid-cols-1",
              "gap-8",
              "px-10",
              "mx-auto",
              "md:grid-cols-2",
              "lg:grid-cols-3",
              "lg:-mt-10",
              "gap-y-20",
            )}
          >
            <div className="relative flex flex-col justify-center gap-y-6 md:col-span-2 lg:col-span-3">
              <PageTitle
                once
                backgroundColor="transparent"
                title="Misc repos."
                className="text-left whitespace-nowrap"
                containerClass={cn("p-0 m-0")}
              />
              <p>A few smaller projects fetched from github</p>
            </div>

            {/* Single github Repo */}
            {filteredRepos.map((repo) => (
              <LatestRepo {...repo} key={repo.name} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
