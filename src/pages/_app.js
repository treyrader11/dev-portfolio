import "@/globals.css";

import Layout from "@/components/Layout";
import Notifications from "@/components/Notifications";
import { NotificationsProvider } from "@/components/providers/NotificationsProvider";

export default function App({ Component, pageProps, router }) {
  return (
    <NotificationsProvider>
      <Layout route={router.route}>
        <Component {...pageProps} router={router} />
        <Notifications />
      </Layout>
    </NotificationsProvider>
  );
}
