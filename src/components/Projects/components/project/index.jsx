// "use client";

// import Image from "next/image";
// import { useTransform, motion, useScroll } from "framer-motion";
// import { useRef } from "react";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import Card from "@/common/Card";
// import Carousel from "@/components/Carousel";

// const styles = {
//   container: cn(
//     "h-screen",
//     "flex",
//     "items-center",
//     "justify-center",
//     "sticky",
//     "top-0",
//     "max-w-[1080px]",
//     "mx-auto"
//   ),
//   h2: cn("text-[28px]", "m-0", "text-center"),
//   // body: cn("flex", "h-full", "mt-[50px]", "gap-[50px]"), <- original
//   body: cn("flex", "flex-col", "sm:flex-row", "h-full", "justify-between", ""),
//   // description: cn("relative", "w-[40%]", "top-[10%]", "custom-font-body"), <- original
//   description: cn(
//     "relative",
//     "w-[35%]",
//     "hidden",
//     "sm:flex",
//     "custom-font-body",
//     "overflow-clip"
//   ),
//   imageContainer: cn("relative", "w-full", "h-full", "rounded-3xl"),
//   inner: cn("w-full", "h-full"),
//   card: (isFolderShaped, beforeHeight) =>
//     cn(
//       "flex",
//       "flex-col",
//       "relative",
//       "h-[500px]",
//       "p-[50px]",
//       "w-full",
//       "origin-top",
//       "border-3",
//       "border-red-500",
//       isFolderShaped
//         ? cn(
//             "rounded-tr-3xl",
//             "rounded-b-3xl",
//             "before:relative",
//             `before:h-[${beforeHeight}px]`,
//             "before:w-1/2",
//             "before:rounded-t-3xl",
//             "before:bg-inherit",
//             `before:top-[-${beforeHeight}px]`,
//             "before:left-0"
//           )
//         : "rounded-3xl"
//     ),
// };

// export default function Project({
//   index,
//   title,
//   description,
//   src,
//   shots,
//   url,
//   color,
//   progress,
//   range,
//   targetScale,
//   isFolderShaped = false,
// }) {
//   const container = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: container,
//     offset: ["start end", "start start"],
//   });

//   const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
//   const scale = useTransform(progress, range, [1, targetScale]);

//   // const shotsWithScale = shots.map((shot) => ({
//   //   ...shot,
//   //   // scale: imageScale,
//   // }));

//   return (
//     <div
//       ref={container}
//       className={cn(
//         "h-screen",
//         "flex",
//         "items-center",
//         "justify-center",
//         "sticky",
//         "top-0",
//         "max-w-[1080px]",
//         "mx-auto"
//       )}
//     >
//       <motion.div
//         style={{
//           backgroundColor: color,
//           scale,
//           top: `calc(-5vh + ${index * 25}px)`,
//         }}
//         // className={cn(
//         //   isFolderShaped ? "folder-shape" : styles.card(isFolderShaped, 100)
//         // )}
//         className={cn(
//           isFolderShaped ? "folder-shape" : "flex",
//           "flex-col",
//           "relative",
//           "h-[500px]",
//           "p-[50px]",
//           "w-full",
//           "origin-top",
//           "border-3",
//           "border-red-500",
//           isFolderShaped
//             ? cn(
//                 "rounded-tr-3xl",
//                 "rounded-b-3xl",
//                 "before:relative",
//                 `before:h-[100px]`,
//                 "before:w-1/2",
//                 "before:rounded-t-3xl",
//                 "before:bg-inherit",
//                 `before:top-[100px]`,
//                 "before:left-0"
//               )
//             : "rounded-3xl"
//         )}
//       >
//         <h2 className={cn(styles.h2, "custom-font")}>{title}</h2>
//         <div className={styles.body}>
//           <div className={styles.description}>
//             <p className="text-[16px]">{description}</p>
//             <span className="flex items-center gap-[5px]">
//               <Link
//                 href={url || "#"}
//                 target="_blank"
//                 className="text-[12px] underline"
//               >
//                 See more
//               </Link>
//               <svg
//                 width="22"
//                 height="12"
//                 viewBox="0 0 22 12"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
//                   fill="black"
//                 />
//               </svg>
//             </span>
//           </div>

//           <div className={cn("relative", "w-full", "h-full", "rounded-3xl")}>
//             <motion.div
//               className={cn("w-full", "h-full")}
//               style={{ scale: imageScale }}
//             >
//               <Image
//                 fill
//                 src={`/shots/${src}`}
//                 alt="image"
//                 className="object-cover lg:object"
//                 sizes="(max-width: 900) 50vw" //figure this out
//               />
//             </motion.div>
//           </div>
//           {/* <Carousel items={[...shots, { scale: imageScale }]} /> */}
//           {/* <Carousel items={shots} /> */}
//           {/* {shots.map((shot, index) => (
//             <ProjectShot key={index} src={shot.src} />
//           ))} */}
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// export function ProjectShot({
//   src,
//   width = 350,
//   height = 350,
//   marginRight = 30,
// }) {
//   console.log("src", src);

//   return (
//     // <div
//     // className="border border-red-500 overflow-clip"
//     //   style={{
//     //     width,
//     //     // minWidth: width,
//     //     height,
//     //     marginRight,
//     //     // backgroundImage: `url(${imageUrl})`,
//     //     // backgroundPosition: "center",
//     //     // backgroundSize: "cover",
//     //   }}
//     // >
//     <div className={cn("w-[200px]")}>
//       <div
//         className="w-full border border-red-500 "
//         style={{
//           width,
//           height,
//           marginRight,
//         }}
//       >
//         {/* <motion.div className={ cn("w-full", "h-full")} style={{ scale }}> */}
//         <motion.div className={cn("w-full", "h-full")}>
//           <Image
//             fill
//             // width={500}
//             // height={500}
//             src={`/shots/${src}`}
//             alt="image"
//             className="object-cover lg:object"
//             sizes="(max-width: 900) 50vw"
//           />
//         </motion.div>
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { useTransform, motion, useScroll } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "@/common/Card";
import Carousel from "@/components/Carousel";

const styles = {
  container: cn(
    "h-screen",
    "flex",
    "items-center",
    "justify-center",
    "sticky",
    "top-0",
    "max-w-[1080px]",
    "mx-auto"
  ),
  h2: cn("text-[28px]", "m-0", "text-center"),
  // body: cn("flex", "h-full", "mt-[50px]", "gap-[50px]"), <- original
  body: cn("flex", "flex-col", "sm:flex-row", "h-full", "justify-between", ""),
  // description: cn("relative", "w-[40%]", "top-[10%]", "custom-font-body"), <- original
  description: cn(
    "relative",
    "w-[35%]",
    "hidden",
    "sm:flex",
    "custom-font-body",
    "overflow-clip"
  ),
  imageContainer: cn("relative", "w-full", "h-full", "rounded-3xl"),
  inner: cn("w-full", "h-full"),
  card: (isFolderShaped, beforeHeight) =>
    cn(
      "flex",
      "flex-col",
      "relative",
      "h-[500px]",
      "p-[50px]",
      "w-full",
      "origin-top",
      "border-3",
      "border-red-500",
      isFolderShaped
        ? cn(
            "rounded-tr-3xl",
            "rounded-b-3xl",
            "before:relative",
            `before:h-[${beforeHeight}px]`,
            "before:w-1/2",
            "before:rounded-t-3xl",
            "before:bg-inherit",
            `before:top-[-${beforeHeight}px]`,
            "before:left-0"
          )
        : "rounded-3xl"
    ),
};

export default function Project({
  index,
  title,
  description,
  src,
  url,
  color,
  progress,
  range,
  targetScale,
  isFolderShaped = false,
}) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      // style={{
      //   // backgroundColor: color,
      //   backgroundImage: `url(/shots/${src})`,
      //   scale,
      //   top: `calc(-5vh + ${index * 25}px)`,
      // }}
      style={{
        backgroundImage: `url(/shots/${src})`, // Set the image as background
        backgroundPosition: "center", // Center the background image
        backgroundSize: "cover", // Cover the entire container
        top: `calc(-5vh + ${index * 25}px)`,
      }}
      className={cn(
        "h-screen",
        "flex",
        "items-center",
        "justify-center",
        "sticky",
        "top-0",
        "max-w-[1080px]",
        "mx-auto"
      )}
    >
      <div
        //  ref={container}
        // style={{
        //   backgroundColor: color,
        //   scale,
        //   top: `calc(-5vh + ${index * 25}px)`,
        // }}
        className={cn(
          // "flex",
          // "flex-col",
          "relative",
          // "h-[500px]",
          "h-full",
          // "p-[50px]",
          "w-full"
          // "origin-top",
        )}
      >
        {/* <Image
          fill
          src={`/shots/${src}`}
          alt="image"
          className="object-cover"
          sizes="(max-width: 900) 50vw"
        /> */}
      </div>
      {/* <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${index * 25}px)`,
        }}
        className={cn(
          "flex",
          "flex-col",
          "relative",
          // "h-[500px]",
          "h-full",
          "p-[50px]",
          "w-full",
          "origin-top",
          "border-3",
          "border-red-500"
        )}
      >
        <Image
          fill
          src={`/shots/${src}`}
          alt="image"
          className="object-cover"
          sizes="(max-width: 900) 50vw"
        />
      </motion.div> */}
    </div>
  );
}

export function ProjectShot({
  src,
  width = 350,
  height = 350,
  marginRight = 30,
}) {
  console.log("src", src);

  return (
    // <div
    // className="border border-red-500 overflow-clip"
    //   style={{
    //     width,
    //     // minWidth: width,
    //     height,
    //     marginRight,
    //     // backgroundImage: `url(${imageUrl})`,
    //     // backgroundPosition: "center",
    //     // backgroundSize: "cover",
    //   }}
    // >
    <div className={cn("w-[200px]")}>
      <div
        className="w-full border border-red-500 "
        style={{
          width,
          height,
          marginRight,
        }}
      >
        {/* <motion.div className={ cn("w-full", "h-full")} style={{ scale }}> */}
        <motion.div className={cn("w-full", "h-full")}>
          <Image
            fill
            // width={500}
            // height={500}
            src={`/shots/${src}`}
            alt="image"
            className="object-cover lg:object"
            sizes="(max-width: 900) 50vw"
          />
        </motion.div>
      </div>
    </div>
  );
}
