import type { NextPage } from "next";
import Inner from "@/components/layout/Inner";
import PageTitle from "@/components/PageTitle";
import Pricing from "@/components/Pricing";
import { cn } from "@/lib/utils";

const PricingPage: NextPage = () => {
  return (
    <Inner backgroundColor="#934E00">
      <PageTitle
        once
        backgroundColor="#1c1d20"
        title="Pricing."
        className={cn("absolute mt-12 sm:mt-10 md:mt-5")}
        containerClass={cn("py-[90px] sm:py-[100px] z-50")}
      />
      <Pricing />
    </Inner>
  );
};

export default PricingPage;
