"use client";

import "@/globals.css";

import { useEffect } from "react";
import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/Layout";
import Notifications from "@/components/Notifications";
import { NotificationsProvider } from "@/components/providers/NotificationsProvider";
import Preloader from "@/components/Preloader";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  router,
}: AppProps): React.ReactElement {
  const isAdminRoute = router.pathname.startsWith("/admin");

  // Disable Next.js automatic scroll restoration so it doesn't
  // jump to top before the exit animation finishes
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <NotificationsProvider>
        {isAdminRoute ? (
          <Component {...pageProps} router={router} />
        ) : (
          <>
            <AnimatePresence mode="wait">
              <Preloader />
            </AnimatePresence>
            <Layout route={router.route}>
              <Component {...pageProps} router={router} />
              <Notifications />
            </Layout>
          </>
        )}
      </NotificationsProvider>
    </SessionProvider>
  );
}
