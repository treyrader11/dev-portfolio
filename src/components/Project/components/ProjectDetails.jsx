import Link from "next/link";
import ProjectVideo from "./ProjectVideo";
import { cn } from "@/lib/utils";
import Environment from "./Environment";
import Magnetic from "@/components/Magnetic";
import ProjectLinks from "./ProjectLinks";
import PageTitle from "@/components/PageTitle";
import LinkDecorator from "@/components/LinkDecorator";
import Block from "@/components/Block";

export default function ProjectDetails({ data }) {
  return (
    <section className="pb-28">
      <PageTitle
        title={`${data[0].title}.`}
        backgroundColor="transparent"
        className={cn("p-0", "pt-20")}
      />
      <div
        className={cn(
          "w-full",
          "md:w-[800px]",
          "h-auto",
          "flex",
          "flex-col",
          "items-start",
          "justify-start",
          "px-2.5",
          "sm:px-4",
          "md::px-0"
        )}
      >
        <ProjectVideo src={data[0].video_key} />
        <Block title="About this app" desc={data[0].about_this_app} />
        <Block title="Technology & Features">
          <ul className="list-disc ml-5 mt-2.5 text-secondary">
            {data[0].technology_feature.map((data, index) => (
              <Magnetic key={index}>
                <li key={data}>{data}</li>
              </Magnetic>
            ))}
          </ul>
        </Block>
        <Block title="Design" desc={data[0].design_blog} />
        <Block title="Environment">
          <Environment
            title="Frontend"
            desc={data[0].environment_desc}
            data={data[0].env.frontend}
          />
          <Environment
            title="Backend"
            desc={data[0].environment_desc}
            data={data[0].env.backend}
          />
        </Block>
        <Block title="Links">
          <ProjectLinks data={data} />
        </Block>
        <Magnetic>
          <Link
            href={"/portfolio"}
            className={cn(
              "flex",
              "flex-row",
              "items-center",
              "font-extralight",
              "text-gray-500",
              "my-20",
              "mx-8",
              "group"
            )}
          >
            <LinkDecorator isActive className="my-auto mr-2" />
            See all
            <span
              className={cn(
                "text-purple-500",
                "ml-[5px]",
                "hover:underline",
                "font-normal",
                "text-lg",
                "animate-pulse"
              )}
            >
              Projects
            </span>
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}
