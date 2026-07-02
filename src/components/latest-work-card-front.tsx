import LaptopMockup from "./laptop-mockup";
import type { ProjectData, ProjectImage } from "@/types/data";

interface Props {
  project: ProjectData;
}

export default function LatestWorkCardFront({ project }: Props) {
  const image =
    project.image && typeof project.image === "object"
      ? (project.image as ProjectImage)
      : null;

  // The default product shot is the first uploaded shot; fall back to the
  // project poster, then the legacy image src.
  const imageSrc =
    image?.shots?.[0] || project.project_image || image?.src || "";

  return (
    <LaptopMockup
      src={imageSrc}
      alt={`${project.title} preview`}
      className="w-full"
    />
  );
}
