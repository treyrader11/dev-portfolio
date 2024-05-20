// "use client";

// import { projectsData } from "@/lib/data";
// import { cn, getUnique } from "@/lib/utils";
// import { useRef, useState } from "react";
// import gsap from "gsap";
// import PortfolioItem from "./components/PortfolioItem";
// import PageTitle from "@/common/PageTitle";

// // const activeClass =
// //   "text-purple-500 after:absolute after:left-0 after:bottom-[-5px] after:bg-purple-500 after:w-full after:h-[2px]";

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
      
//       {/* <PageTitle title="Portfolio." className="text-[20vh] mt-20" /> */}
//       {/* <PageTitle title="Portfolio." className="text-[10vh] sm:text-[20vh]" /> */}
//       <div
//         className={cn(
//           "mx-0",
//           // "pt-32",
//           // "px-6",
//           "bg-dark"
//         )}
//       >
//         <div className="w-full p-6 bg-slate-100">
//           <p className="font-semibold text-black">
//             The following projects showcase my skills and experience through
//             real-world examples of my work. Each project is briefly described
//             with links to code repositories and live demos in it. It reflects my
//             ability to solve complex problems, work with different technologies,
//             and manage projects effectively.
//           </p>
//         </div>
//         <div
//           className={cn(
//             "mt-8",
//             "pt-3",
//             "px-12",
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
import { useRef, useState } from "react";
import gsap from "gsap";
import PortfolioItem from "./PortfolioItem";
import PageTitle from "@/components/PageTitle";

// const activeClass =
//   "text-purple-500 after:absolute after:left-0 after:bottom-[-5px] after:bg-purple-500 after:w-full after:h-[2px]";

export default function Portfolio() {
  const [projects, setProjects] = useState(projectsData);
  const [categories] = useState([
    "All",
    ...getUnique(projectsData, "category"),
  ]);
  const [active, setActive] = useState(0);

  const projCon = useRef();

  const activeCategory = (index) => setActive(index);

  const filterProjects = (category, index) => {
    if (category === "All") {
      gsap.to(projCon.current, {
        duration: 0.5,
        opacity: 0,
        y: 20,
        ease: "power4.out",
        onComplete: () => {
          gsap.fromTo(
            projCon.current,
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
      activeCategory(index);
      return;
    }

    const filtered = projectsData.filter((port) => port.category === category);

    activeCategory(index);
    gsap.to(projCon.current, {
      duration: 0.5,
      opacity: 0,
      y: 25,
      ease: "power4.out",
      onComplete: () => {
        gsap.to(projCon.current, {
          duration: 0.5,
          y: 20,
          opacity: 1,
          ease: "power4.out",
        });
        setProjects(filtered);
      },
    });
  };

  return (
    <section>
      <PageTitle title="Portfolio." />
      <div
        className={cn(
          // "mt-8",
           "pt-3",
          "mx-0",
          "px-6",
          "bg-dark"
        )}
      >
        <p className="text-white">
          Following projects showcase my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </p>
        <div
          className={cn(
            "mt-8",
            "pt-3",
            // "mx-0",
            "px-6",
            "flex",
            "items-center",
            "gap-[1.5rem]",
            
          )}
        >
          {categories.map((categ, index) => {
            const activeClass = cn(
              { active },
              "relative",
              "after:absolute",
              "after:block",
              "after:h-[2px]",
              "after:w-full",
              "after:bg-purple-500",
              "text-purple-500",
              "after:transition-[transform,opacity]",
              "[&:not(.active)]:after:translate-y-2",
              "[&:not(.active)]:after:opacity-0",
              "hover:[&:not(.active)]:after:translate-y-0",
              "hover:[&:not(.active)]:after:opacity-100"
            );
            return (
              <button
                key={index}
                onClick={() => filterProjects(categ, index)}
                className={cn(
                  "inline-block",
                  "font-semibold",
                  "text-white",
                  "border-none",
                  "outline-none",
                  "cursor-pointer",
                  "relative",
                  "transition-all",
                  "duration-300",
                  "ease-in-out",
                  active === index ? activeClass : ""
                )}
              >
                {categ}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid starts here */}
      <div className="px-10 sm:px-20 bg-dark">
        <div
          ref={projCon}
          className={cn(
            "grid",
            "max-w-6xl",
            "grid-cols-1",
            "gap-8",
            "py-20",
            "pb-40",
            "mx-auto",
            "md:grid-cols-2"
          )}
        >
          {projects.map((project, index) => (
            <PortfolioItem key={`${project.video_key}_${index}`} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
