import Inner from "@/components/layout/Inner";
import Info from "@/components/Info";
import PageTitle from "@/components/PageTitle";
import { cn } from "@/lib/utils";

export default function InfoPage() {
  return (
    <Inner backgroundColor="#934E00">
      <PageTitle
        once
        backgroundColor="#1c1d20"
        title="About."
        className={cn("absolute mt-12 sm:mt-10 md:mt-5")}
        containerClass={cn("py-[90px] sm:py-[100px] z-50")}
      />
      <Info />
    </Inner>
  );
}
