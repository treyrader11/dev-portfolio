import PageTitle from "@/components/PageTitle";
import Inner from "@/components/layout/Inner";
import Portfolio from "@/components/Portfolio";

export default function PortfolioPage() {
  return (
    <Inner backgroundColor="#934E00">
      {/* <PageTitle title="Portfolio." className="text-7xl" /> */}
      {/* <PageTitle title="Portfolio" /> */}
      <Portfolio />
    </Inner>
  );
}
