"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  SiNike,
  Si3M,
  SiAbstract,
  SiAdobe,
  SiAirtable,
  SiAmazon,
  SiBox,
  SiBytedance,
  SiChase,
  SiCloudbees,
  SiBurton,
  SiBmw,
  SiHeroku,
  SiBuildkite,
  SiCouchbase,
  SiDailymotion,
  SiDeliveroo,
  SiEpicgames,
  SiGenius,
  SiGodaddy,
} from "react-icons/si";

export default function TeckStack({ className }) {
  return (
    <section className={cn("py-24", className)}>
      {/* <h1
        className={cn(
          "inline-block",
          "px-2",
          "py-1",
          "text-3xl",
          "font-bold",
          "bg-primary",
          "rounded-md",
          "text-gray-50",
          "mb-28"
        )}
      >
        Tech Stack
      </h1> */}
      <div
        className={cn(
          "flex",
          "translate-y-1/2",
          "rotate-[7deg]",
          "scale-110",
          "overflow-hidden",
          "border-y-4",
          "border-neutral-900",
          "bg-neutral-50"
        )}
      >
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
      </div>
      <div
        className={cn(
          "flex",
          "-translate-y-1/2",
          "-rotate-[7deg]",
          "scale-110",
          "overflow-hidden",
          "border-y-4",
          "border-neutral-900",
          "bg-neutral-50"
        )}
      >
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
      </div>
    </section>
  );
}

export function TranslateWrapper({ children, reverse }) {
  return (
    <motion.div
      initial={{ translateX: reverse ? "-100%" : "0%" }}
      animate={{ translateX: reverse ? "0%" : "-100%" }}
      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      className="flex px-2"
    >
      {children}
    </motion.div>
  );
}

function LogoItem({ Icon, name }) {
  return (
    <a
      // href="/"
      rel="nofollow"
      target="_blank"
      className={cn(
        "flex",
        "items-center",
        "justify-center",
        "gap-4",
        "p-4",
        "text-black",
        "transition-colors",
        // "hover:bg-neutral-200",
        "md:py-6"
      )}
    >
      <Icon className="text-3xl md:text-4xl" />
      <span
        className={cn(
          "text-2xl",
          "font-semibold",
          "uppercase",
          "whitespace-nowrap",
          "md:text-3xl"
        )}
      >
        {name}
      </span>
    </a>
  );
}

function LogoItemsTop() {
  return (
    <>
      <LogoItem Icon={SiNike} name="Nike" />
      <LogoItem Icon={Si3M} name="3M" />
      <LogoItem Icon={SiAbstract} name="Abstract" />
      <LogoItem Icon={SiAdobe} name="Adobe" />
      <LogoItem Icon={SiAirtable} name="Airtable" />
      <LogoItem Icon={SiAmazon} name="Amazon" />
      <LogoItem Icon={SiBox} name="Box" />
      <LogoItem Icon={SiBytedance} name="Bytedance" />
      <LogoItem Icon={SiChase} name="Chase" />
      <LogoItem Icon={SiCloudbees} name="Cloudebees" />
    </>
  );
}

function LogoItemsBottom() {
  return (
    <>
      <LogoItem Icon={SiBmw} name="BMW" />
      <LogoItem Icon={SiBurton} name="Burton" />
      <LogoItem Icon={SiBuildkite} name="Buildkite" />
      <LogoItem Icon={SiCouchbase} name="Couchbase" />
      <LogoItem Icon={SiDailymotion} name="Dailymotion" />
      <LogoItem Icon={SiDeliveroo} name="deliveroo" />
      <LogoItem Icon={SiEpicgames} name="Epic Games" />
      <LogoItem Icon={SiGenius} name="Genius" />
      <LogoItem Icon={SiGodaddy} name="GoDaddy" />
      <LogoItem Icon={SiHeroku} name="Heroku" />
    </>
  );
}
