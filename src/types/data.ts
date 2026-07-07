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
  current_project_url: string;
  current_project: string;
}

// An editable sidebar block on the /info page (Contact, Job Opportunities). The
// body may contain a single [label] token which renders as an inline link to
// /contact — e.g. "shoot me an [email] and I'll reply".
export interface InfoSection {
  heading: string;
  body: string;
}

export interface InfoSectionsData {
  contact: InfoSection;
  jobOpportunities: InfoSection;
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
  resumeDocxUrl: string;
  socialLinks: SocialLinks;
  hero: HeroData;
  about: AboutData;
  info: InfoSectionsData;
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
  // General/shared env vars — the common case (a Next.js app has one .env).
  general?: string[];
  frontend?: string[];
  backend?: string[];
}

// ---- Appearance (background noise) config -------------------------------
// Which devices a noise background is enabled on, and whether an area shows the
// black-noise grain or stays solid black. One entry per configurable area.
export interface AreaAppearance {
  bg: "solid" | "noise";
  devices: { mobile: boolean; desktop: boolean };
}

export type AppearanceArea =
  | "hero"
  | "footer"
  | "portfolioHeader"
  | "infoHeader"
  | "pricingHeader"
  | "contactHeader";

export type Appearance = Record<AppearanceArea, AreaAppearance>;

export interface ProjectDownloadLinks {
  frontend?: string;
  backend?: string;
  // A single source-code URL — a mono-repo or combined frontend/backend zip,
  // for projects that don't split into separate frontend/backend repos.
  source?: string;
  // Apple App Store URL. When present, the public project page shows a black
  // "Download on the App Store" CTA.
  ios?: string;
}

export interface ProjectImage {
  isPriority?: boolean;
  src: string;
  // Square app/project icon shown in the admin list (and available to the UI).
  icon?: string;
  // Product screenshots (in order). The first is the project's default shot.
  shots?: string[];
  // Chosen image (a shot or the poster) shown inside the Safari browser frame on
  // the public project detail page. Falls back to the project video when unset.
  safari?: string;
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
