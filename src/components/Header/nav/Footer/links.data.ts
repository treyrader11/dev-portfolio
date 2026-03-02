import { userData } from "@/lib/data";
import type { Route } from "@/types";

const { socialLinks, resumeUrl } = userData;

export const socials: Route[] = [
  { href: resumeUrl, label: "Resume" },
  { href: socialLinks.youtube, label: "Youtube" },
  { href: socialLinks.linkedin, label: "LinkedIn" },
];
