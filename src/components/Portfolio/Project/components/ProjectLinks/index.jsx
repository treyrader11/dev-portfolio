import Rounded from "@/components/Rounded";
import StyledLink from "@/components/StyledLink";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { BsDownload } from "react-icons/bs";

function LinkItem({ href, imageSrc, imageAlt, label, hidden, className }) {
  return (
    <Rounded
      backgroundColor="#9533F5"
      href={`${href}`}
      className={cn(
        // "border-purple-500",
        "outline-purple-700",
        "rounded-full",
        "w-fit",
        "mx-auto",
        "p-4",
        "text-purple-500"
      )}
    >
      <a
        href={href}
        className={cn(
          { hidden },
          "flex",
          "flex-row",
          "items-center",
          "gap-2",
          // "font-mono",
          className
        )}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            className="w-[25px] h-auto"
            width={1920}
            height={1080}
            alt={imageAlt}
          />
        ) : (
          <BsDownload strokeWidth={1} className="group-hover:animate-bounce" />
        )}
        <span className="font-semibold ml-[6px]">{label}</span>
      </a>
    </Rounded>
  );
}

export default function ProjectLinks({ className, data }) {
  const links = [
    {
      href: data[0].youtube_link,
      imageSrc: "/youtube-svgrepo-com.svg",
      imageAlt: "YouTube",
      label: "YouTube",
    },
    {
      href: data[0].githhub_link,
      imageSrc: "/github-142-svgrepo-com.svg",
      imageAlt: "GitHub",
      label: "GitHub",
    },
    {
      href: data[0].frontend_download_link,
      imageSrc: null,
      imageAlt: "",
      label: "Frontend",
      hidden: !data[0].frontend_download_link.length,
    },
    {
      href: data[0].backend_download_link,
      imageSrc: null,
      imageAlt: "",
      label: "Backend",
      hidden: !data[0].backend_download_link.length,
    },
  ];

  return (
    <div className={className}>
      <span className={cn("my-5 text-2xl font-bold")}>Links</span>
      <div className={cn("flex flex-wrap gap-3 pt-5")}>
        {links.map((link, index) => (
          <LinkItem
            key={index}
            {...link}
            className="relative z-10 group-hover:text-white"
          />
        ))}
      </div>
    </div>
  );
}
