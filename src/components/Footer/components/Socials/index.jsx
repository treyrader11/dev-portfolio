import StyledLink from "@/components/StyledLink";
import { userData } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Socials({ className }) {
  const { socialLinks } = userData;
  return (
    <div
      className={cn(
        "border-b-[.5px]",
        "border-light-100/80",
        "md:border-none",
        "space-y-2",
        className
      )}
    >
      <h5 className="text-[10px] uppercase text-light-100">Socials</h5>
      <span className={cn("flex gap-3.5")}>
        <StyledLink target="_blank" href={socialLinks.github}>
          Github
        </StyledLink>
        <StyledLink target="_blank" href={socialLinks.youtube}>
          Youtube
        </StyledLink>
        <StyledLink target="_blank" href={socialLinks.instagram}>
          Instagram
        </StyledLink>
        <StyledLink target="_blank" href={socialLinks.linkedin}>
          Linkedin
        </StyledLink>
      </span>
    </div>
  );
}
