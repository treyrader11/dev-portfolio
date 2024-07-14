"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAnimationControls, motion } from "framer-motion";
import { useEffect } from "react";

// css version

export default function ProfilePicture({
  src,
  className,
  isBordered = false,
  isBlob = false,
}) {
  const containerProps = {
    className: cn(
      "rounded-full",
      "overflow-hidden",
      "relative",
      "flex",
      { "border border-secondary": isBordered },
      className
    ),
  };

  const imageProps = {
    fill: true,
    priority: true,
    alt: "image",
    src,
    className: "object-cover",
    sizes: {},
  };

  const content = isBlob ? (
    <Image
      width={40}
      height={40}
      src={src}
      className={cn(
        "blob",
        // "animate-blob",
        // "size-[65px]",
        "object-cover",
        className
      )}
      alt="profile picture of Trey"
    />
  ) : (
    <div {...containerProps}>
      <Image alt="profile picture of Trey" {...imageProps} />
    </div>
  );

  return content;
}

// framer motion version

// export default function ProfilePicture({
//   src,
//   className,
//   isBordered = false,
//   isMagnetic = false,
//   isBlob = false,
// }) {
//   const controls = useAnimationControls();

//   useEffect(() => {
//     if (isBlob) {
//       controls.start({
//         borderRadius: [
//           "60% 40% 30% 70% / 60% 30% 70% 40%",
//           "30% 60% 70% 40% / 50% 60% 30% 60%",
//           "60% 40% 30% 70% / 60% 30% 70% 40%",
//         ],
//         transition: {
//           duration: 4,
//           ease: "easeInOut",
//           repeat: Infinity,
//           repeatType: "loop",
//         },
//       });
//     }
//   }, [controls, isBlob]);

//   const containerProps = {
//     className: cn(
//       "rounded-full",
//       "overflow-hidden",
//       "relative",
//       "flex",
//       { "border border-secondary": isBordered },
//       className
//     ),
//   };

//   const imageProps = {
//     fill: true,
//     priority: true,
//     alt: "profile picture of Trey",
//     src,
//     className: "object-cover",
//     sizes: {},
//   };

//   const content = isBlob ? (
//     <motion.div animate={controls} className="overflow-hidden">
//       <Image
//         width={50}
//         height={50}
//         src={src}
//         className="object-cover"
//         alt="profile picture of Trey"
//       />
//     </motion.div>
//   ) : (
//     <div {...containerProps}>
//       <Image {...imageProps} />
//     </div>
//   );

//   return content;
// }
