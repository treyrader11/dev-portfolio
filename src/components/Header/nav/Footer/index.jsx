import StyledLink from "@/components/StyledLink";
import { cn } from "@/lib/utils";
import { BsDownload } from "react-icons/bs";
import { socials } from "./links.data";

export default function Footer() {
  return (
    <div
      className={cn(
        "flex",
        "justify-between",
        "text-xs",
        "gap-6",
        "mt-10",
        "font-mono",
        "sm:w-full",
        "md:w-auto"
      )}
    >
      {socials.map((link, i) => {
        return (
          <StyledLink key={i} href={link.href}>
            {link.label === "Resume" ? (
              <span className="flex items-center gap-2">
                Resume <BsDownload className="text-purple-200 animate-bounce" />
              </span>
            ) : (
              link.label
            )}
          </StyledLink>
        );
      })}
    </div>
  );
}
