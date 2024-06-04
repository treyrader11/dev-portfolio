// "use client";

// import { projectsData } from "@/lib/data";
// import { cn, getUnique } from "@/lib/utils";
// import { useRef, useState } from "react";
// import gsap from "gsap";
// import PortfolioItem from "./PortfolioItem";
// import PageTitle from "@/components/PageTitle";

// export default function Portfolio() {
//   const [projects, setProjects] = useState(projectsData);
//   const [categories] = useState([
//     "All",
//     ...getUnique(projectsData, "category"),
//   ]);
//   const [active, setActive] = useState(0);

//   const projCon = useRef();

//   const activeCategory = (index) => setActive(index);

//   const filterProjects = (category, index) => {
//     if (category === "All") {
//       gsap.to(projCon.current, {
//         duration: 0.5,
//         opacity: 0,
//         y: 20,
//         ease: "power4.out",
//         onComplete: () => {
//           gsap.fromTo(
//             projCon.current,
//             {
//               y: 20,
//               opacity: 0,
//               scale: 0,
//             },
//             {
//               duration: 0.5,
//               y: 20,
//               opacity: 1,
//               scale: 1,
//               ease: "power4.out",
//             }
//           );
//           setProjects(projectsData);
//         },
//       });
//       activeCategory(index);
//       return;
//     }

//     const filtered = projectsData.filter((port) => port.category === category);

//     activeCategory(index);
//     gsap.to(projCon.current, {
//       duration: 0.5,
//       opacity: 0,
//       y: 25,
//       ease: "power4.out",
//       onComplete: () => {
//         gsap.to(projCon.current, {
//           duration: 0.5,
//           y: 20,
//           opacity: 1,
//           ease: "power4.out",
//         });
//         setProjects(filtered);
//       },
//     });
//   };

//   return (
//     <section>
//       <PageTitle title="Portfolio." />
//       <div className={cn("pt-12", "mx-0", "px-6", "bg-dark")}>
//         <p className="text-white">
//           Following projects showcase my skills and experience through
//           real-world examples of my work. Each project is briefly described with
//           links to code repositories and live demos in it. It reflects my
//           ability to solve complex problems, work with different technologies,
//           and manage projects effectively.
//         </p>
//         <div
//           className={cn(
//             "mt-8",
//             "pt-3",
//             "px-6",
//             "flex",
//             "items-center",
//             "gap-[1.5rem]"
//           )}
//         >
//           {categories.map((categ, index) => {
//             const activeClass = cn(
//               { active },
//               "relative",
//               "after:absolute",
//               "after:block",
//               "after:h-[2px]",
//               "after:w-full",
//               "after:bg-purple-500",
//               "text-purple-500",
//               "after:transition-[transform,opacity]",
//               "[&:not(.active)]:after:translate-y-2",
//               "[&:not(.active)]:after:opacity-0",
//               "hover:[&:not(.active)]:after:translate-y-0",
//               "hover:[&:not(.active)]:after:opacity-100"
//             );
//             return (
//               <button
//                 key={index}
//                 onClick={() => filterProjects(categ, index)}
//                 className={cn(
//                   "inline-block",
//                   "font-semibold",
//                   "text-white",
//                   "border-none",
//                   "outline-none",
//                   "cursor-pointer",
//                   "relative",
//                   "transition-all",
//                   "duration-300",
//                   "ease-in-out",
//                   active === index ? activeClass : ""
//                 )}
//               >
//                 {categ}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Grid starts here */}
//       <div className="px-10 sm:px-20 bg-dark">
//         <div
//           ref={projCon}
//           className={cn(
//             "grid",
//             "max-w-6xl",
//             "grid-cols-1",
//             "gap-8",
//             "py-20",
//             "pb-40",
//             "mx-auto",
//             "md:grid-cols-2"
//           )}
//         >
//           {projects.map((project, index) => (
//             <PortfolioItem key={`${project.video_key}_${index}`} {...project} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { projectsData } from "@/lib/data";
import { cn, getUnique } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import PortfolioItem from "./components/PortfolioItem";
import { motion } from "framer-motion";
import Image from "next/image";
import { scaleAnimation } from "./anim";
import ProjectCategories from "./components/ProjectCategories";
import Search from "./components/Search";
import Video from "../Video";

export default function Portfolio() {
  const [projects, setProjects] = useState(projectsData);
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [focused, setFocused] = useState(false);

  const [categories] = useState([
    "All",
    ...getUnique(projectsData, "category"),
  ]);

  const inputRef = useRef(null);

  const [selected, setSelected] = useState(0);
  const [modal, setModal] = useState({ isModalActive: false, index: 0 });
  const { isModalActive, index } = modal;

  const projContainer = useRef();
  const modalContainer = useRef(null);
  const cursor = useRef(null);
  const cursorLabel = useRef(null);

  const selectedCategory = (index) => setSelected(index);

  const filterProjects = (category, index) => {
    if (category === "All") {
      gsap.to(projContainer.current, {
        duration: 0.5,
        opacity: 0,
        y: 20,
        ease: "power4.out",
        onComplete: () => {
          gsap.fromTo(
            projContainer.current,
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
    gsap.to(projContainer.current, {
      duration: 0.5,
      opacity: 0,
      y: 25,
      ease: "power4.out",
      onComplete: () => {
        gsap.to(projContainer.current, {
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
      onMouseMove={(e) => {
        moveItems(e.clientX, e.clientY);
      }}
      className="pb-[100px]"
    >
      {/* <BlurredIn once> */}
      <div>
        <div className={cn("py-12 mx-0 bg-dark")}>
          <p className="px-6 text-white">
            The following projects showcase my skills and experience through
            real-world examples of my work. Each project is briefly described
            with links to code repositories and live demos in it. It reflects my
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
              className=""
            />

            <ProjectCategories
              selected={selected}
              filterProjects={filterProjects}
              categories={categories}
              className={cn("")}
            />
          </div>
        </div>
      </div>
      {/* </BlurredIn> */}

      {/* <CardFlip /> */}
      <div
        ref={projContainer}
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
        {/* <Video cover src={`/videos/code-editor1.mp4`} muted loop autoPlay /> */}

        {filteredProjects.map((proj, i) => {
          return (
            <PortfolioItem
              index={i}
              projectId={proj.video_key}
              {...proj}
              manageModal={manageModal}
              key={i}
            />
          );
        })}
      </div>

      <>
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
      </>
    </section>
  );
}
