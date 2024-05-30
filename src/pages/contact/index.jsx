"use client";

import Inner from "@/components/layout/Inner";
import ContactForm from "@/components/Contact/components/ContactForm";
import PageTitle from "@/components/PageTitle";
import { cn } from "@/lib/utils";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import PageCurve from "@/components/PageCurve";

export default function ContactPage() {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  // const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);
  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

  return (
    <Inner
      style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }} 
      ref={container}
      backgroundColor="#934E00"
      className="shadow-2xl"
    >
      <PageTitle
        once
        title="Contact."
        className={cn("absolute mt-12 sm:mt-10 md:mt-5")}
        containerClass={cn("py-[90px] sm:py-[100px] z-50")}
      />
      <ContactForm />
      {/* <PageCurve height={height} /> */}
    </Inner>
  );
}
