const { userData } = require("@/lib/data");

const { socialLinks, resumeUrl } = userData;

export const socials = [
  { href: resumeUrl, label: "Resume" },
  { href: socialLinks.facebook, label: "Facebook" },
  { href: socialLinks.youtube, label: "Youtube" },
  { href: socialLinks.linkedin, label: "LinkedIn" },
];
