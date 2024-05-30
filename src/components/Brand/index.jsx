"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Brand({ className }) {
  return (
    <Link href="/" className={cn("group flex", className)}>
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
          // "custom-ease-in-out",
          "ease-in-out"
        )}
      >
        <p
          className={cn(
            "m-0",
            "transition-all",
            "duration-500",
            "relative",
            "transition-transform",
            "duration-500",
            // "custom-ease-in-out",
            "ease-in-out",
            "group-hover:-translate-x-full"
          )}
        >
          Developed by
        </p>
        <p
          className={cn(
            "m-0",
            "transition-all",
            "duration-500",
            "custom-ease-in-out",
            "relative",
            "transition-transform",
            "duration-500",
            "custom-ease-in-out",
            "pl-[0.3em]",
            "group-hover:-translate-x-[100px]"
          )}
        >
          Trey
        </p>
        <p
          className={cn(
            "m-0",
            "transition-all",
            "duration-500",
            "custom-ease-in-out",
            "relative",
            "transition-transform",
            "duration-500",
            "custom-ease-in-out",
            "absolute",
            "left-[152px]",
            "group-hover:-translate-x-[115px]"
          )}
        >
          Rader
        </p>
      </div>
    </Link>
  );
}
