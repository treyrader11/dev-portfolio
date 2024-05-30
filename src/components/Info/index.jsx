"use client";

import { userData } from "@/lib/data";
import { cn } from "@/lib/utils";
import Experience from "./Experience";
import Link from "next/link";
import Magnetic from "../Magnetic";
import LinkDecorator from "../LinkDecorator";
import { useScroll, motion } from "framer-motion";
import { useRef, useState } from "react";
import BlurredIn from "../BlurredIn";
import TechStack from "./TechStack";

const socialLinks = [
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
        <BlurredIn once className="md:w-[800px] mx-auto">
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
        </BlurredIn>

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
              <BlurredIn once>
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
              </BlurredIn>
              <BlurredIn once className="mt-8">
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
              </BlurredIn>
            </div>

            {/* Text area */}
            <BlurredIn once className="col-span-1 md:col-span-2">
              {userData.about.description?.map((desc, idx) => (
                <p key={idx} className="mb-4 text-xl text-gray-700">
                  {desc}
                </p>
              ))}
            </BlurredIn>
          </div>
          <Socials className="w-full" />
        </div>
        <TechStack />
      </motion.div>

      <Experience scrollYProgress={scrollYProgress} />
    </section>
  );
}

function SocialLink({ name, href }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Magnetic>
      <a
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        href={href}
        className={cn("p-4 text-left")}
      >
        <span className={cn("flex flex-row-reverse md:flex-col gap-2")}>
          {name}
          <LinkDecorator
            isActive={isHovered}
            className="bg-gray-500 text-left size-1.5"
          />
        </span>
      </a>
    </Magnetic>
  );
}

function Socials({ className }) {
  return (
    <section className={className}>
      <h1
        className={cn(
          "mt-8",
          "mb-4",
          "text-xl",
          "font-semibold",
          "text-gray-700"
        )}
      >
        Socials
      </h1>

      <div
        className={cn(
          "font-mono",
          "text-lg",
          "text-gray-500",
          "gap-4",
          "flex",
          "items-start",
          "flex-col",
          "md:flex-row",
          "justify-end",
          "cursor-pointer",
          "w-fit",
          "md:pb-[20vh]",
          "text-left"
        )}
      >
        {socialLinks.map((link) => (
          <SocialLink key={link.name} name={link.name} href={link.href} />
        ))}
      </div>
    </section>
  );
}
