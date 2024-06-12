"use client";

import { userData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { BsDownload } from "react-icons/bs";

const { resumeUrl } = userData;

// export default function ViewResume({ isActive, className }) {
//   return (
//     <div className={cn("cursor-pointer group", className)}>
//       {/* ::Before #penlink */}
//       <div
//         style={{
//           background:
//             "linear-gradient(to right, #08350e 0%, #08350e 100%), linear-gradient(to top, #08350e 50%, transparent 50%), linear-gradient(to top, #08350e 50%, transparent 50%), linear-gradient(to right, #08350e 0%, #08350e 100%), linear-gradient(to left, #08350e 0%, #08350e 100%)",
//           //   backgroundSize: "100% 2px, 2px 200%, 2px 200%, 0% 2px, 0% 2px",
//         }}
//         className={cn(
//           "absolute",
//           "size-[calc(100%+4px)]",
//           "top-[calc(2px-1)]",
//           "top-[calc(2px-1)]",
//           "[background-position:50%_100%,0%_0%,100%_0%,100%_0%,0%_0%]",
//           "bg-no-repeat",
//           "transition-[transform,background-position,background-size,box-shadow]",
//           "ease-in-out",
//           "duration-200",
//           "group-hover:scale-x-0",
//           "group-hover:rotate-0",
//           "[background-size:100%_2px,2px_200%,2px_200%,0%_2px,0%_2px]",
//           "group-hover:[background-size:200%_2px,2px_400%,2px_400%,55%_2px,55%_2px]",
//           "group-hover:[transition-delay:0.4s,0.2s,0s,0.6s]"
//         )}
//       />
//       <a
//         className={cn(
//           "absolute",
//           "-bottom-2.5",
//           "decoration-clone",
//           "text-purple-400",
//           //   "font-[900]",
//           "text-base",
//           "transition-colors",
//           "ease-[cubic-bezier(0.175,0.885,0.32,1.275)]",
//           "delay-200",
//           "tracking-[-2px]",
//           "py-2.5",
//           "px-[15px]",
//           "z-[9]",
//           "origin-[50%_12.5vh]",
//           "rotate-180",
//           "group-hover:text-secondary",
//           "flex"
//         )}
//         id="penlink"
//         target="_blank"
//       >
//         <strong className={cn("relative", "z-[9]")}>
//           View the Code{" "}
//           <span
//             className={cn(
//               "animate-back-n-forth",
//               "[animation-play-state:paused]"
//               //   "ease-in-out",
//               //   "duration-500"
//             )}
//           >
//             &rarr;
//           </span>
//         </strong>
//       </a>
//       {/* ::After #penlink */}
//       <div
//         style={{
//           background:
//             "linear-gradient(to bottom, #fe4e01 50%, #a58725 50%) 50% 100%/100% 200% no-repeat",
//         }}
//         className={cn(
//           "z-[-5]",
//           "absolute",
//           "size-full",
//           "z-[-1]",
//           //   "bg-gradient-to-b",
//           //   "from-purple-400",
//           //   "to-secondary",
//           "left-0",
//           "top-0",
//           "scale-y-0",
//           "origin-bottom",
//           "transition-[transform,background-position]",
//           "ease-in-out",
//           "duration-200",
//           "group-hover:scale-y-100",
//           "group-hover:origin-top",
//           "group-hover:[background-position:50%_0%]"
//         )}
//       />
//     </div>
//   );
// }

function ViewResume({ isActive, className }, ref) {
  return (
    <a
      href={resumeUrl}
      ref={ref}
      className={cn(
        "cursor-pointer",
        "group",
        "absolute",
        "-bottom-2.5",
        "text-purple-400",
        "text-xl",
        "transition-colors",
        "ease-[cubic-bezier(0.175,0.885,0.32,1.275)]",
        "delay-200",
        // "tracking-[-2px]",
        "py-2.5",
        "px-[15px]",
        "z-[9]",
        "origin-[50%_12.5vh]",
        "rotate-180",
        "hover:text-white",
        "flex",
        // "active",
        "whitespace-nowrap",
        "items-center",
        "justify-center",
        isActive &&
          cn(
            "rotate-0",
            "delay-[0.3s,2s]"
            // "before:scale-x-0",
            // "before:rotate-0",
            // "before:[background-size:200%_2px,2px_400%,2px_400%,55%_2px,55%_2px]",
            // "before:[transition-delay:0.4s,0.2s,0s,0.6s]",
            // "after:scale-y-100",
            // "after:origin-top",
            // "after:[background-position:50%_0%]"
          ),

        className
      )}
      id="resume"
      target="_blank"
    >
      <div
        style={{
          background:
            "linear-gradient(to right, purple 0%, purple 100%), linear-gradient(to top, purple 50%, transparent 50%), linear-gradient(to top, purple 50%, transparent 50%), linear-gradient(to right, purple 0%, purple 100%), linear-gradient(to left, #08350e 0%, #08350e 100%)",
          //   backgroundSize: "100% 2px, 2px 200%, 2px 200%, 0% 2px, 0% 2px",
        }}
        className={cn(
          "absolute",
          //   "size-[calc(100%+4px)]",
          "w-[calc(100%+4px)]",
          "h-[calc(100%+4px)]",
          "top-[calc(2px/-1)]",
          "top-[calc(2px/-1)]",
          "[background-position:50%_100%,0%_0%,100%_0%,100%_0%,0%_0%]",
          "bg-no-repeat",
          "transition-[transform,background-position,background-size,box-shadow]",
          "ease-in-out",
          "duration-200",
          "scale-x-0",
          "rotate-0",
          "delay-[0.4s,0.2s,0s,0.6s]",
          // "[transform:scaleX(0)_rotate(0deg)]",
          "[background-size:100%_2px,2px_200%,2px_200%,0%_2px,0%_2px]"
          //   isActive &&
          //     cn(
          //       "[background-size:200%_2px,2px_400%,2px_400%,55%_2px,55%_2px]",
          //       "[transition-delay:0.4s,0.2s,0s,0.6s]"
          //     )
        )}
      />
      <p className={cn("relative z-[9] flex gap-3")}>
        Resume
        <BsDownload className="mt-2 text-xl animate-bounce" />
      </p>
      <div
        style={{
          background:
            "linear-gradient(to bottom, #fe4e01 50%, #934E00 50%) 50% 100%/100% 200% no-repeat",
        }}
        className={cn(
          "z-[-5]",
          "absolute",
          "size-full",
          "z-[-1]",
          //   "bg-gradient-to-b",
          //   "from-purple-400",
          //   "to-secondary",
          "left-0",
          "top-0",
          "scale-y-0",
          "origin-bottom",
          "transition-[transform,background-position]",
          "ease-in-out",
          "duration-200",
          isActive &&
            cn("scale-y-100", "origin-top", "[background-position:50%_0%]")
          //   "group-hover:scale-y-100",
          //   "group-hover:origin-top",
          //   "group-hover:[background-position:50%_0%]",
          //   "opacity-50"
        )}
      />
    </a>
  );
}

export default forwardRef(ViewResume);
