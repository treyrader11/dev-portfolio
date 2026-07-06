"use client";

import { AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import FooterCurve from "./PageCurve/FooterCurve";
import Header from "./Header";
import GoBack from "./GoBack";
import { routes } from "./Header/nav/routes";
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

  // The curve should match the color of the content it caps so it reads as that
  // content doming over the footer. Each page whose bottom section isn't plain
  // white maps its route to that section's background here. The project detail
  // route is dynamic, but every project shares the same ProjectDetails
  // background (#F1F1F1), so the route pattern maps them all.
  const curveBgByRoute: Record<string, string> = {
    "/contact": "bg-slate-100", // Contact bottom panel
    "/pricing": "bg-neutral-100", // Pricing section
    "/info": "bg-dark", // Info page ends on the dark Experience section
    "/portfolio/[project]": "bg-[#F1F1F1]", // ProjectDetails section
  };
  const curveBg = curveBgByRoute[route] ?? "bg-white";

  return (
    <>
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <main
          key={route}
          className={cn(
            fontPP.variable,
            fontCursive.variable,
            fontMono.variable,
            "mx-auto",
            "overflow-clip",
          )}
        >
          <Header />
          {children}
          {/* Curve that domes over the dark footer and flattens to a straight
              divider on scroll — shared across every public page. Its fill
              matches the page's bottom content color. */}
          <FooterCurve bgClass={curveBg} />
          <Footer />
        </main>
      </AnimatePresence>

      {/* Back button only on nested/detail pages — never on the top-level nav
          (root) pages (/, /portfolio, /info, /pricing, /contact) or admin. */}
      {!routes.some((r) => r.href === route) && <GoBack />}
    </>
  );
}

export default function Layout({ children, route }: LayoutProps) {
  return <MainLayout route={route}>{children}</MainLayout>;
}
