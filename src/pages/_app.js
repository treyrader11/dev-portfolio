import "@/globals.css";

import Layout from "@/components/Layout";

export default function App({ Component, pageProps, router }) {
  return (
    <Layout route={router.route}>
      <Component {...pageProps} router={router} />
    </Layout>
  );
}
