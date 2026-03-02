"use client";

import { userData } from "@/lib/data";
import { cn } from "@/lib/utils";
import Experience from "./Experience";
import Link from "next/link";
import { useScroll, motion, useTransform } from "framer-motion";
import { useRef } from "react";
import TechStack from "./TechStack";
import Socials from "./Socials";
import { Portrait } from "./Portrait";
import ParalaxScrollText from "./ParalaxScrollText";

interface SocialItem {
  name: string;
  href: string;
}

const socials: SocialItem[] = [
  { name: "Youtube", href: userData.socialLinks.youtube },
  { name: "GitHub", href: userData.socialLinks.github },
  { name: "LinkedIn", href: userData.socialLinks.linkedin },
];

const heading = userData.about.title;

export default function Info() {
  const container = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const sm = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const md = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const lg = useTransform(scrollYProgress, [0, 1], [0, -250]);

  return (
    <section
      ref={container}
      className={cn(
        "bg-neutral-100",
        "pb-40",
        "min-h-screen",
        "text-gray-500",
        "mx-auto"
      )}
    >
      <motion.div className={cn("pt-[10vh]")}>
        <div className="mx-[10vw]">
          <motion.h1
            className={cn(
              "m-0",
              "mt-2.5",
              "text-[5vw]",
              "leading-[5vw]",
              "text-gray-700",
              "font-pp-acma"
            )}
            style={{ y: sm }}
          >
            Hi there
          </motion.h1>

          <ParalaxScrollText text={heading} scrollYProgress={scrollYProgress} />
        </div>

        <div className="px-4 md:w-[900px] lg:w-[1100px] mx-auto">
          {/* SOLUTION 2: Grid with items-start alignment */}
          <div
            className={cn(
              "grid",
              "grid-cols-1",
              "md:grid-cols-[280px_1fr]",
              "pt-20",
              "gap-10",
              "lg:gap-16",
              "items-start" // This is key - aligns items to top
            )}
          >
            {/* Sidebar - Contact & Job Opportunities */}
            <div className="space-y-8">
              <div>
                <h1 className={cn("text-xl", "font-semibold", "text-gray-700")}>
                  Contact
                </h1>
                <p className={cn("mt-4", "text-lg", "text-gray-500")}>
                  For any sort of help / enquiry, please shoot me an{" "}
                  <Link
                    href="/contact"
                    scroll={false}
                    className={cn(
                      "font-bold",
                      "text-gray-800",
                      "border-b-2",
                      "border-gray-800",
                      "hover:text-gray-600",
                      "transition-colors"
                    )}
                  >
                    email
                  </Link>{" "}
                  and I&apos;ll get back the same day.
                </p>
              </div>

              <div>
                <h1 className="text-xl font-semibold text-gray-700">
                  Job Opportunities
                </h1>
                <p className="relative mt-4 text-lg text-gray-500">
                  I&apos;m looking for a job currently. If you see me as a good
                  fit, please have a look at my{" "}
                  <a
                    href={userData.resumeUrl}
                    target="__blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "font-bold",
                      "text-gray-800",
                      "border-b-2",
                      "border-gray-800",
                      "hover:text-gray-600",
                      "transition-colors"
                    )}
                  >
                    CV
                  </a>{" "}
                  and I&apos;d love to see what y&apos;all do!
                </p>
              </div>
            </div>

            {/* Main Content - Description */}
            <div className="space-y-4">
              {userData.about.description?.map((desc, i) => (
                <p key={i} className="text-xl leading-relaxed text-gray-500">
                  {desc}
                </p>
              ))}
            </div>
          </div>

          {/* Socials & Portrait */}
          <div
            className={cn(
              "pt-20",
              "relative",
              "grid",
              "grid-cols-1",
              "md:grid-cols-2",
              "gap-10",
              "mt-[5vh]"
            )}
          >
            <Socials
              md={md}
              links={socials}
              className="w-full relative z-[1]"
            />
            <Portrait style={{ top: lg }} />
          </div>
        </div>

        <div className="w-full pt-40 sm:pt-20">
          <TechStack className="w-full" />
        </div>
      </motion.div>

      <Experience scrollYProgress={scrollYProgress} />
    </section>
  );
}
