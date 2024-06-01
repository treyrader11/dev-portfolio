"use client";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { experiences } from "@/lib/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import PageTitle from "@/components/PageTitle";

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
        <h3 className="text-2xl font-bold text-white font-pp-acma">
          {experience.title}
        </h3>
        <p
          className="text-lg font-semibold font-pp-acma text-secondary"
          style={{ margin: 0 }}
        >
          {experience.company_name}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-light text-neutral-400">
          (visit {experience.company_name}{" "}
          <a
            href={experience.website_url}
            target="_blank"
            className={cn(
              "font-light",
              "text-blue-600",
              "hover:underline",
              "duration-300",
              "transition-all",
              "ease-in-out"
            )}
          >
            here
          </a>
          )
        </h3>
      </div>

      <ul className="mt-5 ml-5 space-y-2 list-disc">
        {experience.points.map((point, i) => (
          <li
            key={`experience-point-${i}`}
            className={cn("pl-1 tracking-wider text-white-100")}
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
}

export default function Experience({ className }) {
  return (
    <section className={cn("py-10 bg-dark", className)}>
      <PageTitle
        once
        className={cn("text-center text-white font-black text-[7vw]")}
        containerClass={cn("h-0")}
        title="Work Experience."
      />

      <div className="flex flex-col mt-20">
        <VerticalTimeline>
          {experiences.map((experience, i) => (
            <ExperienceCard key={`experience-${i}`} experience={experience} />
          ))}
        </VerticalTimeline>
      </div>
    </section>
  );
}
