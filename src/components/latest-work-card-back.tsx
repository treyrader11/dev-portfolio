import Rounded from "@/components/Rounded";
import { cn, slugify } from "@/lib/utils";
import LaptopMockup from "./laptop-mockup";
import type { ProjectData } from "@/types/data";

interface Props {
  project: ProjectData;
}

// Back face of the flip card — the same laptop frame as the front, but with the
// mockup-back image inside, and the "View" button overlaid on the screen. Sits
// inside a `relative` wrapper (from LatestWorkFlipCard) so the button centers over
// the mockup and layers above the frame.
export default function LatestWorkCardBack({ project }: Props) {
  return (
    <>
      <LaptopMockup
        src="/shots/mockup-back.png"
        alt={`${project.title} — view project`}
        className="w-full"
      />
      <Rounded
        text="View"
        backgroundColor="purple"
        className={cn(
          "bg-purple-400",
          "p-4",
          "absolute",
          "left-1/2",
          "top-1/2",
          "z-20",
          "-translate-x-1/2",
          "-translate-y-1/2"
        )}
        href={`/portfolio/${slugify(project.title)}`}
      />
    </>
  );
}
