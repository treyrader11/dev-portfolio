// Company Logos
import torsh from "/public/images/company/logo/torsh.png";
import vouzot from "/public/images/company/logo/vouzot.png";
import pasteui from "/public/images/company/logo/pasteui.png";
import evolvemediaai from "/public/images/company/logo/evolvemediaai.png";

// Technology Stack Images
import mern from "/public/images/tech/mern.png";
import next from "/public/images/tech/next.png";
import expo from "/public/images/tech/expo.png";
import vite from "/public/images/tech/vite.png";

// Reference Images
import jason from "/public/images/references/jason.png";
import daniel from "/public/images/references/daniel.png";
import wilson from "/public/images/references/wilson.png";
import janine from "/public/images/references/janine.png";

import type { StaticImageData } from "next/image";
import type {
  UserData,
  Experience,
  ProjectData,
  Skill,
  MetaDescriptions,
  CtaTexts,
  TagColors,
  Reference,
} from "@/types/data";

// ============================================
// SECTION 1: USER DATA & PROFILE
// ============================================

export const userData: UserData = {
  // Basic Info
  githubUsername: "treyrader11",
  name: "Trey Rader",
  designation: "Senior React Native & Web Developer",
  avatarUrl: "/avatar.png",
  email: "developertrey@gmail.com",
  phone: "504.756.4538",
  address: "Metairie, Louisiana",
  resumeUrl: "/resume.pdf",
  // resumeUrl:
  //   "https://drive.google.com/file/d/1LMM6St-8DNl9VFycHdkL7J5qzSnZfNiE/view?usp=sharing",

  // Social Links
  socialLinks: {
    linkedin: "https://linkedin.com/in/trey-rader",
    github: "https://github.com/treyrader11",
    youtube: "https://youtube.com/channel/developertrey",
  },

  // Hero Section
  hero: {
    phrase:
      "Senior developer specializing in React Native and full-stack web development, delivering high-quality mobile and web experiences with Next.js, TypeScript, and modern tooling.",
  },

  // About Section
  about: {
    title:
      "Senior React Native & Web Developer building performant mobile and full-stack applications",

    description: [
      `With over 8 years of hands-on development experience, I work across the full spectrum of modern JavaScript — from React Native mobile apps to full-stack web applications built with Next.js, TypeScript, and PostgreSQL. Currently leading frontend development at Evolve Media AI, where I architect and build AI-powered media tools using the Expo ecosystem, NativeWind, and TanStack Query.`,

      `My expertise spans the entire development lifecycle — designing reusable component libraries, implementing advanced caching strategies, building server-rendered web apps with Next.js, and collaborating with AI engineers to ship production-grade features. I'm passionate about clean code, performance optimization, and choosing the right tool for each problem.`,

      `On the web side, I build custom applications from scratch using Next.js, React, Tailwind CSS, Drizzle ORM, and Vercel — no templates, no shortcuts. I've shipped everything from client-facing marketing sites with rich animations (GSAP, Framer Motion) to internal admin dashboards, invoice systems, and Jira integrations. Whether it's mobile or web, I bring the same attention to architecture, accessibility, and polish.`,
    ],

    description_concise: [
      `I'm a Senior React Native & Web Developer with 8+ years of experience building cross-platform mobile and full-stack web applications. Currently at Evolve Media AI, I lead frontend development for AI-powered media tools using the Expo stack, TypeScript, and modern architecture patterns.`,

      `I specialize in performance optimization, component architecture, and creating seamless user experiences across mobile and web. My technical toolkit includes React Native, Next.js, TypeScript, PostgreSQL, TanStack Query, and animation libraries like Framer Motion and GSAP. I'm passionate about clean code, accessibility, and shipping polished products.`,
    ],

    current_project_url: "https://www.evolvemedia.ai",
    current_project: "Evolve Media AI",
  },

  // Experience Highlights (Resume Format)
  experience_highlights: [
    {
      role: "React Native Developer",
      company: "Evolve Media AI",
      period: "August 2024 - Present",
      location: "New Orleans, LA",
      highlights: [
        "Lead frontend development for AI-driven mobile app using Expo, React Native, and TypeScript",
        "Architected 25+ reusable UI components with consistent, accessible styling",
        "Implemented advanced caching with TanStack Query and optimistic updates",
        "Refactored codebase for full type safety and modern dependency management",
        "Collaborate with AI engineers to integrate intelligent media tools",
      ],
    },
    {
      role: "Junior Software Engineer",
      company: "Torsh, Inc.",
      period: "April 2017 - August 2019",
      location: "New Orleans, LA",
      highlights: [
        "Developed features for large-scale web platform and internal CMS",
        "Implemented frontend functionality from design specs with UX collaboration",
        "Worked in Agile environment with peer reviews and weekly demos",
        "Introduced automated test coverage improvements",
        "Authored technical documentation for development continuity",
      ],
    },
  ],

  // Technical Expertise
  technical_expertise: {
    mobile: ["React Native", "Expo", "NativeWind", "Reanimated", "Moti"],
    frontend: [
      "React",
      "Next.js",
      "TypeScript",
      "Framer Motion",
      "GSAP",
      "Tailwind CSS",
    ],
    backend: ["Node.js", "Express", "GraphQL", "Prisma", "REST APIs"],
    databases: ["MongoDB", "MySQL", "PostgreSQL"],
    tools: ["Git", "VSCode", "Figma", "TanStack Query", "Zustand"],
  },

  // Professional Summaries
  professional_summaries: {
    short:
      "Senior React Native Developer with 8+ years building performant cross-platform applications using React, Expo, and TypeScript.",

    medium:
      "Senior React Native Developer specializing in cross-platform mobile applications with 8+ years of experience. Expert in the Expo ecosystem, TypeScript, and modern frontend architecture. Proven track record of delivering AI-powered solutions, optimizing performance, and leading technical initiatives.",

    long: "Senior React Native Developer with 8+ years of hands-on experience crafting cross-platform mobile and web applications. Specialized in React, Expo, and TypeScript with demonstrated success leading frontend architecture, optimizing performance, and delivering AI-powered mobile solutions. Strong collaborator with design and backend teams, committed to high code quality standards and exceptional user experiences. Passionate about building performant, maintainable, and visually refined mobile products.",
  },
};

// ============================================
// SECTION 2: WORK EXPERIENCE & PROJECTS
// ============================================

// Combined: All Experience (Work + Personal Projects)
export const experiences: Experience[] = [
  {
    title: "React Native Developer",
    company_name: "Evolve Media AI",
    icon: evolvemediaai,
    iconBg: "#383E56",
    date: "August 2024 - Present",
    website_url: "https://www.evolvemedia.ai",
    points: [
      "Lead frontend development for AI-driven mobile app using Expo, React Native, and TypeScript",
      "Architected 25+ reusable UI components with consistent, accessible styling",
      "Implemented advanced caching with TanStack Query and optimistic updates",
      "Refactored codebase for full type safety and modern dependency management",
      "Collaborate with AI engineers to integrate intelligent media tools",
      "Currently leading development of the company's corporate website",
      "Enhanced accessibility and UI consistency across all design implementations",
    ],
  },
  {
    title: "Full-Stack Developer",
    company_name: "Vouzot",
    icon: vouzot,
    iconBg: "#d6d7dc",
    date: "2024 - In Development",
    website_url: "https://vouzot-test.vercel.app",
    points: [
      "Building full-stack authentication and subscription platform with Next.js 14 App Router",
      "Implementing Prisma ORM with MongoDB for scalable data management",
      "Creating responsive UI with Tailwind CSS, Shadcn UI, and Framer Motion animations",
      "Integrating Stripe payment processing and subscription management system",
      "Developing with TypeScript, Zod validation, and React Hook Form for type safety",
      "Managing state with Zustand and implementing TanStack Table for data display",
      "Architecting secure authentication flows with NextAuth and OAuth providers",
    ],
  },
  {
    title: "Frontend Developer",
    company_name: "PasteUI",
    icon: pasteui,
    iconBg: "#e3e3e3",
    date: "2024 - In Development",
    website_url: "https://www.pasteui.io",
    points: [
      "Developing modern component library and design system with Next.js 13",
      "Creating reusable, accessible UI components with Shadcn UI and Tailwind CSS",
      "Building comprehensive documentation and component playground",
      "Implementing responsive layouts with modern CSS techniques and animations",
      "Focusing on accessibility (a11y) and WCAG compliance across all components",
      "Utilizing TypeScript for complete type safety and better developer experience",
      "Establishing design tokens and theming system for consistent styling",
    ],
  },
  {
    title: "Junior Software Engineer",
    company_name: "Torsh, Inc.",
    icon: torsh,
    iconBg: "#E6DEDD",
    date: "April 2017 - August 2019",
    website_url: "https://www.torsh.com",
    points: [
      "Developed features for large-scale web platform and internal CMS",
      "Implemented frontend functionality from design specs with UX collaboration",
      "Worked in Agile environment with peer reviews and weekly demos",
      "Performed manual acceptance testing and introduced automated test coverage",
      "Authored technical documentation for development continuity and onboarding",
      "Integrated 3rd-party APIs and built CRUD operations",
    ],
  },
];

// Separated: Work Experience Only
export const workExperience: Experience[] = [
  {
    title: "React Native Developer",
    company_name: "Evolve Media AI",
    icon: evolvemediaai,
    iconBg: "#383E56",
    date: "August 2024 - Present",
    website_url: "https://www.evolvemediaai.com",
    points: [
      "Lead frontend development for AI-driven mobile app using Expo, React Native, and TypeScript",
      "Architected 25+ reusable UI components with consistent, accessible styling",
      "Implemented advanced caching with TanStack Query and optimistic updates",
      "Refactored codebase for full type safety and modern dependency management",
      "Collaborate with AI engineers to integrate intelligent media tools",
      "Currently leading development of the company's corporate website",
      "Enhanced accessibility and UI consistency across all design implementations",
    ],
  },
  {
    title: "Junior Software Engineer",
    company_name: "Torsh, Inc.",
    icon: torsh,
    iconBg: "#E6DEDD",
    date: "April 2017 - August 2019",
    website_url: "https://www.torsh.com",
    points: [
      "Developed features for large-scale web platform and internal CMS",
      "Implemented frontend functionality from design specs with UX collaboration",
      "Worked in Agile environment with peer reviews and weekly demos",
      "Performed manual acceptance testing and introduced automated test coverage",
      "Authored technical documentation for development continuity and onboarding",
      "Integrated 3rd-party APIs and built CRUD operations",
    ],
  },
];

// Separated: Personal Projects Only
export const personalProjects: Experience[] = [
  {
    title: "Full-Stack Developer",
    company_name: "Vouzot",
    icon: vouzot,
    iconBg: "#d6d7dc",
    date: "2024 - In Development",
    website_url: "https://www.vouzot.com",
    points: [
      "Building full-stack authentication and subscription platform with Next.js 14 App Router",
      "Implementing Prisma ORM with MongoDB for scalable data management",
      "Creating responsive UI with Tailwind CSS, Shadcn UI, and Framer Motion animations",
      "Integrating Stripe payment processing and subscription management system",
      "Developing with TypeScript, Zod validation, and React Hook Form for type safety",
      "Managing state with Zustand and implementing TanStack Table for data display",
      "Architecting secure authentication flows with NextAuth and OAuth providers",
    ],
  },
  {
    title: "Frontend Developer",
    company_name: "PasteUI",
    icon: pasteui,
    iconBg: "#e3e3e3",
    date: "2024 - In Development",
    website_url: "https://www.pasteui.io",
    points: [
      "Developing modern component library and design system with Next.js 13",
      "Creating reusable, accessible UI components with Shadcn UI and Tailwind CSS",
      "Building comprehensive documentation and component playground",
      "Implementing responsive layouts with modern CSS techniques and animations",
      "Focusing on accessibility (a11y) and WCAG compliance across all components",
      "Utilizing TypeScript for complete type safety and better developer experience",
      "Establishing design tokens and theming system for consistent styling",
    ],
  },
];

// ============================================
// SECTION 3: PROJECTS SHOWCASE DATA
// ============================================

export const projectsData: ProjectData[] = [
  {
    title: "Vouzot",
    desc: "Full-stack authentication and subscription platform built with Next.js 14, featuring AI-powered content management and payment processing.",
    color: "#d6d7dc",
    isPriority: false,
    video_key: "QKGIvW886dc",
    stack: "Next.js",
    tech_image: next.src,
    tags: ["next", "shadcn", "prisma", "next-auth", "mongodb"],
    category: "Next.js",
    technology_feature: [
      "Tailwind CSS",
      "Next.js 14 (App Router)",
      "Zustand",
      "TypeScript",
      "Zod",
      "React Hook Form",
      "Prisma",
      "MongoDB",
      "Shadcn UI",
      "Framer Motion",
      "GSAP",
      "TanStack Table",
      "Stripe",
      "Storybook",
      "Docker",
    ],
    packages: {
      frontend: [
        "@tanstack/react-table",
        "next-auth",
        "zustand",
        "framer-motion",
        "gsap",
        "zod",
        "react-hook-form",
        "@stripe/stripe-js",
      ],
    },
    env: {
      frontend: [
        "DATABASE_URL",
        "DIRECT_URL",
        "GITHUB_CLIENT_ID",
        "GITHUB_CLIENT_SECRET",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "AUTH_SECRET",
        "RESEND_API_KEY",
        "NEXT_PUBLIC_APP_URL",
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET",
      ],
    },
    youtube_link: "https://youtu.be/AxQ_Eli8gtk",
    github_link: "https://github.com/treyrader11/Vouzot",
    download_links: {
      frontend:
        "https://github.com/treyrader11/Vouzot/archive/refs/heads/main.zip",
    },
    // project_image: "vouzot.png",
    project_image: "decimal.png",
    project_video: "code-editor1.mp4",
    image: {
      isPriority: true,
      src: "decimal.png",
      // src: "vouzot.png",
    },
    website_url: "https://www.vouzot-test.vercel.app",
    isRecent: true,
  },
  {
    title: "PasteUI",
    desc: "Modern component library and design system featuring customizable UI components, built with Next.js and Shadcn UI for rapid application development.",
    color: "#e3e3e3",
    isPriority: true,
    video_key: "zHL1eT87OCw",
    stack: "Next.js",
    category: "Next.js",
    tags: ["next", "shadcn", "typescript", "tailwind"],
    tech_image: next.src,
    technology_feature: [
      "Tailwind CSS",
      "Next.js 13",
      "TypeScript",
      "Shadcn UI",
      "Framer Motion",
      "React Hook Form",
      "Zod",
    ],
    packages: {
      frontend: [
        "@radix-ui/react-primitives",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "framer-motion",
      ],
    },
    env: {
      frontend: ["NEXT_PUBLIC_APP_URL"],
    },
    youtube_link: "https://youtu.be/yF1oJ7wzvWY",
    github_link: "https://github.com/treyrader11/PasteUI",
    download_links: {
      frontend:
        "https://github.com/treyrader11/PasteUI/archive/refs/heads/main.zip",
    },
    project_image: "funny.png",
    project_video: "code-editor2.mp4",
    image: {
      isPriority: true,
      src: "funny.png",
    },
    website_url: "https://www.pasteui.io",
    isRecent: true,
  },
  {
    title: "Musiana",
    desc: "Full-stack music streaming platform with real-time collaboration features, built using the MERN stack with Firebase authentication and cloud storage.",
    color: "#e3e5e7",
    video_key: "GJyPpc8qaHA",
    category: "MERN",
    tech_image: mern.src,
    tags: ["react", "sass", "mongodb", "jwt", "express", "node"],
    stack: "MERN",
    technology_feature: [
      "React",
      "Redux",
      "Sass",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Firebase",
      "Cloudinary",
      "JWT",
    ],
    packages: {
      frontend: [
        "@reduxjs/toolkit",
        "firebase",
        "react-redux",
        "react-icons",
        "sass",
      ],
      backend: [
        "express",
        "mongoose",
        "jsonwebtoken",
        "bcrypt",
        "cloudinary",
        "dotenv",
      ],
    },
    env: {
      frontend: [
        "VITE_APP_BACKEND_URL",
        "VITE_APP_FIREBASE_KEY",
        "VITE_APP_CLOUD_NAME",
      ],
      backend: [
        "MONGO_URI",
        "JWT_SECRET",
        "JWT_LIFETIME",
        "CLOUD_NAME",
        "CLOUD_API_KEY",
        "CLOUD_API_SECRET",
        "PORT",
      ],
    },
    youtube_link: "https://youtu.be/yF1oJ7wzvWY",
    github_link: "https://github.com/treyrader11/musiana-client",
    download_links: {
      frontend:
        "https://github.com/treyrader11/musiana-client/archive/refs/heads/main.zip",
      backend:
        "https://github.com/treyrader11/musiana-server/archive/refs/heads/main.zip",
    },
    project_image: "c2.png",
    project_video: "tech-meeting.mp4",
    image: {
      isPriority: true,
      src: "c2.png",
    },
    website_url: "https://musiana.vercel.app",
    isRecent: true,
  },
];

// ============================================
// SECTION 4: SKILLS DATA
// ============================================

export const skills: Skill[] = [
  {
    skill_name: "HTML 5",
    Image: "/html.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "CSS",
    Image: "/css.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "JavaScript",
    Image: "/js.png",
    width: 65,
    height: 65,
  },
  {
    skill_name: "TypeScript",
    Image: "/ts.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "React",
    Image: "/react.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "React Native",
    Image: "/ReactNative .png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Next.js",
    Image: "/next.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Redux",
    Image: "/redux.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "TanStack Query",
    Image: "/reactquery.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Tailwind CSS",
    Image: "/tailwind.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Material UI",
    Image: "/mui.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Framer Motion",
    Image: "/framer.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "GSAP",
    Image: "/gsap.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Node.js",
    Image: "/node-js.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Express",
    Image: "/express.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "MongoDB",
    Image: "/mongodb.png",
    width: 40,
    height: 40,
  },
  {
    skill_name: "PostgreSQL",
    Image: "/postger.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "MySQL",
    Image: "/mysql.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Prisma",
    Image: "/prisma.webp",
    width: 70,
    height: 70,
  },
  {
    skill_name: "GraphQL",
    Image: "/graphql.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Firebase",
    Image: "/Firebase.png",
    width: 55,
    height: 55,
  },
  {
    skill_name: "Docker",
    Image: "/docker.webp",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Figma",
    Image: "/figma.png",
    width: 50,
    height: 50,
  },
  {
    skill_name: "Git",
    Image: "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png",
    width: 70,
    height: 70,
  },
];

export const frontendSkills: Skill[] = [
  {
    skill_name: "HTML 5",
    Image: "/html.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "CSS",
    Image: "/css.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "JavaScript",
    Image: "/js.png",
    width: 65,
    height: 65,
  },
  {
    skill_name: "TypeScript",
    Image: "/ts.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "React",
    Image: "/react.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Next.js",
    Image: "/next.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Redux",
    Image: "/redux.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "TanStack Query",
    Image: "/reactquery.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Tailwind CSS",
    Image: "/tailwind.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Material UI",
    Image: "/mui.png",
    width: 80,
    height: 80,
  },
];

export const backendSkills: Skill[] = [
  {
    skill_name: "Node.js",
    Image: "/node-js.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Express",
    Image: "/express.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "MongoDB",
    Image: "/mongodb.png",
    width: 40,
    height: 40,
  },
  {
    skill_name: "Firebase",
    Image: "/Firebase.png",
    width: 55,
    height: 55,
  },
  {
    skill_name: "PostgreSQL",
    Image: "/postger.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "MySQL",
    Image: "/mysql.png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Prisma",
    Image: "/prisma.webp",
    width: 70,
    height: 70,
  },
  {
    skill_name: "GraphQL",
    Image: "/graphql.png",
    width: 80,
    height: 80,
  },
];

export const fullstackSkills: Skill[] = [
  {
    skill_name: "React Native",
    Image: "/ReactNative .png",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Docker",
    Image: "/docker.webp",
    width: 70,
    height: 70,
  },
  {
    skill_name: "Figma",
    Image: "/figma.png",
    width: 50,
    height: 50,
  },
];

export const otherSkills: Skill[] = [
  {
    skill_name: "NextAuth",
    Image: "https://next-auth.js.org/img/logo/logo-sm.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "JWT",
    Image:
      "https://seeklogo.com/images/J/json-web-tokens-jwt-io-logo-C003DEC47A-seeklogo.com.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Framer Motion",
    Image: "/framer.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Stripe",
    Image: "/stripe.webp",
    width: 80,
    height: 80,
  },
];

// ============================================
// SECTION 5: SEO & METADATA
// ============================================

export const metaDescriptions: MetaDescriptions = {
  home: "Trey Rader - Senior React Native Developer specializing in cross-platform mobile applications with React, Expo, and TypeScript. Based in New Orleans, LA.",
  about:
    "Learn about Trey Rader's 8+ years of experience in React Native development, mobile architecture, and building AI-powered applications.",
  projects:
    "Explore mobile and web projects built by Trey Rader using React Native, Next.js, TypeScript, and modern development tools.",
  contact:
    "Get in touch with Trey Rader for React Native development, mobile app architecture consulting, or collaboration opportunities.",
};

export const ctaTexts: CtaTexts = {
  viewResume: "View My Resume",
  downloadResume: "Download Resume",
  getInTouch: "Let's Connect",
  viewProjects: "See My Work",
  contactMe: "Get In Touch",
  hireMe: "Available for Work",
};

export const tagColors: TagColors = {
  react: "teal",
  mongodb: "green",
  sass: "red",
  shadcn: "purple",
  next: "blue",
  express: "orange",
  node: "green",
  typescript: "blue",
  tailwind: "cyan",
  jwt: "pink",
  "next-auth": "violet",
  prisma: "aqua",
  default: "#000000",
};

// ============================================
// SECTION 6: HELPER FUNCTIONS
// ============================================

const companyIcons: Record<string, StaticImageData> = {
  "Evolve Media AI": evolvemediaai,
  "Torsh, Inc.": torsh,
  Vouzot: vouzot,
  PasteUI: pasteui,
};

const companyIconBgs: Record<string, string> = {
  "Evolve Media AI": "#383E56",
  "Torsh, Inc.": "#E6DEDD",
  Vouzot: "#d6d7dc",
  PasteUI: "#e3e3e3",
};

const companyWebsites: Record<string, string> = {
  "Evolve Media AI": "https://www.evolvemediaai.com",
  "Torsh, Inc.": "https://www.torsh.com",
  Vouzot: "https://www.vouzot.com",
  PasteUI: "https://www.pasteui.io",
};

function getCompanyIcon(company: string): StaticImageData {
  return companyIcons[company] || torsh;
}

function getCompanyIconBg(company: string): string {
  return companyIconBgs[company] || "#383E56";
}

function getCompanyWebsite(company: string): string {
  return companyWebsites[company] || "#";
}

// Generate experiences dynamically from userData (optional)
export const generateExperiences = (): Experience[] => {
  return userData.experience_highlights.map((exp) => ({
    title: exp.role,
    company_name: exp.company,
    icon: getCompanyIcon(exp.company),
    iconBg: getCompanyIconBg(exp.company),
    date: exp.period,
    website_url: getCompanyWebsite(exp.company),
    points: exp.highlights,
  }));
};

// ============================================
// SECTION: REFERENCES
// ============================================

export interface ReferenceData {
  image_url: string;
  desc: string;
  name: string;
  title: string;
}

export const references: ReferenceData[] = [
  {
    image_url: (jason as StaticImageData).src,
    name: "Jason St. Cyr",
    title: "Engineering Manager",
    desc: "Trey consistently delivers high-quality work and is a pleasure to work with. His technical skills and attention to detail make him an invaluable team member.",
  },
  {
    image_url: (daniel as StaticImageData).src,
    name: "Daniel Martinez",
    title: "Senior Developer",
    desc: "Working with Trey has been a fantastic experience. He brings creative solutions to complex problems and always goes above and beyond.",
  },
  {
    image_url: (wilson as StaticImageData).src,
    name: "Wilson Chen",
    title: "Product Manager",
    desc: "Trey's ability to translate product requirements into polished, performant applications is remarkable. He's a true professional.",
  },
  {
    image_url: (janine as StaticImageData).src,
    name: "Janine Williams",
    title: "UX Designer",
    desc: "Trey has an excellent eye for detail and always ensures the final product matches the design vision. A great collaborator.",
  },
];

// ============================================
// SECTION: TESTIMONIALS
// ============================================

export interface TestimonialData {
  name: string;
  quote: string;
  image_url: StaticImageData;
}

export const testimonials: TestimonialData[] = [
  {
    image_url: jason,
    name: "Jason St. Cyr",
    quote: "Trey consistently delivers high-quality work and is a pleasure to work with. His technical skills and attention to detail make him an invaluable team member.",
  },
  {
    image_url: daniel,
    name: "Daniel Martinez",
    quote: "Working with Trey has been a fantastic experience. He brings creative solutions to complex problems and always goes above and beyond.",
  },
  {
    image_url: wilson,
    name: "Wilson Chen",
    quote: "Trey's ability to translate product requirements into polished, performant applications is remarkable. He's a true professional.",
  },
  {
    image_url: janine,
    name: "Janine Williams",
    quote: "Trey has an excellent eye for detail and always ensures the final product matches the design vision. A great collaborator.",
  },
];
