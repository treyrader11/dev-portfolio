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
        <div
          className={cn(
            "w-[160px]",
            "h-[60px]",
            "flex",
            "justify-between",
            "items-center",
            "ml-[-100px]",
            "hover:-ml-2.5",
            "duration-300",
            "bg-purple-600",
            "fixed",
            "top-40",
            "z-[10]",
            "rounded-r-lg"
          )}
        >
          <a
            className={cn(
              "flex",
              "items-center",
              "justify-between",
              "w-full",
              "text-gray-300"
            )}
            href="/"
          >
            Resume <BsFillPersonLinesFill size={30} />
          </a>
        </div>
        <Component {...pageProps} router={router} />
        <Footer />
      </Layout>
    </ThemeProvider>
  );
}
