"use client";

import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import PageTitle from "@/components/PageTitle";
import Rounded from "@/components/Rounded";
import { slideUp, opacity } from "@/components/Description/anim";

interface Props {
  className?: string;
}

const phrase =
  "Independent contracting for clients and teams. From greenfield builds to scaling existing products.";

const offerings = [
  "Full-stack web and React Native apps built from scratch or taken over mid-flight.",
  "Embedding with product teams to ship features, untangle legacy code, and raise the bar.",
  "Architecture, performance audits, and CI so what we ship stays fast and maintainable.",
];

export default function Freelance({ className }: Props) {
  // Trigger off the text block (not the section) so the reveal fires when the
  // copy actually scrolls into view — the section itself is pulled up
  // -mt-[130vh] on desktop, which would otherwise trigger it far too early.
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef);

  return (
    <motion.section
      className={cn(
        "relative",
        "z-[3]",
        "flex",
        "flex-col",
        "items-center",
        "gap-y-16",
        "px-6",
        "py-12",
        "sm:py-24",
        "md:px-20",
        "sm:-mt-[130vh]",
        className
      )}
    >
      <PageTitle
        once={false}
        delay={0.8}
        backgroundColor="transparent"
        containerClass={cn("sm:h-0", "font-pp-acma")}
        title="Freelance & pricing."
        className={cn("py-0 md:text-[5vw]")}
      />

      <div
        ref={contentRef}
        className={cn(
          "flex",
          "flex-col",
          "gap-[50px]",
          "max-w-[1400px]",
          "w-full",
          "md:flex-row"
        )}
      >
        <p className="m-0 flex-1 text-3xl leading-[1.3] md:text-4xl">
          {phrase.split(" ").map((word, index) => (
            <span key={index} className="relative inline-flex overflow-hidden">
              <motion.span
                variants={slideUp}
                custom={index}
                animate={isInView ? "open" : "closed"}
                className="mr-[3px]"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </p>

        <motion.ul
          variants={opacity}
          animate={isInView ? "open" : "closed"}
          className="m-0 flex flex-1 list-none flex-col gap-5 text-lg"
        >
          {offerings.map((item, index) => (
            <li key={index} className="flex gap-3">
              <span className="text-secondary">—</span>
              <span>{item}</span>
            </li>
          ))}
        </motion.ul>
      </div>

      <Rounded
        backgroundColor="#934e00"
        text="Learn more"
        href="/pricing"
        className={cn(
          "border-secondary",
          "rounded-full",
          "w-fit",
          "mx-auto",
          "py-6",
          "text-black"
        )}
      />
    </motion.section>
  );
}
