"use client";

import { AnimatePresence } from "framer-motion";

export default function Layout({ children, route }) {
  return (
    <AnimatePresence mode="wait">
      <main key={route} className="mx-auto overflow-clip">
        {children}
      </main>
    </AnimatePresence>
  );
}
