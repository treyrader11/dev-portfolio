import { projectsData } from "@/lib/data";
import { createScrollPositions } from "@/lib/utils";
import type { ProjectData, ScrollPosition } from "@/types";

const recentProjects: ProjectData[] = projectsData.filter(({ isRecent }) => isRecent);

const projectPositions: ScrollPosition[] = createScrollPositions(recentProjects);

export { recentProjects, projectPositions };
