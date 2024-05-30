import Link from "next/link";
import ProjectVideo from "./ProjectVideo";
import { cn } from "@/lib/utils";
import Environment from "./Environment";
import Magnetic from "@/components/Magnetic";
import ProjectLinks from "./ProjectLinks";
import LinkDecorator from "@/components/LinkDecorator";
import Block from "@/components/Block";

export default function ProjectDetails({ data }) {
  const { title, video_key, desc, technology_feature, env, download_links } =
    data[0];

  const _links = [
    {
      href: download_links.frontend,
      label: "Frontend",
      hidden: !download_links.frontend.length,
    },
    {
      href: download_links?.backend,
      label: "Backend",
      hidden: !download_links?.backend?.length,
    },
  ];

  return (
    <section className="pb-28 bg-[#F1F1F1] w-full">
      <div className={cn("md:w-[800px]", "px-2.5", "sm:px-4", "md::px-0")}>
        <ProjectVideo src={video_key} />
        <Block title="About this project" desc={desc} />
        <Block title="Technology & Features">
          <ul className="list-disc ml-5 mt-2.5 text-secondary">
            {technology_feature.map((data, index) => (
              <Magnetic key={index}>
                <li className="w-fit" key={data}>{data}</li>
              </Magnetic>
            ))}
          </ul>
        </Block>

        <Block title="Environment">
          <Environment
            title={env?.backend ? "Frontend" : null}
            data={env.frontend}
          />
          {env?.backend && <Environment title="Backend" data={env.backend} />}
        </Block>
        <Block title="Links">
          <ProjectLinks links={_links} />
        </Block>
      </div>
      <SeeAll />
    </section>
  );
}

function SeeAll({ className }) {
  return (
    <Magnetic>
      <Link
        href={"/portfolio"}
        className={cn(
          "flex",
          "items-center",
          "font-extralight",
          "text-gray-500",
          "my-20",
          "mx-8",
          "group",
          "flex",
          "w-fit",
          className
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
  );
}
