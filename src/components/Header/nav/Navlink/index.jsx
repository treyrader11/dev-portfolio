// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";
// import { scale, slide } from "../../anim";
// import { cn } from "@/lib/utils";

// export default function Navlink({
//   data,
//   isActive,
//   setSelectedIndicator,
//   className,
// }) {
//   const { label, href, index } = data;

//   return (
//     <motion.div
//       className={cn("relative flex items-center", className)}
//       onMouseEnter={() => {
//         setSelectedIndicator(href);
//       }}
//       custom={index}
//       variants={slide}
//       initial="initial"
//       animate="enter"
//       exit="exit"
//     >
//       <motion.div
//         variants={scale}
//         animate={isActive ? "open" : "closed"}
//         className={cn(
//           "size-2.5",
//           "bg-white",
//           "rounded-full",
//           "absolute",
//           "-left-[30px]"
//         )}
//       />
//       <Link href={href}>{label}</Link>
//     </motion.div>
//   );
// }

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { scale, slide } from "../../anim";
import { cn } from "@/lib/utils";

export default function Navlink({
  data,
  isActive,
  setSelectedIndicator,
  className,
}) {
  const { label, href, index } = data;

  return (
    <motion.div
      className={cn("relative flex items-center", className)}
      onMouseEnter={() => {
        setSelectedIndicator(href);
      }}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.div
        variants={scale}
        animate={isActive ? "open" : "closed"}
        className={cn(
          "size-2.5",
          "bg-white",
          "rounded-full",
          "absolute",
          "-left-[30px]"
        )}
      />
      <Link href={href}>{label}</Link>
    </motion.div>
  );
}
