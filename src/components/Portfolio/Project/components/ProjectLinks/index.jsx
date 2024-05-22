import StyledLink from "@/components/StyledLink";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { BsDownload } from "react-icons/bs";

function LinkItem({ href, imageSrc, imageAlt, label, hidden }) {
  return (
    <a
      href={href}
      className={cn(
        { hidden },
        "px-5",
        "py-[5px]",
        "mr-2.5",
        "mb-2.5",
        "sm:mb-0",
        "rounded-md",
        "bg-white",
        "flex",
        "flex-row",
        "items-center",
        "active:scale-90",
        "transition-all",
        "duration-150",
        "select-none",
        "gap-2",
        "cursor-pointer",
        "hover:bg-[#f3f3f3]",
        "group"
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
      <span className="font-bold ml-[6px]">{label}</span>
    </a>
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
      <span className={cn("my-5 text-2xl font-bold select-none")}>Links</span>
      <div
        className={cn(
          "size-auto",
          "flex",
          "flex-row",
          "items-center",
          "justify-start",
          "sm:justify-between",
          "flex-wrap"
        )}
      >
        {links.map((link, index) => (
          <LinkItem key={index} {...link} />
        ))}
      </div>
    </div>
  );
}
