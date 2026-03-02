import Rounded from "@/components/Rounded";
import { cn } from "@/lib/utils";
import { BsDownload } from "react-icons/bs";

interface LinkItemProps {
  href?: string;
  label: string;
  hidden: boolean;
  className?: string;
}

function LinkItem({ href, label, hidden, className }: LinkItemProps) {
  return (
    <Rounded
      backgroundColor="transparent"
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
        target="_blank"
        className={cn(
          { hidden },
          "flex",
          "flex-row",
          "items-center",
          "gap-2",
          className
        )}
      >
        <BsDownload strokeWidth={1} className="group-hover:animate-bounce" />
        <span className="font-semibold ml-[6px]">{label}</span>
      </a>
    </Rounded>
  );
}

interface LinkData {
  href?: string;
  label: string;
  hidden: boolean;
}

interface Props {
  className?: string;
  links: LinkData[];
}

export default function ProjectLinks({ className, links }: Props) {
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
        {links.map(
          (link, index) =>
            link.href && (
              <LinkItem key={index} {...link} className="relative z-10" />
            )
        )}
      </div>
    </div>
  );
}
