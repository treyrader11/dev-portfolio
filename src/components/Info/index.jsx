"use client";

import { userData } from "@/lib/data";
import { cn } from "@/lib/utils";
import Experience from "./Experience";
import Link from "next/link";
import { useScroll, motion } from "framer-motion";
import { useRef } from "react";
import TechStack from "./TechStack";
import Socials from "./Socials";
import Image from "next/image";

const socials = [
  { name: "Youtube", href: userData.socialLinks.youtube },
  { name: "GitHub", href: userData.socialLinks.github },
  { name: "LinkedIn", href: userData.socialLinks.linkedin },
  { name: "Instagram", href: userData.socialLinks.instagram },
];

export default function Info() {
  const container = useRef();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={container} className="bg-[#F1F1F1] w-ful pb-40">
      <motion.div>
        <div className="md:w-[800px] mx-auto">
          <div className="max-w-6xl pt-20 mx-auto">
            <p className={cn("mx-4 text-2xl font-semibold md:text-4xl")}>
              {userData.about.title}. Currently working on{" "}
              <a
                className={cn(
                  "px-2",
                  "py-1",
                  "bg-purple-500",
                  "rounded-md",
                  "text-white"
                )}
                target="_blank"
                href={userData.about.current_project_url}
              >
                {userData.about.current_project}
              </a>
            </p>
          </div>
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
            <div className="inline-flex flex-col">
              <div>
                <h1 className={cn("text-xl", "font-semibold", "text-gray-700")}>
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
            <div className="col-span-1 md:col-span-2">
              {userData.about.description?.map((desc, idx) => (
                <p key={idx} className="mb-4 text-xl text-gray-700">
                  {desc}
                </p>
              ))}
            </div>
          </div>
          <div
            className={cn(
              // "space-y-20",
              "pt-20",
              "relative",
              "grid-cols-2",
              // "mx-8",
              "grid",
              "gap-x-5"
            )}
          >
            <Socials links={socials} className="w-full relative z-[1] " />
            <Portrait />
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

export function Portrait({ className }) {
  return (
    <div
      className={cn(
        "relative",
        "flex",
        "items-center",
        "h-[40vh]",
        "md:h-[50vh]",
        className
      )}
    >
      <Image
        // width={150}
        // height={150}
        fill
        priority
        alt="Full profile picture"
        src={`/images/portraits/profile.png`}
        // src={`/images/portraits/profile-truncated.png`}
        // src={`/images/portraits/profile-standing.png`}
        // className="object-contain rounded-lg" old classes
        className={cn(
          "md:object-contain",
          "object-cover",
          "border border-double "
          // "rounded-lg"
        )}
        sizes={{}}
      />
    </div>
  );
}
