import Inner from "@/components/layout/Inner";
import Contact from "@/components/Contact";
import PageTitle from "@/components/PageTitle";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  return (
    <Inner backgroundColor="#934E00">
      <PageTitle
        once
        title="Contact."
        className={cn("absolute mt-12 sm:mt-10 md:mt-5")}
        containerClass={cn("py-[90px] sm:py-[100px] z-50")}
      />
      <Contact />
    </Inner>
  );
}
