import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
export default function App({ Component, pageProps, router }) {
  return (
    
    <ThemeProvider defaultTheme="light" attribute="class">
      <Layout route={router.route}>
        <Header />
        <Component {...pageProps} router={router} />
      </Layout>
    </ThemeProvider>
  );
}
