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
