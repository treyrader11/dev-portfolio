"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  className?: string;
}

export default function Brand({ className }: Props) {
  return (
    <Link href="/" scroll={false} className={cn("group flex", className)}>
      <p
        className={cn(
          "m-0",
          "transition-all",
          "duration-500",
          "custom-ease-in-out",
          "group-hover:rotate-full"
        )}
      >
        ©
      </p>
      <div
        className={cn(
          "flex",
          "relative",
          "overflow-hidden",
          "whitespace-nowrap",
          "ml-[5px]",
          "transition-all",
          "duration-500",
          "custom-ease-in-out"
        )}
      >
        <p
          className={cn(
            "m-0",
            "transition-transform",
            "duration-500",
            "custom-ease-in-out",
            "group-hover:-translate-x-full"
          )}
        >
          Developed by
        </p>
        <p
          className={cn(
            "m-0",
            "transition-transform",
            "duration-500",
            "custom-ease-in-out",
            "pl-[0.3em]",
            "group-hover:-translate-x-[100px]",
            "font-cursive",
            "-mt-px",
            "text-lg"
            // "text-[#ebfb1d]"
          )}
        >
          Trey
        </p>
        <p
          className={cn(
            "m-0",
            "absolute",
            "left-[156px]",
            "transition-transform",
            "duration-500",
            "custom-ease-in-out",
            "group-hover:-translate-x-[115px]",
            "font-cursive",
            "-mt-px",
            "text-lg"
            // "text-[#ebfb1d]"
          )}
        >
          Rader
        </p>
      </div>
    </Link>
  );
}
