import LaptopMockup from "./laptop-mockup";
import type { ProjectData } from "@/types/data";

interface Props {
  project: ProjectData;
}

export default function ProjectCardFront({ project }: Props) {
  // Prefer project_image (Cloudinary upload), fall back to image.src (legacy)
  const imageSrc =
    project.project_image ||
    (project.image && typeof project.image === "object"
      ? (project.image as { src: string }).src
      : (project.image as string)) ||
    "";

  return (
    <LaptopMockup
      src={imageSrc}
      alt={`${project.title} preview`}
      className="w-full"
    />
  );
}
