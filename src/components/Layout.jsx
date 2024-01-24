"use client";

import { AnimatePresence } from "framer-motion";

export default function Layout({ children, route }) {
  return (
    <AnimatePresence mode="wait">
      {/* overflow-clip is a better altnerative to overflow-hidden and keeps the layout from overflowing and in tact while maintaining the project cards to stay in place */}
      <main key={route} className="mx-auto">
        {children}
      </main>
    </AnimatePresence>
  );
}
