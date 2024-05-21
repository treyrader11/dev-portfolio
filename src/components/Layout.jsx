"use client";

import { AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children, route }) {
  return (
    <AnimatePresence mode="wait">
      <main key={route} className="mx-auto overflow-clip bg-dark">
        <Header />
        {children}
        <Footer />
      </main>
    </AnimatePresence>
  );
}
