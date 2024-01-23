"use client";

import { AnimatePresence } from "framer-motion";

export default function Layout({ children, route }) {
  return (
    <AnimatePresence mode="wait">
      <main key={route} className="overflow-hidden">
        {children}
      </main>
    </AnimatePresence>
  );
}
