"use client";

import FuzzyOverlay from "@/common/FuzzyOverlay";
import { AnimatePresence } from "framer-motion";

export default function Layout({ children, route }) {
  return (
    <AnimatePresence mode="wait">
      <main key={route} className="relative overflow-hidden">
        <FuzzyOverlay />
        {children}
      </main>
    </AnimatePresence>
  );
}
