import WobbleContainer from "@/components/WobbleContainer";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { MotionStyle } from "framer-motion";

interface Props {
  className?: string;
  style?: MotionStyle;
}

export function Portrait({ className, style }: Props) {
  return (
    <WobbleContainer
      style={style}
      containerClassName={cn(
        "rounded-none",
        "bg-transparent",
        "w-full",
        "max-w-[25vh]",
        "md:max-w-full",
        "h-[60vh]",
        "mr-4",
        className
      )}
    >
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
        sizes="100vw"
      />
    </WobbleContainer>
  );
}
