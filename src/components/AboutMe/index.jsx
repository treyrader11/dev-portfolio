"use client";

import userData from "@/constants/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export default function AboutMe() {
  return (
    <section className="bg-white dark:bg-gray-800">
      <div
        className={cn(
          "h-48",
          "max-w-6xl",
          "mx-auto",
          "bg-white",
          "dark:bg-gray-800"
        )}
      >
        <h1
          className={
            ("py-20",
            "text-5xl",
            "font-bold",
            "text-center",
            "md:text-9xl md:text-left")
          }
        >
          About Me.
        </h1>
      </div>
      <div className="bg-[#F1F1F1] -mt-10 dark:bg-gray-900">
        <div className="max-w-6xl pt-20 mx-auto text-container">
          <p
            className={cn(
              "mx-4",
              "text-2xl",
              "font-semibold",
              "leading-loose",
              "md:text-4xl"
            )}
            style={{ lineHeight: "3rem" }}
          >
            {userData.about.title}. Currently working on{" "}
            <a
              className={cn(
                "px-2",
                "py-1",
                "text-white",
                "bg-red-500",
                "rounded-md"
              )}
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
            "gap-y-20",
            "gap-x-20"
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
                For any sort help / enquiry, shoot a{" "}
                <a
                  href={`mailto:${userData.email}`}
                  className={cn(
                    "font-bold",
                    "text-gray-800",
                    "border-b-2",
                    "border-gray-800",
                    "dark:border-gray-300",
                    "dark:text-gray-300"
                  )}
                >
                  mail
                </a>{" "}
                and I&apos;ll get back. I swear.
              </p>
            </div>
            <div className="mt-8">
              <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Job Opportunities
              </h1>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
                I&apos;m looking for a job currently, If you see me as a good
                fit, check my{" "}
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
                </a>{" "}
                and I&apos;d love to work for you.
              </p>
            </div>
            {/* Social Links */}
            <h1
              className={cn(
                "mt-8",
                "text-xl",
                "font-semibold",
                "text-gray-700",
                "dark:text-gray-200"
              )}
            >
              Social Links
            </h1>
            <div className="mt-4 ml-4">
              <div className="flex flex-row items-center justify-start ">
                <a
                  href={userData.socialLinks.peerlist}
                  className="flex flex-row items-center space-x-4 group"
                >
                  <div className="my-4">&rarr;</div>
                  <div
                    className={cn(
                      "relative",
                      "overflow-hidden",
                      "font-mono",
                      "text-lg",
                      "text-gray-500",
                      "dark:text-gray-300"
                    )}
                  >
                    <div
                      className={
                        ("absolute",
                        "h-0.5",
                        "w-full",
                        "bg-gray-400",
                        "bottom-0",
                        "transform",
                        "-translate-x-24",
                        "group-hover:translate-x-0",
                        "transition",
                        "duration-300")
                      }
                    ></div>
                    Peerlist
                  </div>
                </a>
              </div>
              <div className="flex flex-row items-center justify-start ">
                <a
                  href={userData.socialLinks.facebook}
                  className="flex flex-row items-center space-x-4 group"
                >
                  <div className="my-4">&rarr;</div>
                  <div className="relative overflow-hidden font-mono text-lg text-gray-500 dark:text-gray-300">
                    <div
                      className={cn(
                        "absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-24 group-hover:translate-x-0 transition duration-300"
                      )}
                    ></div>
                    Facebook
                  </div>
                </a>
              </div>
              <div className="flex flex-row items-center justify-start">
                <a
                  href={userData.socialLinks.twitter}
                  className="flex flex-row items-center space-x-4 group"
                >
                  <div className="my-4">&rarr;</div>
                  <div className="relative overflow-hidden font-mono text-lg text-gray-500 dark:text-gray-300">
                    <div className="absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-24 group-hover:translate-x-0 transition duration-300"></div>
                    Twitter
                  </div>
                </a>
              </div>
              <div className="flex flex-row items-center justify-start">
                <a
                  href={userData.socialLinks.github}
                  className="flex flex-row items-center space-x-4 group"
                >
                  <div className="my-4">&rarr;</div>
                  <div className="relative overflow-hidden font-mono text-lg text-gray-500 dark:text-gray-300">
                    <div className="absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-24 group-hover:translate-x-0 transition duration-300"></div>
                    GitHub
                  </div>
                </a>
              </div>
              <div className="flex flex-row items-center justify-start">
                <a
                  href={userData.socialLinks.linkedin}
                  className="flex flex-row items-center space-x-4 group"
                >
                  <div className="my-4">&rarr;</div>
                  <div className="relative overflow-hidden font-mono text-lg text-gray-500 dark:text-gray-300">
                    <div className="absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-24 group-hover:translate-x-0 transition duration-300"></div>
                    LinkedIn
                  </div>
                </a>
              </div>
              <div className="flex flex-row items-center justify-start">
                <a
                  href={userData.socialLinks.instagram}
                  className="flex flex-row items-center space-x-4 group"
                >
                  <div className="my-4">&rarr;</div>
                  <div className="relative overflow-hidden font-mono text-lg text-gray-500 dark:text-gray-300">
                    <div className="absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-28 group-hover:translate-x-0 transition duration-300"></div>
                    Instagram
                  </div>
                </a>
              </div>
            </div>
          </div>
          {/* Text area */}
          <div className="col-span-1 md:col-span-2">
            {userData.about.description?.map((desc, idx) => (
              <p
                key={idx}
                className="mb-4 text-xl text-gray-700 dark:text-gray-300 "
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
            {/* <div className="flex flex-row flex-wrap mt-8">
              <Image
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png"
                className="w-20 h-20 mx-4 my-4"
                alt=""
                width={50}
                height={50}
              />
              <Image
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/java/java.png"
                className="w-20 h-20 mx-4 my-4"
                alt=""
                width={50}
                height={50}
              />
              <Image
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png"
                className="w-20 h-20 mx-4 my-4"
                alt=""
                width={50}
                height={50}
              />
              <Image
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html.png"
                className="w-20 h-20 mx-4 my-4"
                alt=""
                width={50}
                height={50}
              />
              <Image
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/css/css.png"
                className="w-20 h-20 mx-4 my-4"
                alt=""
                width={50}
                height={50}
              />
              <Image
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/angular/angular.png"
                className="w-20 h-20 mx-4 my-4"
                alt=""
                width={50}
                height={50}
              />
              <Image
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/vue/vue.png"
                className="w-20 h-20 mx-4 my-4"
                alt=""
                width={50}
                height={50}
              />
              <Image
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/git/git.png"
                className="w-20 h-20 mx-4 my-4"
                alt=""
                width={50}
                height={50}
              />
              <Image
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png"
                className="w-20 h-20 mx-4 my-4"
                alt=""
                width={50}
                height={50}
              />
              <Image
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/firebase/firebase.png"
                className="w-20 h-20 mx-4 my-4"
                alt=""
                width={50}
                height={50}
              />
              <Image
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/mysql/mysql.png"
                className="w-20 h-20 mx-4 my-4"
                alt=""
                width={50}
                height={50}
              />
              <Image
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/mongodb/mongodb.png"
                className="w-20 h-20 mx-4 my-4"
                alt=""
                width={50}
                height={50}
              />
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
