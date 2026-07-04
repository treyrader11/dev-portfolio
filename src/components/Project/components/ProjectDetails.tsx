import Link from "next/link";
import { FaApple } from "react-icons/fa";
import ProjectVideo from "./ProjectVideo";
import { cn, resolveImageSrc } from "@/lib/utils";
import Environment from "./Environment";
import Magnetic from "@/components/Magnetic";
import ProjectLinks from "./ProjectLinks";
import LinkDecorator from "@/components/LinkDecorator";
import Block from "@/components/Block";
import Safari from "./Desktop";
import PackagesCodeBlock from "@/components/CodeBlock/PackagesCodeBlock";
import { isEnvEmpty, isPackagesEmpty } from "@/features/portfolio/lib/parse-config";
import type { ProjectData } from "@/types/data";

interface Props {
  data: ProjectData[];
}

export default function ProjectDetails({ data }: Props) {
  const {
    video_key,
    desc,
    technology_feature,
    env,
    packages,
    download_links,
    image,
  } = data[0];

  const appStoreUrl = download_links?.ios?.trim();
  const frontendPkgs = packages?.frontend?.filter(Boolean) ?? [];
  const backendPkgs = packages?.backend?.filter(Boolean) ?? [];

  // The admin can pick one of the project's images to sit inside the Safari
  // frame; when none is chosen we fall back to autoplaying the project video.
  const safariImage = image?.safari?.length
    ? resolveImageSrc(image.safari)
    : undefined;

  const _links = [
    {
      href: download_links.frontend,
      label: "Frontend",
      hidden: !download_links.frontend?.length,
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
        {/* <ProjectVideo src={video_key} /> */}
        <Safari
          imageSrc={safariImage}
          videoSrc={safariImage ? undefined : video_key}
          className="pt-10 size-4/5"
        />

        {/* Apple App Store download CTA — only when an iOS link is set. */}
        {appStoreUrl && (
          <div className="mt-8 flex justify-center sm:justify-start">
            <Magnetic>
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
                className={cn(
                  "inline-flex items-center gap-3 rounded-xl bg-black px-6 py-3",
                  "text-white transition-transform hover:scale-[1.03]",
                )}
              >
                <FaApple className="size-8" />
                <span className="flex flex-col leading-none">
                  <span className="text-[10px] font-light">
                    Download on the
                  </span>
                  <span className="text-xl font-semibold">App Store</span>
                </span>
              </a>
            </Magnetic>
          </div>
        )}

        <Block title="About this project" desc={desc} />
        <Block title="Technology & Features">
          <ul className="list-disc font-pp-acma ml-5 mt-2.5 text-secondary">
            {technology_feature.map((data, index) => (
              <Magnetic key={index}>
                <li className="w-fit" key={data}>
                  {data}
                </li>
              </Magnetic>
            ))}
          </ul>

          {/* Parsed package.json dependencies, rendered as formatted code
              blocks. Only shown when the admin pasted a package.json. */}
          {!isPackagesEmpty(packages) && (
            <div className="mt-6 space-y-4">
              {frontendPkgs.length > 0 && (
                <PackagesCodeBlock
                  title={backendPkgs.length > 0 ? "Frontend" : null}
                  lines={frontendPkgs}
                />
              )}
              {backendPkgs.length > 0 && (
                <PackagesCodeBlock title="Backend" lines={backendPkgs} />
              )}
            </div>
          )}
        </Block>

        {/* Environment section is hidden entirely when no env vars are set. */}
        {!isEnvEmpty(env) && (
          <Block title="Environment">
            <Environment
              title={env?.backend?.length ? "Frontend" : null}
              data={env.frontend || []}
            />
            {env?.backend?.length ? (
              <Environment title="Backend" data={env.backend} />
            ) : null}
          </Block>
        )}
        <Block title="Source code">
          <ProjectLinks links={_links} />
        </Block>
      </div>
      <SeeAll />
    </section>
  );
}

interface SeeAllProps {
  className?: string;
}

function SeeAll({ className }: SeeAllProps) {
  return (
    <Magnetic>
      <Link
        href={"/portfolio"}
        scroll={false}
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
          className,
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
            "animate-pulse",
          )}
        >
          Projects
        </span>
      </Link>
    </Magnetic>
  );
}
