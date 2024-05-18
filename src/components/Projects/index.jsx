"use client";

import { useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import ProjectShot from "./components/ProjectShot";
import Rounded from "@/common/Rounded";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { scaleAnimation } from "./anim";
import Image from "next/image";
import gsap from "gsap";
import { useRouter } from "next/router";
import { projectsData } from "@/lib/data";
import Link from "next/link";

const imageProps = {
  className: "size-auto",
  alt: "image of project",
  // width: 300,
  width: 150,
  // height: 0,
  height: 0,
};

export default function Projects() {
  const [modal, setModal] = useState({ isActive: false, index: 0 });
  const { isActive, index } = modal;

  const container = useRef(null);
  const modalContainer = useRef(null);
  const cursor = useRef(null);
  const cursorLabel = useRef(null);

  let xMoveContainer = useRef(null);
  let yMoveContainer = useRef(null);
  let xMoveCursor = useRef(null);
  let yMoveCursor = useRef(null);
  let xMoveCursorLabel = useRef(null);
  let yMoveCursorLabel = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const router = useRouter();

  useEffect(() => {
    //Move Container
    xMoveContainer.current = gsap.quickTo(modalContainer.current, "left", {
      duration: 0.8,
      ease: "power3",
    });
    yMoveContainer.current = gsap.quickTo(modalContainer.current, "top", {
      duration: 0.8,
      ease: "power3",
    });
    //Move cursor
    xMoveCursor.current = gsap.quickTo(cursor.current, "left", {
      duration: 0.5,
      ease: "power3",
    });
    yMoveCursor.current = gsap.quickTo(cursor.current, "top", {
      duration: 0.5,
      ease: "power3",
    });
    //Move cursor label
    xMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "left", {
      duration: 0.45,
      ease: "power3",
    });
    yMoveCursorLabel.current = gsap.quickTo(cursorLabel.current, "top", {
      duration: 0.45,
      ease: "power3",
    });
  }, []);

  const moveItems = (x, y) => {
    xMoveContainer.current(x);
    yMoveContainer.current(y);
    xMoveCursor.current(x);
    yMoveCursor.current(y);
    xMoveCursorLabel.current(x);
    yMoveCursorLabel.current(y);
  };

  const manageModal = (isActive, index, x, y) => {
    // moveItems(x, y);
    setModal({ isActive, index });
  };

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });

  return (
    <>
      <section ref={container} className="relative z-[2] sm:px-2 px-0">
        {projectsData.map((project, index) => {
          const targetScale = 1 - (projectsData.length - index) * 0.05;
          return (
            <ProjectShot
              key={`p_${index}`}
              index={index}
              {...project}
              progress={scrollYProgress}
              range={[index * 0.25, 1]}
              targetScale={targetScale}
              manageModal={manageModal}
            />
          );
        })}

        <Rounded
          href="/portfolio"
          className={cn(
            "border-secondary",
            "rounded-full",
            "w-fit",
            "mx-auto",
            "py-6",
            "-top-40",
            "sm:top-0",
            "md:top-20",
            "lg:top-32"
          )}
        >
          <p
            className={cn(
              "relative",
              "z-[1]",
              "transition-colors",
              "duration-[400]",
              "ease-linear",
              "text-dark"
            )}
          >
            See all projects
          </p>
        </Rounded>
      </section>

      <motion.div
        ref={modalContainer}
        variants={scaleAnimation}
        initial="initial"
        animate={isActive ? "enter" : "closed"}
        className={cn(
          // "h-[350px]",
          // "w-[400px]",
          "h-[200px]",
          "w-[250px]",
          "fixed",
          // "top-1/2",
          // "left-1/2",
          // "top-3/4",
          // "left-2/3",
          "top-[83%]",
          "left-[73%]",
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
                <Image
                  priority={project.isPriority}
                  src={`/images/${project_image}`}
                  {...imageProps}
                />
              </div>
            );
          })}
        </div>
      </motion.div>
      <motion.div
        ref={cursor}
        className={cn(
          "size-20",
          "rounded-[50%]",
          "bg-secondary",
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
        animate={isActive ? "enter" : "closed"}
      />
      <motion.div
        ref={cursorLabel}
        className={cn(
          "size-20",
          "rounded-[50%]",
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
        animate={isActive ? "enter" : "closed"}
        onClick={() => router.push(`/project/${video_key}`)}
      >
        View
      </motion.div>
    </>
  );
}
