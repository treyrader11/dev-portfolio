"use client";

import { AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import Header from "./Header";
import { NavProvider, useNav } from "./providers/NavProvider";
import { cn } from "@/lib/utils";
import { fontPP, fontCursive, fontMono } from "@/lib/fonts";

function MainLayout({ children, route }) {
  const { isNavOpen } = useNav();

  return (
    <AnimatePresence mode="wait">
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

export default function Layout({ children, route }) {
  return (
    <NavProvider>
      <MainLayout route={route}>{children}</MainLayout>
    </NavProvider>
  );
}
