"use client";

import { userData } from "@/lib/data";
import { cn } from "@/lib/utils";
import Experience from "./Experience";
import Link from "next/link";
import { useScroll, motion, useTransform } from "framer-motion";
import { useRef } from "react";
import TechStack from "./TechStack";
import Socials from "./Socials";
import { Portrait } from "./Portrait";
import ParalaxScrollText from "./ParalaxScrollText";
import {
  RiCodeSSlashLine,
  RiLayoutLine,
  RiSmartphoneLine,
  RiPaletteLine,
  RiShieldCheckLine,
  RiCustomerServiceLine,
  RiMapPinLine,
  RiTerminalBoxLine,
} from "react-icons/ri";

interface SocialItem {
  name: string;
  href: string;
}

const socials: SocialItem[] = [
  { name: "Youtube", href: userData.socialLinks.youtube },
  { name: "GitHub", href: userData.socialLinks.github },
  { name: "LinkedIn", href: userData.socialLinks.linkedin },
];

const heading = userData.about.title;

const services = [
  {
    icon: RiCodeSSlashLine,
    title: "Custom-Built, No Templates",
    desc: "Every project is built from scratch and tailored to your business. No cookie-cutter themes or off-the-shelf solutions.",
  },
  {
    icon: RiLayoutLine,
    title: "Incremental Delivery",
    desc: "You see real, working pages as they come together — not a big reveal at the end. Transparency is built into the process.",
  },
  {
    icon: RiSmartphoneLine,
    title: "Mobile-First & Responsive",
    desc: "Sites are designed for every screen size from the start. Contact forms, SEO basics, Google Analytics, and spam protection included.",
  },
  {
    icon: RiPaletteLine,
    title: "Rich Animations & Polish",
    desc: "Smooth page transitions, scroll-driven effects, and micro-interactions using GSAP and Framer Motion to make your site feel alive.",
  },
  {
    icon: RiShieldCheckLine,
    title: "You Own Everything",
    desc: "Full code and IP ownership transfers to you upon final payment. No platform lock-in, no recurring fees for access to your own site.",
  },
  {
    icon: RiCustomerServiceLine,
    title: "30-Day Post-Launch Support",
    desc: "After launch, I stick around for 30 days to handle bug fixes, tweaks, and any questions — included in the project price.",
  },
];

export default function Info() {
  const container = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const sm = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const md = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const lg = useTransform(scrollYProgress, [0, 1], [0, -250]);

  return (
    <section
      ref={container}
      className={cn(
        "bg-neutral-100",
        "pb-40",
        "min-h-screen",
        "text-gray-500",
        "mx-auto",
        "overflow-x-hidden"
      )}
    >
      <motion.div className={cn("pt-[10vh]")}>
        <div className="mx-[10vw]">
          <motion.h1
            className={cn(
              "m-0",
              "mt-2.5",
              "text-[5vw]",
              "leading-[5vw]",
              "text-gray-700",
              "font-pp-acma"
            )}
            style={{ y: sm }}
          >
            Hi there
          </motion.h1>

          <ParalaxScrollText text={heading} scrollYProgress={scrollYProgress} />
        </div>

        <div className="px-4 md:w-[900px] lg:w-[1100px] mx-auto">
          <div
            className={cn(
              "grid",
              "grid-cols-1",
              "md:grid-cols-[280px_1fr]",
              "pt-20",
              "gap-10",
              "lg:gap-16",
              "items-start"
            )}
          >
            {/* Sidebar - Contact & Job Opportunities */}
            <div className="space-y-8">
              <div>
                <h1 className={cn("text-xl", "font-semibold", "text-gray-700")}>
                  Contact
                </h1>
                <p className={cn("mt-4", "text-lg", "text-gray-500")}>
                  For any sort of help / enquiry, please shoot me an{" "}
                  <Link
                    href="/contact"
                    scroll={false}
                    className={cn(
                      "font-bold",
                      "text-gray-800",
                      "border-b-2",
                      "border-gray-800",
                      "hover:text-gray-600",
                      "transition-colors"
                    )}
                  >
                    email
                  </Link>{" "}
                  and I&apos;ll get back the same day.
                </p>
              </div>

              <div>
                <h1 className="text-xl font-semibold text-gray-700">
                  Job Opportunities
                </h1>
                <p className="relative mt-4 text-lg text-gray-500">
                  Not actively seeking new roles, but always open to exploring
                  exciting opportunities — whether that&apos;s full-time work,
                  contract projects, or creative collaborations. If you think
                  we&apos;d be a good fit, feel free to{" "}
                  <Link
                    href="/contact"
                    scroll={false}
                    className={cn(
                      "font-bold",
                      "text-gray-800",
                      "border-b-2",
                      "border-gray-800",
                      "hover:text-gray-600",
                      "transition-colors"
                    )}
                  >
                    reach out
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Main Content - Description */}
            <div className="space-y-4">
              {userData.about.description?.map((desc, i) => (
                <p key={i} className="text-xl leading-relaxed text-gray-500">
                  {desc}
                </p>
              ))}
            </div>
          </div>

          {/* Socials & Portrait */}
          <div
            className={cn(
              "pt-20",
              "relative",
              "grid",
              "grid-cols-1",
              "md:grid-cols-2",
              "gap-10",
              "mt-[5vh]",
              "overflow-hidden"
            )}
          >
            <Socials
              md={md}
              links={socials}
              className="w-full relative z-[1]"
            />
            <Portrait style={{ top: lg }} />
          </div>
        </div>

        <div className="w-full pt-40 sm:pt-20">
          <TechStack className="w-full" />
        </div>
      </motion.div>

      {/* Work With Me Section */}
      <div className="px-4 md:w-[900px] lg:w-[1100px] mx-auto pt-20">
        <div
          className={cn(
            "rounded-2xl",
            "bg-white",
            "border",
            "border-gray-200/80",
            "p-8",
            "md:p-12",
            "shadow-sm"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <RiTerminalBoxLine className="text-2xl text-gray-700" />
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 font-pp-acma">
              Work With Me
            </h2>
          </div>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl">
            I build websites and web applications for businesses and
            individuals — custom-coded, no templates, designed around what you
            actually need. Here&apos;s how it works.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="space-y-3">
                <div
                  className={cn(
                    "w-10",
                    "h-10",
                    "rounded-lg",
                    "bg-neutral-100",
                    "flex",
                    "items-center",
                    "justify-center",
                    "text-gray-700"
                  )}
                >
                  <service.icon className="text-xl" />
                </div>
                <h3 className="text-base font-semibold text-gray-800">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Pricing & Extras */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">
                  Pricing
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  Flexible, project-based pricing — no hourly billing surprises.
                  Payment is typically split into thirds: a deposit to kick
                  things off, a mid-build milestone, and the balance at launch.
                  Fair and straightforward.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">
                  Optional Add-Ons
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  Need more than a marketing site? I can add custom admin
                  dashboards, client portals, job application systems,
                  AI-powered chat, interactive maps, blog modules, project
                  portfolios, and more — built to fit your workflow.
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack & Location */}
          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              Built with Next.js, React, TypeScript, Tailwind CSS, PostgreSQL,
              Vercel, GSAP, Framer Motion, Cloudinary, Resend, and NextAuth.
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 flex-shrink-0">
              <RiMapPinLine className="text-gray-400" />
              Metairie, Louisiana — local &amp; remote clients welcome
            </p>
          </div>
        </div>
      </div>

      <Experience scrollYProgress={scrollYProgress} />
    </section>
  );
}
