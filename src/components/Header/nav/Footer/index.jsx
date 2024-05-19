import { userData } from "@/lib/data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Footer() {
  const { socialLinks, resumeUrl } = userData;
  return (
    <div
      className={cn("flex", "justify-between", "text-xs", "gap-10", "mt-10")}
    >
      <Link href={`${resumeUrl}`}>Resume</Link>
      <Link href={`${socialLinks.instagram}`}>Instagram</Link>
      <Link href={`${socialLinks.youtube}`}>Youtube</Link>
      <Link href={`${socialLinks.linkedin}`}>LinkedIn</Link>
    </div>
  );
}
