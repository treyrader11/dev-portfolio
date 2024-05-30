import "@/globals.css";

import { AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import Notifications from "@/components/Notifications";
import { NotificationsProvider } from "@/components/providers/NotificationsProvider";
import Transition from "@/components/layout/Transition";

export default function App({ Component, pageProps, router }) {
  return (
    <NotificationsProvider>
       <AnimatePresence mode="wait">
        {/* {isLoading && <Preloader />} */}
        <Transition />
      </AnimatePresence>
      <Layout route={router.route}>
        <Component {...pageProps} router={router} />
        <Notifications />
      </Layout>
    </NotificationsProvider>
  );
}
