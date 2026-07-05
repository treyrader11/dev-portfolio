import type { NextPage, GetStaticProps } from "next";
import Inner from "@/components/layout/Inner";
import Info from "@/components/Info";
import PageTitle from "@/components/PageTitle";
import { getExperiences } from "@/lib/db/content";
import { cn } from "@/lib/utils";
import type { ExperienceEntry } from "@/components/Info/Experience";

interface InfoPageProps {
  experiences: ExperienceEntry[];
}

const InfoPage: NextPage<InfoPageProps> = ({ experiences }) => {
  return (
    <Inner backgroundColor="#934E00">
      <PageTitle
        once
        backgroundColor="#1c1d20"
        title="About."
        className={cn("absolute mt-12 sm:mt-10 md:mt-5")}
        containerClass={cn("py-[90px] sm:py-[100px] z-50")}
      />
      <Info experiences={experiences} />
    </Inner>
  );
};

export default InfoPage;

// Pull work experience from the CMS/DB (falls back to bundled data) and
// revalidate so admin edits surface without a rebuild.
export const getStaticProps: GetStaticProps<InfoPageProps> = async () => {
  const experiences = (await getExperiences()) as ExperienceEntry[];
  return { props: { experiences }, revalidate: 60 };
};
