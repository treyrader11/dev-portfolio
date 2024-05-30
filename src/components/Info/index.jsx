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
  { name: "Facebook", href: userData.socialLinks.facebook },
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
    <section ref={container} className="bg-[#F1F1F1] w-full">
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
          <div className="relative grid-cols-2 mx-8 sm:mx:0 sm:grid">
            <Socials links={socials} className="w-full relative z-[1] " />
            <div className={cn("absolute sm:relative top-0 inset-x-0 flex items-center h-[400px]")}>
              <Image
                // width={150}
                // height={150}
                fill
                priority
                alt="profile picture"
                src={`/images/portraits/profile.png`}
                className="object-contain rounded-lg"
                sizes={{}}
              />
            </div>
          </div>
        </div>

        <div className="w-full pt-40 sm:pt-20">
          <TechStack />
        </div>

        {/* <TextSlider text="TeckStack" /> */}
      </motion.div>

      <Experience scrollYProgress={scrollYProgress} />
    </section>
  );
}
