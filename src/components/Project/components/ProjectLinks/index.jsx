import Rounded from "@/components/Rounded";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { BsDownload } from "react-icons/bs";

function LinkItem({ href, imageSrc, imageAlt, label, hidden, className }) {
  return (
    <Rounded
      backgroundColor="transparent"
      href={`${href}`}
      className={cn(
        "w-full",
        "md:w-fit",
        "py-5",
        "px-10",
        "border-[.3px]",
        "transition-[colors,border]",
        "duration-500",
        "ease-in-out",
        "text-black",
        "hover:text-purple-700",
        "hover:border-purple-700"
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

export default function ProjectLinks({
  className,
  links: [ frontend_download_link, backend_download_link ],
}) {
  const links = [
    {
      href: frontend_download_link,
      imageSrc: null,
      imageAlt: "",
      label: "Frontend",
      hidden: !frontend_download_link.length,
    },
    {
      href: backend_download_link,
      imageSrc: null,
      imageAlt: "",
      label: "Backend",
      hidden: !backend_download_link.length,
    },
  ];

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex",
          "flex-col",
          "md:flex-row",
          "gap-5",
          "mt-10",
          "items-center"
        )}
      >
        {links.map((link, index) => (
          <LinkItem key={index} {...link} className="relative z-10" />
        ))}
      </div>
    </div>
  );
}
