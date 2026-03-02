"use client";

import { AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import Header from "./Header";
import { NavProvider, useNav } from "./providers/NavProvider";
import { cn } from "@/lib/utils";
import { fontPP, fontCursive, fontMono } from "@/lib/fonts";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  route: string;
}

function MainLayout({ children, route }: LayoutProps) {
  const { isNavOpen } = useNav();

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
        <Footer />
      </main>
    </AnimatePresence>
  );
}

export default function Layout({ children, route }: LayoutProps) {
  return (
    <NavProvider>
      <MainLayout route={route}>{children}</MainLayout>
    </NavProvider>
  );
}
