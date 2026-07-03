"use client";

import { AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import FooterCurve from "./PageCurve/FooterCurve";
import Header from "./Header";
import { useNav } from "./providers/NavProvider";
import { cn } from "@/lib/utils";
import { fontPP, fontCursive, fontMono } from "@/lib/fonts";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  route: string;
}

function MainLayout({ children, route }: LayoutProps) {
  const { isNavOpen } = useNav();

  // The curve should match the color of the content it caps. Most pages end on
  // white; the contact page's bottom panel is slate-100, so its curve matches.
  const curveBg = route === "/contact" ? "bg-slate-100" : "bg-white";

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <main
        key={route}
        className={cn(
          fontPP.variable,
          fontCursive.variable,
          fontMono.variable,
          "mx-auto",
          "overflow-clip"
        )}
      >
        <Header />
        {children}
        {/* Curve that domes over the dark footer and flattens to a straight
            divider on scroll — shared across every public page. Its fill matches
            the page's bottom content color. */}
        <FooterCurve bgClass={curveBg} />
        <Footer />
      </main>
    </AnimatePresence>
  );
}

export default function Layout({ children, route }: LayoutProps) {
  return <MainLayout route={route}>{children}</MainLayout>;
}
