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

const socials = [
  { name: "Youtube", href: userData.socialLinks.youtube },
  { name: "GitHub", href: userData.socialLinks.github },
  { name: "LinkedIn", href: userData.socialLinks.linkedin },
  { name: "Instagram", href: userData.socialLinks.instagram },
];

const heading = userData.about.title;

export default function Info() {
  const container = useRef();

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

        <div className="px-4 md:w-[800px] mx-auto">
          <div
            className={cn(
              "grid",
              "max-w-6xl",
              "grid-cols-1",
              "pt-20",
              "mx-auto",
              "md:grid-cols-3",
              "gap-20",
              "w-full"
            )}
          >
            {/* Social Buttons */}
            <div className="inline-flex flex-col ">
              <div>
                <h1
                  className={cn(
                    "text-xl",
                    "font-semibold",
                    // "font-pp-acma",
                    "text-gray-700"
                  )}
                >
                  Contact
                </h1>
                <p className={cn("mt-4 text-lg text-gray-500")}>
                  For any sort of help / enquiry, please shoot me an{" "}
                  <Link
                    // href={`mailto:${userData.email}`}
                    href="/contact"
                    className={cn(
                      "font-bold",
                      "text-gray-800",
                      "border-b-2",
                      "border-gray-800"
                    )}
                  >
                    email
                  </Link>{" "}
                  and I&apos;ll get back the same day.
                </p>
              </div>
              <div className="mt-8">
                <h1 className="text-xl font-semibold text-gray-700">
                  Job Opportunities
                </h1>
                <p className="relative mt-4 text-lg text-gray-500">
                  I&apos;m looking for a job currently. If you see me as a good
                  fit, please have a look at my{" "}
                  <span>
                    <a
                      href={userData.resumeUrl}
                      target="__blank"
                      className={cn(
                        "font-bold",
                        "text-gray-800",
                        "border-b-2",
                        "border-gray-800"
                      )}
                    >
                      CV
                    </a>{" "}
                  </span>
                  and I&apos;d love to see what y&lsquo;all do!
                </p>
              </div>
            </div>

            {/* Text area */}
            <div
              className={cn(
                "col-span-1",
                "mx-[10vw]",
                // "font-pp-acma",
                // "font-mono",
                // "text-slate-400",
                "text-[3vw]",
                // "uppercase",
                "md:col-span-2",
                "text-extralight"
              )}
            >
              {userData.about.description?.map((desc, i) => (
                <p key={i} className="mb-4 text-xl">
                  {desc}
                </p>
              ))}
            </div>
          </div>
          <div
            className={cn(
              "pt-20",
              "relative",
              "grid",
              "grid-cols-2",
              "mx-8",
              "gap-5",
              "md:gap-0",
              "mt-[5vh]"
            )}
          >
            <Socials
              md={md}
              links={socials}
              className="w-full relative z-[1] "
            />
            <Portrait className="" style={{ top: lg }} />
          </div>
        </div>

        <div className="w-full pt-40 sm:pt-20">
          <TechStack className="w-full " />
        </div>

        {/* <TextSlider text="TeckStack" /> */}
      </motion.div>

      <Experience scrollYProgress={scrollYProgress} />
    </section>
  );
}
