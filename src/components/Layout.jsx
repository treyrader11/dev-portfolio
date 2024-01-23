"use client";

import { AnimatePresence } from "framer-motion";

export default function Layout({ children, route }) {
  return (
    <AnimatePresence mode="wait">
      {/* bettwe altnerative to overflow-hidden. project cards stay in place */}
      <main key={route} className="overflow-clip">
        {children}
      </main>
    </AnimatePresence>
  );
}
