"use client";

import StyledLink from "@/components/StyledLink";
import ResumeModal from "@/components/ResumeModal";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { BsDownload } from "react-icons/bs";
import { socials } from "./links.data";

export default function Footer() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex",
        "justify-between",
        "text-xs",
        "gap-6",
        "mt-10",
        "font-mono",
        "sm:w-full",
        "md:w-auto"
      )}
    >
      {socials.map((link, i) => {
        if (link.label === "Resume") {
          return (
            <button
              key={i}
              type="button"
              onClick={() => setIsResumeOpen(true)}
              className={cn(
                "m-0",
                "p-[2.5px]",
                "cursor-pointer",
                "bg-transparent",
                "after:w-0",
                "after:h-px",
                "after:bg-white",
                "after:block",
                "after:mt-[2px]",
                "after:relative",
                "after:left-0",
                "after:transition-[width]",
                "after:duration-200",
                "after:ease-linear",
                "hover:after:w-full"
              )}
            >
              <span className="flex items-center gap-2">
                Resume{" "}
                <BsDownload className="text-[#ebfb1d] animate-bounce" />
              </span>
            </button>
          );
        }

        return (
          <StyledLink key={i} href={link.href}>
            {link.label}
          </StyledLink>
        );
      })}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}
