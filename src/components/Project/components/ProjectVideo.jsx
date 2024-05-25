"use client";

import Spinner from "@/components/Spoinner";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function ProjectVideo({ src }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("w-full mt-[5px]")}>
      {isLoading ? (
        <div
          className={cn(
            "pt-[56.25%]",
            "relative",
            "grid",
            "place-items-center"
          )}
        >
          <Spinner />
        </div>
      ) : (
        <div
          className={cn(
            "relative",
            "overflow-hidden",
            "w-full",
            "justify-center",
            "pt-[56.25%]",
            "m-auto",
            "rounded-0",
            "sm:rounded-lg"
          )}
        >
          <iframe
            frameborder="0"
            allowFullScreen="allowFullScreen"
            mozallowfullscreen="mozallowfullscreen"
            msallowfullscreen="msallowfullscreen"
            oallowfullscreen="oallowfullscreen"
            webkitallowfullscreen="webkitallowfullscreen"
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${src}`}
            className="absolute inset-0 "
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>
      )}
    </div>
  );
}
