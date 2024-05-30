import Inner from "@/components/layout/Inner";
import PageTitle from "@/components/PageTitle";
import Portfolio from "@/components/Portfolio";
import { cn } from "@/lib/utils";

export default function PortfolioPage() {
  return (
    <Inner backgroundColor="#934E00">
      <PageTitle
        once
        title="Portfolio."
        className={cn(
          // "py-[125px]",
          "absolute",
          "mt-12",
          "sm:mt-10",
          "md:mt-5"
        )}
        containerClass={cn(
          // "py-[125px]",
          // "sm:py-[130px]",
          // "md:py-[110px]"
          "py-[90px]",
          "sm:py-[100px]",
          "z-50"
        )}
      />
      <Portfolio />
    </Inner>
  );
}
