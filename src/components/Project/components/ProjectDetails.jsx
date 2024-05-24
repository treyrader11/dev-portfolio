import Link from "next/link";
import ProjectVideo from "./ProjectVideo";
import { cn } from "@/lib/utils";
import Environment from "./Environment";
import Magnetic from "@/components/Magnetic";
import ProjectLinks from "./ProjectLinks";
import PageTitle from "@/components/PageTitle";
import LinkDecorator from "@/components/LinkDecorator";

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
        <span className="my-5 text-2xl font-bold">About this app</span>
        <p>{data[0].about_this_app}</p>
        {/* <div className="my-5">
          <span className="text-2xl font-bold">{data[0].say_hi}</span>
        </div>
        <div>
          <p>{data[0].say_hi_blog}</p>
        </div> */}
        <span className={cn("font-bold text-2xl mt-4")}>
          Technology & Features
        </span>
        <ul className="list-disc ml-5 mt-2.5 text-secondary">
          {data[0].technology_feature.map((data, index) => (
            <Magnetic key={index}>
              <li key={data}>{data}</li>
            </Magnetic>
          ))}
        </ul>

        <span className={cn("my-5 text-2xl font-bold")}>Design</span>
        <p className="mb-2.5">{data[0].design_blog}</p>
        <Environment data={data} />
        <ProjectLinks data={data} />
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
