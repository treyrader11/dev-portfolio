"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { projectsData } from "@/lib/data";
import gsap from "gsap";
import Image from "next/image";
import { scaleAnimation } from "../Portfolio/anim";
import Video from "../Video";
import ModalItem from "./components/ModalItem";

export default function MouseoverModal({
  children,
  data,
  className,
  containerClassName,
}) {
  const [modal, setModal] = useState({ isModalActive: false, index: 0 });
  const { isModalActive, index } = modal;

  const projContainer = useRef();
  const modalContainer = useRef(null);
  const cursor = useRef(null);
  const cursorLabel = useRef(null);

  let xMoveContainer = useRef(null);
  let yMoveContainer = useRef(null);
  let xMoveCursor = useRef(null);
  let yMoveCursor = useRef(null);
  let xMoveCursorLabel = useRef(null);
  let yMoveCursorLabel = useRef(null);

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
    const elements = [
      xMoveContainer,
      yMoveContainer,
      xMoveCursor,
      yMoveCursor,
      xMoveCursorLabel,
      yMoveCursorLabel,
    ];

    elements.forEach((element, index) => {
      if (element?.current) {
        if (index % 2 === 0) {
          element.current(x);
        } else {
          element.current(y);
        }
      }
    });
  };

  const manageModal = (isModalActive, index, x, y) => {
    moveItems(x, y);
    setModal({ isModalActive, index });
  };

  return (
    <section
      onMouseMove={(e) => moveItems(e.clientX, e.clientY)}
      className={cn("pb-[100px]", containerClassName)}
    >
      {children}
      {/* Modal */}
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
          "z-[3]",
          className
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
          {data.map((item, i) => {
            const { project_image, video_key, color } = item;
            return (
              <div
                className={cn(
                  "size-full",
                  "flex",
                  "items-center",
                  "justify-center"
                )}
                style={{ backgroundColor: color }}
                key={`modal_${i}`}
              >
                {/* <Image
                  src={`/images/${project_image}`}
                  width={300}
                  priority={project.isPriority}
                  height={0}
                  alt="image"
                  className="md:h-[24vh] md:w-[20vw] h-[20vh] w-[38vw]"
                /> */}
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
    </section>
  );
}
