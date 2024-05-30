"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

import react from "/public/images/tech/react.png";
import tailwind from "/public/images/tech/tailwind.png";
import js from "/public/images/tech/javascript.png";
import ts from "/public/images/tech/typescript.png";
import next from "/public/images/tech/next.png";
import github from "/public/images/tech/github.png";
import figma from "/public/images/tech/figma.png";
import vite from "/public/images/tech/vite.png";
import svelt from "/public/images/tech/svelt.png";
import css from "/public/images/tech/css.png";
import html from "/public/images/tech/html.png";
import framer from "/public/images/tech/framer.png";
import vercel from "/public/images/tech/vercel.png";
import gsap from "/public/images/tech/gsap.png";
import expo from "/public/images/tech/expo.png";
import express from "/public/images/tech/express.png";
import node from "/public/images/tech/node.png";
import sass from "/public/images/tech/sass.png";
import storybook from "/public/images/tech/storybook.png";
import shadcn from "/public/images/tech/shadcn.png";

export default function TeckStack({ className }) {
  return (
    <section className={cn("py-24", className)}>
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

function LogoItem({ name, imgSrc }) {
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
        "text-gray-500",
        "transition-colors",
        // "hover:bg-neutral-200",
        "md:py-6",
        ""
      )}
    >
      <div className="flex aspect-video relatve size-12">
        <Image
          width={50}
          height={50}
          src={imgSrc}
          className="object-contain rounded-full md:text-4xl"
        />
      </div>

      <span
        className={cn(
          "text-xl",
          "font-semibold",
          "uppercase",
          "whitespace-nowrap",
          "md:text-2xl"
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
      <LogoItem imgSrc={js} name="Javascript" />
      <LogoItem imgSrc={node} name="Node" />
      <LogoItem imgSrc={express} name="Express" />
      <LogoItem imgSrc={ts} name="Typescript" />
      <LogoItem imgSrc={html} name="html" />
      <LogoItem imgSrc={sass} name="Sass" />
      <LogoItem imgSrc={css} name="Css" />
      <LogoItem imgSrc={react} name="React" />
      <LogoItem imgSrc={next} name="Next" />
      <LogoItem imgSrc={vite} name="Vite" />
    </>
  );
}

function LogoItemsBottom() {
  return (
    <>
      <LogoItem imgSrc={figma.src} name="Figma" />
      <LogoItem imgSrc={storybook.src} name="Storybook" />
      <LogoItem imgSrc={gsap.src} name="Gsap" />
      <LogoItem imgSrc={framer.src} name="Framer Motion" />
      <LogoItem imgSrc={tailwind} name="Tailwind" />
      <LogoItem imgSrc={shadcn} name="Shadcn" />
      <LogoItem imgSrc={vercel} name="Vercel" />
      <LogoItem imgSrc={expo} name="Expo" />
      <LogoItem imgSrc={github} name="Github" />
      <LogoItem imgSrc={svelt} name="Svelt" />
    </>
  );
}

// "use client";

// import { useRef, useLayoutEffect, useCallback, forwardRef, Fragment } from "react";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/dist/ScrollTrigger";

// import react from "/public/images/tech/react.png";
// import tailwind from "/public/images/tech/tailwind.png";
// import js from "/public/images/tech/javascript.png";
// import ts from "/public/images/tech/typescript.png";
// import next from "/public/images/tech/next.png";
// import github from "/public/images/tech/github.png";
// import figma from "/public/images/tech/figma.png";
// import vite from "/public/images/tech/vite.png";
// import svelt from "/public/images/tech/svelt.png";
// import css from "/public/images/tech/css.png";
// import html from "/public/images/tech/html.png";
// import framer from "/public/images/tech/framer.png";
// import vercel from "/public/images/tech/vercel.png";
// import gsap_logo from "/public/images/tech/gsap.png";
// import expo from "/public/images/tech/expo.png";
// import express from "/public/images/tech/express.png";
// import node from "/public/images/tech/node.png";
// import sass from "/public/images/tech/sass.png";
// import storybook from "/public/images/tech/storybook.png";
// import shadcn from "/public/images/tech/shadcn.png";

// gsap.registerPlugin(ScrollTrigger);

// const TranslateWrapper = forwardRef(({ children, reverse }, ref) => {
//   return (
//     <motion.div
//     ref={ref}
//       initial={{ translateX: reverse ? "-100%" : "0%" }}
//       animate={{ translateX: reverse ? "0%" : "-100%" }}
//       transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
//       className="flex px-2"
//     >
//       {children}
//     </motion.div>
//   );
// });

// const LogoItem = ({ name, imgSrc }) => (
//   <a
//     rel="nofollow"
//     target="_blank"
//     className="flex items-center justify-center gap-4 p-4 text-gray-500 transition-colors md:py-6"
//   >
//     <div className="flex aspect-video relatve size-12">
//       <Image
//         width={50}
//         height={50}
//         src={imgSrc}
//         className="object-contain rounded-full md:text-4xl"
//       />
//     </div>

//     <span className="text-xl font-semibold uppercase whitespace-nowrap md:text-2xl">
//       {name}
//     </span>
//   </a>
// );

// const LogoItemsTop = forwardRef((props, ref) => (
//   <div ref={ref}>
//     <LogoItem imgSrc={js} name="Javascript" />
//     <LogoItem imgSrc={node} name="Node" />
//     <LogoItem imgSrc={express} name="Express" />
//     <LogoItem imgSrc={ts} name="Typescript" />
//     <LogoItem imgSrc={html} name="html" />
//     <LogoItem imgSrc={sass} name="Sass" />
//     <LogoItem imgSrc={css} name="Css" />
//     <LogoItem imgSrc={react} name="React" />
//     <LogoItem imgSrc={next} name="Next" />
//     <LogoItem imgSrc={vite} name="Vite" />
//   </div>
// ));

// const LogoItemsBottom = forwardRef((props, ref) => (
//   <div ref={ref}>
//     <LogoItem imgSrc={figma.src} name="Figma" />
//     <LogoItem imgSrc={storybook.src} name="Storybook" />
//     <LogoItem imgSrc={gsap_logo.src} name="Gsap" />
//     <LogoItem imgSrc={framer.src} name="Framer Motion" />
//     <LogoItem imgSrc={tailwind} name="Tailwind" />
//     <LogoItem imgSrc={shadcn} name="Shadcn" />
//     <LogoItem imgSrc={vercel} name="Vercel" />
//     <LogoItem imgSrc={expo} name="Expo" />
//     <LogoItem imgSrc={github} name="Github" />
//     <LogoItem imgSrc={svelt} name="Svelt" />
//   </div>
// ));

// export default function TeckStack({ className }) {
//   const firstSlider = useRef(null);
//   const secondSlider = useRef(null);
//   const slider = useRef(null);
//   const direction = useRef(-1);
//   const xPercent = useRef(0);

//   const animate = useCallback(() => {
//     if (xPercent.current < -100) {
//       xPercent.current = 0;
//     } else if (xPercent.current > 0) {
//       xPercent.current = -100;
//     }
//     gsap.set(firstSlider.current, { xPercent: xPercent.current });
//     gsap.set(secondSlider.current, { xPercent: xPercent.current });
//     requestAnimationFrame(animate);
//     xPercent.current += 0.1 * direction.current;
//   }, []);

//   useLayoutEffect(() => {
//     gsap.to(slider.current, {
//       scrollTrigger: {
//         trigger: document.documentElement,
//         scrub: 0.25,
//         start: 0,
//         end: window.innerHeight,
//         onUpdate: (e) => (direction.current = e.direction * -1),
//       },
//       x: "-500px",
//     });
//     requestAnimationFrame(animate);
//   }, [animate]);

//   return (
//     <section className={`py-24 ${className}`}>
//       <div
//         className="flex translate-y-1/2 rotate-[7deg] scale-110 overflow-hidden border-y-4 border-neutral-900 bg-neutral-50"
//       >
//         <TranslateWrapper ref={slider}>
//           <LogoItemsTop ref={firstSlider} />
//         </TranslateWrapper>
//         <TranslateWrapper ref={slider}>
//           <LogoItemsTop ref={firstSlider} />
//         </TranslateWrapper>
//         <TranslateWrapper ref={slider}>
//           <LogoItemsTop ref={firstSlider} />
//         </TranslateWrapper>
//       </div>
//       <div
//         className="flex -translate-y-1/2 -rotate-[7deg] scale-110 overflow-hidden border-y-4 border-neutral-900 bg-neutral-50"
//       >
//         <TranslateWrapper ref={slider}>
//           <LogoItemsBottom ref={secondSlider} />
//         </TranslateWrapper>
//         <TranslateWrapper ref={slider}>
//           <LogoItemsBottom ref={secondSlider} />
//         </TranslateWrapper>
//         <TranslateWrapper ref={slider}>
//           <LogoItemsBottom ref={secondSlider} />
//         </TranslateWrapper>
//       </div>
//     </section>
//   );
// }
