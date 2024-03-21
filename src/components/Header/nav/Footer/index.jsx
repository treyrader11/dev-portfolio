import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <div className={cn("flex", "justify-between", "text-xs", "gap-10")}>
      <a>Awwwards</a>
      <a>Instagram</a>
      <a>Dribble</a>
      <a>LinkedIn</a>
    </div>
  );
}
