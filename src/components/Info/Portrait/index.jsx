"use client";

import WobbleContainer from "@/components/WobbleContainer";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Portrait({ className, style }) {
  return (
    <WobbleContainer
      style={style}
      containerClassName={cn(
        "rounded-none",
        "bg-transparent",
        "w-[25vh]",
        "h-[60vh]"
      )}
    >
      {/* <motion.div
        //   style={{ top: md }}
        // style={{ style }}
        className={cn(
          "relative",
          // "absolute",
          "right-0",
          "flex",
          "items-center",
          "w-[25vh]",
          "h-[40vh]",
          "md:h-[50vh]",
          className
        )}
      > */}
      <Image
        fill
        priority
        alt="Full profile picture"
        src={`/images/portraits/profile.png`}
        className={cn(
          "object-cover",
          "absolute",
          "z-[1]",
          "h-full",
          "object-cover"
        )}
        sizes={{}}
      />
      {/* </motion.div> */}
    </WobbleContainer>
  );
}
