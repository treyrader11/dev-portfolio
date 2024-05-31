"use client";

import "@/globals.css";

import { AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import Notifications from "@/components/Notifications";
import { NotificationsProvider } from "@/components/providers/NotificationsProvider";
import Preloader from "@/components/Preloader";

export default function App({ Component, pageProps, router }) {
  return (
    <NotificationsProvider>
      <AnimatePresence mode="wait">
        <Preloader />
      </AnimatePresence>
      <Layout route={router.route}>
        <Component {...pageProps} router={router} />
        <Notifications />
      </Layout>
    </NotificationsProvider>
  );
}
