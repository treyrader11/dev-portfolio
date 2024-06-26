"use client";

import { projectsData } from "@/lib/data";
import { cn, getUnique } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
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
import LatestRepo from "./components/LatestRepo";
import PageTitle from "../PageTitle";

export default function Portfolio({ repositories }) {
  const [latestRepos, setLatestRepos] = useState(repositories);
  const [projects, setProjects] = useState(projectsData);
  const [filteredProjects, setFilteredProjects] = useState(projects);

  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState(0);

  const [isInView, setIsInView] = useState(false);

  const [categories] = useState([
    "All",
    ...getUnique(projectsData, "category"),
  ]);

  const { scrollY } = useScroll();

  const inputRef = useRef(null);
  const container = useRef(null);
  const modalRef = useRef(null);

  // useIsInView(container.current, modalRef.current);

  const isElementInView = useIsInView(
    container?.current,
    modalRef?.current,
    100
  );

  const selectedCategory = (index) => setSelected(index);

  const filterProjects = (category, index) => {
    if (category === "All") {
      gsap.to(container.current, {
        duration: 0.5,
        opacity: 0,
        y: 20,
        ease: "power4.out",
        onComplete: () => {
          gsap.fromTo(
            container.current,
            {
              y: 20,
              opacity: 0,
              scale: 0,
            },
            {
              duration: 0.5,
              y: 20,
              opacity: 1,
              scale: 1,
              ease: "power4.out",
            }
          );
          setProjects(projectsData);
        },
      });
      selectedCategory(index);
      return;
    }

    const filtered = projectsData.filter((proj) => proj.category === category);

    selectedCategory(index);
    gsap.to(container.current, {
      duration: 0.5,
      opacity: 0,
      y: 25,
      ease: "power4.out",
      onComplete: () => {
        gsap.to(container.current, {
          duration: 0.5,
          y: 20,
          opacity: 1,
          ease: "power4.out",
        });
        setProjects(filtered);
      },
    });
  };

  const clearInput = () => {
    inputRef.current.value = "";
    setFilteredProjects(projectsData);
  };

  const openSearch = () => {
    setFocused((prev) => !prev);
    if (!focused) {
      inputRef.current.focus();
    }
    if (focused) {
      clearInput();
    }
  };

  const filterProjectsBySearch = (text) => {
    const filtered = projects.filter((proj) =>
      proj.tags.some((tag) => tag.toLowerCase().includes(text.toLowerCase()))
    );

    setFilteredProjects(filtered);
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

  const mouseMove = (e) => {
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

  useEffect(() => {
    if (scrollYProgress.prev > 20 && scrollYProgress.prev < 300) {
      setIsInView(true);
    } else {
      setIsInView(false);
    }
  }, [scrollYProgress.prev]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsInView(latest > 200);
  });

  return (
    <section onMouseMove={mouseMove} className="pb-[100px]">
      <div className={cn("py-12 mx-0 bg-dark")}>
        <p className="px-6 text-white">
          The following projects showcase my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </p>
        <div
          className={cn(
            "mt-8",
            "pt-3",
            "flex",
            "relative",
            "items-center",
            "gap-[2rem]",
            "w-full",
            "pl-5"
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
          "mb-[100px]"
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

        {/* <div className="flex flex-col justify-center gap-y-6">
          <PageTitle
            backgroundColor="transparent"
            title="Misc repos."
            className="text-left whitespace-nowrap"
            containerClass={cn("p-0 m-0")}
          />
          <p>A few smaller projects fetched from github</p>
        </div> */}
        <div
          className={cn(
            "pt-52",
            "grid",
            "max-w-6xl",
            "grid-cols-1",
            "gap-8",
            "px-10",
            "mx-auto",
            "md:grid-cols-2",
            "lg:grid-cols-3",
            "lg:-mt-10",
            "gap-y-20"
          )}
        >
          <div className="relative flex flex-col justify-center gap-y-6">
            <PageTitle
              backgroundColor="transparent"
              title="Misc repos."
              className="text-left whitespace-nowrap"
              containerClass={cn("p-0 m-0")}
            />
            <p>A few smaller projects fetched from github</p>
          </div>

          {/* Single github Repo */}
          {latestRepos &&
            latestRepos.map((repo) => <LatestRepo {...repo} key={repo.name} />)}
        </div>
      </div>

      {/* <MouseoverModal data={projectsData} /> */}
      {/* <Modal ref={modalContainer}></Modal> */}
      {/* <>
      
        <motion.div
          ref={modalContainer}
          variants={scaleAnimation}
          initial="initial"
          animate={isModalActive ? "enter" : "closed"}
          className={cn(
            "h-[30vh]",
            "w-[50vw]",
            "md:w-[36vw]",
            // "h-[350px]", // original
            // "w-[400px]", // original
            "fixed",
            "top-1/2",
            "left-1/2",
            "bg-white",
            "pointer-events-none",
            "overflow-hidden",
            "z-[3]"
          )}
        >
          <div
            style={{ top: index * -100 + "%" }}
            className={cn(
              "size-full",
              "relative",
              "transition-[top]",
              "duration-500"
            )}
          >
            {projectsData.map((project, index) => {
              const { project_image, video_key, color } = project;
              return (
                <div
                  className={cn(
                    "size-full",
                    "flex",
                    "items-center",
                    "justify-center"
                  )}
                  style={{ backgroundColor: color }}
                  key={`modal_${index}`}
                >
                  
                  <Video src={`/videos/tech-meeting.mp4`} muted loop autoPlay />
                </div>
              );
            })}
          </div>
        </motion.div>
        <motion.div
          ref={cursor}
          className={cn(
            "size-20",
            "rounded-full",
            "bg-purple-500",
            "text-white",
            "fixed",
            "z-[3]",
            "flex",
            "items-center",
            "justify-center",
            "text-sm",
            "font-light",
            "pointer-events-none"
          )}
          variants={scaleAnimation}
          initial="initial"
          animate={isModalActive ? "enter" : "closed"}
        />
        <motion.div
          ref={cursorLabel}
          className={cn(
            "size-20",
            "rounded-full",
            "bg-transparent",
            "text-white",
            "fixed",
            "z-[3]",
            "flex",
            "items-center",
            "justify-center",
            "text-sm",
            "font-light",
            "pointer-events-none"
          )}
          variants={scaleAnimation}
          initial="initial"
          animate={isModalActive ? "enter" : "closed"}
          onClick={() => router.push(`/project/${video_key}`)}
        >
          View
        </motion.div>
      </> */}
    </section>
  );
}
