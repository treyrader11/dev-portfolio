import PageTitle from "@/common/PageTitle";
import Inner from "@/common/layout/Inner";
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
