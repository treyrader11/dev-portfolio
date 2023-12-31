import "@/styles/globals.css";
import Header from "@/components/Header";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps, router }) {
  return (
    <Layout route={router.route}>
      <Header />
      <Component {...pageProps} router={router} />
    </Layout>
  );
}
