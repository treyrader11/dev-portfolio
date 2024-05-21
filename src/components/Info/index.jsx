"use client";

import PageTitle from "@/components/PageTitle";
import { userData } from "@/lib/data";
import { cn } from "@/lib/utils";
import Experience from "./Experience";
import Link from "next/link";
// import Socials from "../Socials";
import Magnetic from "../Magnetic";
import LinkDecorator from "../LinkDecorator";
import { useState } from "react";

const socialLinks = [
  { name: "Facebook", href: userData.socialLinks.facebook },
  { name: "GitHub", href: userData.socialLinks.github },
  { name: "LinkedIn", href: userData.socialLinks.linkedin },
  { name: "Instagram", href: userData.socialLinks.instagram },
];

export default function Info() {
  return (
    <section className="bg-dark">
      <PageTitle title="About." backgroundColor="white" />
      <div className="bg-[#F1F1F1] -mt-10">
        <div className="max-w-6xl pt-20 mx-auto">
          <p className={cn("mx-4", "text-2xl", "font-semibold", "md:text-4xl")}>
            {userData.about.title}. Currently working on{" "}
            <a
              className={cn(
                "px-2",
                "py-1",
                "text-white",
                "bg-red-500",
                "rounded-md"
              )}
              target="_blank"
              href={userData.about.currentProjectUrl}
            >
              {userData.about.currentProject} ✈️
            </a>
          </p>
        </div>
      </div>
      <div className="bg-[#F1F1F1] dark:bg-gray-900 px-4">
        <div
          className={cn(
            "grid",
            "max-w-6xl",
            "grid-cols-1",
            "pt-20",
            "mx-auto",
            "md:grid-cols-3",
            "gap-20"
          )}
        >
          {/* Social Buttons */}
          <div className="inline-flex flex-col">
            <div>
              <h1
                className={cn(
                  "text-xl",
                  "font-semibold",
                  "text-gray-700",
                  "dark:text-gray-200"
                )}
              >
                Contact
              </h1>
              <p
                className={cn(
                  "mt-4",
                  "text-lg",
                  "text-gray-500",
                  "dark:text-gray-300"
                )}
              >
                For any sort of help / enquiry, please shoot me an{" "}
                <Link
                  // href={`mailto:${userData.email}`}
                  href="/contact"
                  className={cn(
                    "font-bold",
                    "text-gray-800",
                    "border-b-2",
                    "border-gray-800",
                    "dark:border-gray-300",
                    "dark:text-gray-300"
                  )}
                >
                  email
                </Link>{" "}
                and I&apos;ll get back the same day.
              </p>
            </div>
            <div className="mt-8">
              <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Job Opportunities
              </h1>
              <p className="relative mt-4 text-lg text-gray-500 dark:text-gray-300">
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
                      "border-gray-800",
                      "dark:border-gray-300",
                      "dark:text-gray-300"
                    )}
                  >
                    CV
                  </a>
                  {" "}
                </span>
                and I&apos;d love to work for you.
              </p>
            </div>
            {/* Social Links */}
            <Socials />
          </div>

          {/* Text area */}
          <div className="col-span-1 md:col-span-2">
            {userData.about.description?.map((desc, idx) => (
              <p
                key={idx}
                className="mb-4 text-xl text-gray-700 dark:text-gray-300"
              >
                {desc}
              </p>
            ))}

            <h1
              className={cn(
                "inline-block",
                "px-2",
                "py-1",
                "text-3xl",
                "font-bold",
                "bg-red-500",
                "rounded-md",
                "text-gray-50"
              )}
            >
              Tech Stack
            </h1>
          </div>
        </div>
      </div>
      <Experience />
    </section>
  );
}

function SocialLink({ name, href }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Magnetic>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "flex",
          "group",
          "flex-row",
          "items-center",
          "justify-start",
          "cursor-pointer",
          "w-fit"
        )}
      >
        <a href={href} className="flex flex-row items-center p-4 space-x-4">
          <div
            className={cn(
              "font-mono",
              "text-lg",
              "text-gray-500",
              "flex",
              "gap-2"
            )}
          >
            <LinkDecorator
              isActive={isHovered}
              className="bg-gray-500 size-1.5"
            />
            {name}
          </div>
        </a>
      </div>
    </Magnetic>
  );
}

function Socials() {
  return (
    <>
      <h1 className={cn("mt-8", "text-xl", "font-semibold", "text-gray-700")}>
        Socials
      </h1>

      <div className="mt-4 ml-1">
        {socialLinks.map((link) => (
          <SocialLink key={link.name} name={link.name} href={link.href} />
        ))}
      </div>
    </>
  );
}
