import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps, router }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <Layout route={router.route}>
        <Header />
        <Component {...pageProps} router={router} />
        <Footer />
      </Layout>
    </ThemeProvider>
  );
}
