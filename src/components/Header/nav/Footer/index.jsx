import StyledLink from "@/components/StyledLink";
import { userData } from "@/lib/data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Footer() {
  const { socialLinks, resumeUrl } = userData;
  return (
    <div className={cn("flex justify-between text-xs gap-10 mt-10")}>
      <StyledLink href={`${resumeUrl}`}>Resume</StyledLink>
      <StyledLink href={`${socialLinks.instagram}`}>Instagram</StyledLink>
      <StyledLink href={`${socialLinks.youtube}`}>Youtube</StyledLink>
      <StyledLink href={`${socialLinks.linkedin}`}>LinkedIn</StyledLink>
    </div>
  );
}
