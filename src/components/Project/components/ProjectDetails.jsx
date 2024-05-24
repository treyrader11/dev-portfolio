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
  const {
    title,
    video_key,
    about_this_app,
    technology_feature,
    design_blog,
    environment_desc,
    env,
    frontend_download_link,
    backend_download_link,
  } = data[0];

  return (
    <section className="pb-28">
      <PageTitle
        title={title}
        backgroundColor="transparent"
        className={cn("p-0 pt-20")}
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
        <ProjectVideo src={video_key} />
        <Block title="About this app" desc={about_this_app} />
        <Block title="Technology & Features">
          <ul className="list-disc ml-5 mt-2.5 text-secondary">
            {technology_feature.map((data, index) => (
              <Magnetic key={index}>
                <li key={data}>{data}</li>
              </Magnetic>
            ))}
          </ul>
        </Block>
        <Block title="Design" desc={design_blog} />
        <Block title="Environment">
          <Environment
            title="Frontend"
            desc={environment_desc}
            data={env.frontend}
          />
          <Environment
            title="Backend"
            desc={environment_desc}
            data={env.backend}
          />
        </Block>
        <Block title="Links">
          <ProjectLinks
            links={[frontend_download_link, backend_download_link]}
          />
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
