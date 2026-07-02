"use client";

import "@/globals.css";

import { useEffect } from "react";
import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/Layout";
import { NavProvider } from "@/components/providers/NavProvider";
import Notifications from "@/components/Notifications";
import { NotificationsProvider } from "@/components/providers/NotificationsProvider";
import Preloader from "@/components/Preloader";
import AdminFAB from "@/components/AdminFAB";
import ResumeCornerBadge from "@/components/ResumeCornerBadge";
import NextNProgress from "nextjs-progressbar";
import { cn } from "@/lib/utils";
import { fontPP, fontCursive, fontMono } from "@/lib/fonts";
import SocialMeta from "@/components/SocialMeta";

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
      <NextNProgress
        color="#A25600"
        height={3}
        options={{ showSpinner: false }}
      />
      <NotificationsProvider>
        {isAdminRoute ? (
          // Admin routes bypass Layout, so apply the font CSS variables here
          // too — otherwise font-pp-acma (etc.) falls back to the default font.
          <div
            className={cn(
              fontPP.variable,
              fontCursive.variable,
              fontMono.variable,
            )}
          >
            <Component {...pageProps} router={router} />
          </div>
        ) : (
          <NavProvider>
            {/* Site-wide share card default: profile photo + name + what I do.
                Individual pages (e.g. a project) override this via SocialMeta. */}
            <SocialMeta
              title="Trey Rader's Portfolio"
              description="Senior mobile architect specializing in React Native. Transforming complex challenges into elegant, performant solutions."
              image="/images/portraits/headshot.png"
              card="summary"
              path={router.asPath.split("?")[0]}
            />
            <AnimatePresence mode="wait">
              <Preloader />
            </AnimatePresence>
            <Layout route={router.route}>
              <Component {...pageProps} router={router} />
              <Notifications />
            </Layout>
            <AdminFAB />
            <ResumeCornerBadge />
          </NavProvider>
        )}
      </NotificationsProvider>
    </SessionProvider>
  );
}
