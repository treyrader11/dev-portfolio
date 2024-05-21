import Socials from "@/components/Socials";
import StyledLink from "@/components/StyledLink";
import { userData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { BsDownload } from "react-icons/bs";
import { SlPaperClip } from "react-icons/sl";

export default function Footer() {
  const { socialLinks, resumeUrl } = userData;
  return (
    <div
      className={cn(
        "flex",
        "justify-between",
        "text-xs",
        "gap-6",
        "mt-10",
        "font-mono"
      )}
    >
      <StyledLink href={`${resumeUrl}`}>
        <span className="flex items-center gap-2">
          Resume <BsDownload className="animate-bounce" />
        </span>
      </StyledLink>
      <StyledLink href={`${socialLinks.facebook}`}>Facebook</StyledLink>
      <StyledLink href={`${socialLinks.youtube}`}>Youtube</StyledLink>
      <StyledLink href={`${socialLinks.linkedin}`}>LinkedIn</StyledLink>
    </div>
  );
}
