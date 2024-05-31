"use client";

import { AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import Header from "./Header";
import { NavProvider, useNav } from "./providers/NavProvider";
import { cn } from "@/lib/utils";

export default function Layout({ children, route }) {
  // const { isNavOpen } = useNav();

  return (
    <AnimatePresence mode="wait">
      <main key={route} className={cn("mx-auto", "overflow-clip")}>
        <NavProvider>
          <Header />
          {children}
          <Footer />
        </NavProvider>
      </main>
    </AnimatePresence>
  );
}
