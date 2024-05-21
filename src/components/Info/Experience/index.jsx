"use client";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import "react-vertical-timeline-component/style.min.css";
import { experiences } from "@/lib/data";
import { cn } from "@/lib/utils";
import { textVariant } from "./anim";
import Image from "next/image";

const imageProps = {
  className: "object-contain size-3/5",
  width: 40,
  height: 40,
  sizes: {},
};

function ExperienceCard({ experience }) {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "rgb(34 31 34)",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className="flex items-center justify-center size-full">
          <Image
            src={experience.icon}
            alt={experience.company_name}
            {...imageProps}
          />
        </div>
      }
    >
      <div>
        <h3 className="text-2xl font-bold text-white">{experience.title}</h3>
        <p
          className="text-lg font-semibold text-secondary"
          style={{ margin: 0 }}
        >
          {experience.company_name}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-light text-neutral-400">
          (Visit {experience.company_name}{" "}
          <a
            href={experience.website_url}
            target="_blank"
            className={cn(
              "font-light",
              "text-blue-600",
              "hover:underline",
              "duration-300",
              "transition-all",
              "ease-in-out",
            )}
          >
            here)
          </a>
        </h3>
      </div>

      <ul className="mt-5 ml-5 space-y-2 list-disc">
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className="pl-1 text-base tracking-wider text-white-100"
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
}

export default function Experience() {
  return (
    <>
      <motion.div variants={textVariant()}>
        {/* <p
          className={cn(
            "text-center",
            "sm:text-lg",
            "text-base",
            "text-secondary",
            "uppercase",
            "tracking-wider"
          )}
        >
          What I have done so far
        </p> */}
        <h2
          className={cn(
            "text-center",
            "text-white",
            "font-black",
            "md:text-[60px]",
            "sm:text-[50px]",
            "xs:text-[40px]",
            "text-[30px]"
          )}
        >
          Work Experience.
        </h2>
      </motion.div>

      <div className="flex flex-col mt-20">
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
}
