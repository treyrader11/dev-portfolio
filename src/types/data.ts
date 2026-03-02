import type { StaticImageData } from "next/image";

export interface SocialLinks {
  linkedin: string;
  github: string;
  youtube: string;
}

export interface HeroData {
  phrase: string;
}

export interface AboutData {
  title: string;
  description: string[];
  description_concise: string[];
  current_project_url: string;
  current_project: string;
}

export interface ExperienceHighlight {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface TechnicalExpertise {
  mobile: string[];
  frontend: string[];
  backend: string[];
  databases: string[];
  tools: string[];
}

export interface ProfessionalSummaries {
  short: string;
  medium: string;
  long: string;
}

export interface UserData {
  githubUsername: string;
  name: string;
  designation: string;
  avatarUrl: string;
  email: string;
  phone: string;
  address: string;
  resumeUrl: string;
  socialLinks: SocialLinks;
  hero: HeroData;
  about: AboutData;
  experience_highlights: ExperienceHighlight[];
  technical_expertise: TechnicalExpertise;
  professional_summaries: ProfessionalSummaries;
}

export interface Experience {
  title: string;
  company_name: string;
  icon: StaticImageData;
  iconBg: string;
  date: string;
  website_url: string;
  points: string[];
}

export interface ProjectPackages {
  frontend?: string[];
  backend?: string[];
}

export interface ProjectEnv {
  frontend?: string[];
  backend?: string[];
}

export interface ProjectDownloadLinks {
  frontend?: string;
  backend?: string;
}

export interface ProjectImage {
  isPriority?: boolean;
  src: string;
}

export interface ProjectData {
  title: string;
  desc: string;
  color: string;
  isPriority?: boolean;
  video_key: string;
  stack: string;
  tech_image: string;
  tags: string[];
  category: string;
  technology_feature: string[];
  packages: ProjectPackages;
  env: ProjectEnv;
  youtube_link: string;
  github_link: string;
  download_links: ProjectDownloadLinks;
  project_image: string;
  project_video: string;
  image: ProjectImage;
  website_url: string;
  isRecent?: boolean;
}

export interface Skill {
  skill_name: string;
  Image: string;
  width: number;
  height: number;
}

export interface MetaDescriptions {
  home: string;
  about: string;
  projects: string;
  contact: string;
}

export interface CtaTexts {
  viewResume: string;
  downloadResume: string;
  getInTouch: string;
  viewProjects: string;
  contactMe: string;
  hireMe: string;
}

export type TagColors = Record<string, string>;

export interface Reference {
  name: string;
  role: string;
  company: string;
  image: StaticImageData;
  text: string;
}
