import LaptopMockup from "./laptop-mockup";
import { Carousel } from "./carousel";
import type { ProjectData, ProjectImage } from "@/types/data";

interface Props {
  project: ProjectData;
}

export default function LatestWorkCardFront({ project }: Props) {
  const image =
    project.image && typeof project.image === "object"
      ? (project.image as ProjectImage)
      : null;

  const shots = (image?.shots ?? []).filter(Boolean);
  const fallback = project.project_image || image?.src || "";

  // Multiple product shots → a horizontal carousel, each shot in a laptop frame.
  if (shots.length >= 2) {
    return (
      <Carousel
        overlayControls
        // Anchored to the laptop screen (see SCREEN in laptop-mockup): arrows on
        // the screen's left/right edges, dots over the screen's top.
        prevClassName="left-[16%] top-1/2 -translate-y-1/2"
        nextClassName="right-[16%] top-1/2 -translate-y-1/2"
        // Dots sit over the top of the screen — a touch higher on mobile.
        dotsClassName="top-[27%] left-1/2 -translate-x-1/2 sm:top-[35%]"
        slides={shots.map((shot, i) => (
          <LaptopMockup
            key={i}
            src={shot}
            alt={`${project.title} shot ${i + 1}`}
            className="w-full"
          />
        ))}
      />
    );
  }

  // One (or none) → the default shot / poster in a single laptop frame.
  return (
    <LaptopMockup
      src={shots[0] || fallback}
      alt={`${project.title} preview`}
      className="w-full"
    />
  );
}
