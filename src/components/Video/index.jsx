"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export default function Video({
  className,
  sticky = false,
  src,
  muted = false,
  loop = false,
  controls = false,
  cover = false,
  fill = false,
  isRounded = false,
  isPlaying = true,
  style,
  ...props
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play();
    }
  }, [isPlaying]);
  return (
    <div
      className={cn("mx-auto", { "sticky top-0": sticky }, className)}
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      <video
        ref={videoRef}
        className={cn(
          "h-full",
          { "rounded-2xl": isRounded },
          "object-contain",
          {
            "object-cover": cover,
            "object-fill": fill,
          }
        )}
        controls={controls}
        playsInline
        src={src}
        muted={muted}
        loop={loop}
        controlsList="nodownload"
        autoPlay
        {...props}
      />
    </div>
  );
}
