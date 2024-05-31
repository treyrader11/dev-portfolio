// "use client";

// import { userData } from "@/lib/data";
// import { cn } from "@/lib/utils";
// import Experience from "./Experience";
// import Link from "next/link";
// import { useScroll, motion, useTransform } from "framer-motion";
// import { useRef } from "react";
// import TechStack from "./TechStack";
// import Socials from "./Socials";
// import Image from "next/image";

// import Picture1 from "/public/images/references/jason.png";
// import Picture2 from "/public/images/references/daniel.png";
// import Picture3 from "/public/images/references/janine.png";

// const socials = [
//   { name: "Youtube", href: userData.socialLinks.youtube },
//   { name: "GitHub", href: userData.socialLinks.github },
//   { name: "LinkedIn", href: userData.socialLinks.linkedin },
//   { name: "Instagram", href: userData.socialLinks.instagram },
// ];

// const word = userData.about.title;

// export default function Info() {
//   const container = useRef();

//   const { scrollYProgress } = useScroll({
//     target: container,
//     offset: ["start start", "end end"],
//   });

//   const sm = useTransform(scrollYProgress, [0, 1], [0, -50]);
//   const md = useTransform(scrollYProgress, [0, 1], [0, -150]);
//   const lg = useTransform(scrollYProgress, [0, 1], [0, -250]);

//   const images = [
//     {
//       src: Picture1,
//       y: 0,
//     },
//     {
//       src: Picture2,
//       y: lg,
//     },
//     {
//       src: Picture3,
//       y: md,
//     },
//   ];

//   return (
//     <section
//       ref={container}
//       className={cn(
//         "bg-[#F1F1F1]",
//         "w-ful",
//         "pb-40",
//         "min-h-screen",
//         "text-gray-500"
//       )}
//     >
//       <motion.div className={cn("pt-[10vh]", "")}>
//         {/* Experiemnting */}
//         <div className={cn("ml-[10vw]")}>
//           <motion.h1
//             className={cn(
//               "m-0",
//               "mt-2.5",
//               "text-[5vw]",
//               "leading-[5vw]",
//               "text-gray-700"
//             )}
//             style={{ y: sm }}
//           >
//             Hi there
//           </motion.h1>

//           <div>
//             <p className="m-0 mt-2.5 text-[3vw] uppercase">
//               {word.split("").map((letter, i) => {
//                 const y = useTransform(
//                   scrollYProgress,
//                   [0, 1],
//                   [0, Math.floor(Math.random() * -75) - 25]
//                 );
//                 return (
//                   <motion.span
//                     className="relative"
//                     style={{ top: y }}
//                     key={`l_${i}`}
//                   >
//                     {letter}
//                   </motion.span>
//                 );
//               })}
//             </p>
//           </div>
//         </div>
//         <div
//           className={cn(
//             "flex",
//             "w-full",
//             "justify-center",
//             "relative",
//             "mt-[5vh]"
//           )}
//         >
//           {images.map(({ src, y }, i) => {
//             return (
//               <motion.div
//                 style={{ y }}
//                 key={`i_${i}`}
//                 className={"absolute h-[300px]"}
//               >
//                 <Image
//                   src={src}
//                   placeholder="blur"
//                   className={cn("object-cover", {
//                     "h-[60vh] w-[50vh] z-[1]": i === 0,
//                     "left-[55vw] top-[15vh] h-[40vh] w-[30vh] z-[2]": i === 1,
//                     "left-[27.5vw] top-[40vh] h-[25vh] w-[20vh] z-[3]": i === 2,
//                   })}
//                   alt="image"
//                   fill
//                   sizes={{}}
//                 />
//               </motion.div>
//             );
//           })}
//         </div>
//         {/* Experiemnting end */}

//         <div className="px-4 md:w-[800px] mx-auto">
//           <div
//             className={cn(
//               "grid",
//               "max-w-6xl",
//               "grid-cols-1",
//               "pt-20",
//               "mx-auto",
//               "md:grid-cols-3",
//               "gap-20",
//               "w-full"
//             )}
//           >
//             {/* Social Buttons */}
//             <div className="inline-flex flex-col">
//               <div>
//                 <h1 className={cn("text-xl", "font-semibold", "text-gray-700")}>
//                   Contact
//                 </h1>
//                 <p className={cn("mt-4 text-lg text-gray-500")}>
//                   For any sort of help / enquiry, please shoot me an{" "}
//                   <Link
//                     // href={`mailto:${userData.email}`}
//                     href="/contact"
//                     className={cn(
//                       "font-bold",
//                       "text-gray-800",
//                       "border-b-2",
//                       "border-gray-800"
//                     )}
//                   >
//                     email
//                   </Link>{" "}
//                   and I&apos;ll get back the same day.
//                 </p>
//               </div>
//               <div className="mt-8">
//                 <h1 className="text-xl font-semibold text-gray-700">
//                   Job Opportunities
//                 </h1>
//                 <p className="relative mt-4 text-lg text-gray-500">
//                   I&apos;m looking for a job currently. If you see me as a good
//                   fit, please have a look at my{" "}
//                   <span>
//                     <a
//                       href={userData.resumeUrl}
//                       target="__blank"
//                       className={cn(
//                         "font-bold",
//                         "text-gray-800",
//                         "border-b-2",
//                         "border-gray-800"
//                       )}
//                     >
//                       CV
//                     </a>{" "}
//                   </span>
//                   and I&apos;d love to see what y&lsquo;all do!
//                 </p>
//               </div>
//             </div>

//             {/* Text area */}
//             <div className="col-span-1 md:col-span-2">
//               {userData.about.description?.map((desc, idx) => (
//                 <p key={idx} className="mb-4 text-xl text-gray-700">
//                   {desc}
//                 </p>
//               ))}
//             </div>
//           </div>
//           <div
//             className={cn(
//               // "space-y-20",
//               "pt-20",
//               "relative",
//               "grid-cols-2",
//               // "mx-8",
//               "grid",
//               "gap-x-5"
//             )}
//           >
//             <Socials links={socials} className="w-full relative z-[1] " />
//             <Portrait />
//           </div>
//         </div>

//         <div className="w-full pt-40 sm:pt-20">
//           <TechStack className="w-full " />
//         </div>

//         {/* <TextSlider text="TeckStack" /> */}
//       </motion.div>

//       <Experience scrollYProgress={scrollYProgress} />
//     </section>
//   );
// }

// export function Portrait({ className }) {
//   return (
//     <div
//       className={cn(
//         "relative",
//         "flex",
//         "items-center",
//         "h-[40vh]",
//         "md:h-[50vh]",
//         className
//       )}
//     >
//       <Image
//         fill
//         priority
//         alt="Full profile picture"
//         src={`/images/portraits/profile.png`}
//         // className="object-contain rounded-lg" old classes
//         className={cn(
//           "md:object-contain",
//           "object-cover",
//           // "border border-double"
//         )}
//         sizes={{}}
//       />
//     </div>
//   );
// }
