import Rounded from "@/components/Rounded";
import { cn, slugify } from "@/lib/utils";
import blank_shot from "/public/shots/blank-shot.png";
import type { ProjectData } from "@/types/data";

interface Props {
  project: ProjectData;
}

// Back face of the flip card — the blank laptop backing with the "View" button
// overlay. Styling matches the previous back face exactly; the button links to
// the project's public details page.
export default function ProjectCardBack({ project }: Props) {
  return (
    <div
      style={{
        backgroundImage: `url(${blank_shot.src})`,
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      }}
      className={cn(
        "h-full",
        "w-full",
        "flex",
        "items-center",
        "flex-col",
        "justify-center",
      )}
    >
      <Rounded
        text="View"
        backgroundColor="purple"
        className={cn("bg-purple-400", "p-4", "absolute")}
        href={`/portfolio/${slugify(project.title)}`}
      />
    </div>
  );
}
