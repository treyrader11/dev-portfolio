import { projectsData } from "@/lib/data";
import { createScrollPositions } from "@/lib/utils";

const recentProjects = projectsData.filter(({ isRecent }) => isRecent);

const projectPositions = createScrollPositions(recentProjects);

export { recentProjects, projectPositions };
