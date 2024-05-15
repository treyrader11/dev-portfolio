// "use client";

// import { motion } from "framer-motion";
// import { scaleAnimation } from "./anim";
// import { useImperativeHandle, forwardRef, useRef } from "react";
// import { projects } from "../../projects.data";
// import { cn } from "@/lib/utils";
// import Image from "next/image";

// const imageProps = {
//   className: "size-auto",
//   alt: "image of project",
//   width: 300,
//   height: 0,
// };

// // function Modal({ className, isActive, index }, ref) {
//   const container = useRef(null);
//   const cursor = useRef(null);
//   const cursorLabel = useRef(null);

//   // useImperativeHandle(ref, () => ({
//   //   container,
//   //   cursor,
//   //   cursorLabel,
//   // }));

//   useImperativeHandle(ref, () => ({
//     container: container.current,
//     cursor: cursor.current,
//     cursorLabel: cursorLabel.current,
//   }));

//   return (
//     <>
//       <motion.div
//         // ref={ref}
//         ref={container}
//         variants={scaleAnimation}
//         initial="initial"
//         animate={isActive ? "enter" : "closed"}
//         className={cn(
//           "h-[350px]",
//           "w-[400px]",
//           "fixed",
//           "top-1/2",
//           "left-1/2",
//           "bg-white",
//           "pointer-events-none",
//           "overflow-hidden",
//           "z-[3]",
//           className
//         )}
//       >
//         <div
//           style={{ top: index * -100 + "%" }}
//           className={cn(
//             "size-full",
//             "relative",
//             "transition-[top]",
//             "duration-500"
//           )}
//         >
//           {projects.map((project, index) => {
//             const { src, color } = project;
//             return (
//               <div
//                 className={cn(
//                   "size-full",
//                   "flex",
//                   "items-center",
//                   "justify-center"
//                 )}
//                 style={{ backgroundColor: color }}
//                 key={`modal_${index}`}
//               >
//                 <Image src={`/images/${src}`} {...imageProps} />
//               </div>
//             );
//           })}
//         </div>
//       </motion.div>
//       <motion.div
//         ref={cursor}
//         className={cn(
//           "size-20",
//           "rounded-[50%]",
//           "bg-secondary",
//           "text-white",
//           "fixed",
//           "z-[3]",
//           "flex",
//           "items-center",
//           "justify-center",
//           "text-sm",
//           "font-light",
//           "pointer-events-none"
//         )}
//         variants={scaleAnimation}
//         initial="initial"
//         animate={isActive ? "enter" : "closed"}
//       ></motion.div>
//       <motion.div
//         ref={cursorLabel}
//         className={cn(
//           "size-20",
//           "rounded-[50%]",
//           "bg-transparent",
//           "text-white",
//           "fixed",
//           "z-[3]",
//           "flex",
//           "items-center",
//           "justify-center",
//           "text-sm",
//           "font-light",
//           "pointer-events-none"
//         )}
//         variants={scaleAnimation}
//         initial="initial"
//         animate={isActive ? "enter" : "closed"}
//       >
//         View
//       </motion.div>
//     </>
//   );
// }

// export default forwardRef(Modal);
