import type { NextPage, GetStaticProps } from "next";
import Inner from "@/components/layout/Inner";
import Info from "@/components/Info";
import PageTitle from "@/components/PageTitle";
import { getExperiences } from "@/lib/db/content";
import { getUserData } from "@/features/profile/lib/get-user-data";
import { cn } from "@/lib/utils";
import type { ExperienceEntry } from "@/components/Info/Experience";
import type { InfoSectionsData } from "@/types/data";

interface InfoPageProps {
  experiences: ExperienceEntry[];
  info: InfoSectionsData;
}

const InfoPage: NextPage<InfoPageProps> = ({ experiences, info }) => {
  return (
    <Inner backgroundColor="#934E00">
      <PageTitle
        once
        backgroundColor="#1c1d20"
        title="About."
        className={cn("absolute mt-12 sm:mt-10 md:mt-5")}
        containerClass={cn("py-[90px] sm:py-[100px] z-50")}
      />
      <Info experiences={experiences} info={info} />
    </Inner>
  );
};

export default InfoPage;

// Pull work experience and the editable sidebar copy (Contact / Job
// Opportunities) from the CMS/DB (falls back to bundled data) and revalidate so
// admin edits surface without a rebuild.
export const getStaticProps: GetStaticProps<InfoPageProps> = async () => {
  const [experiences, userData] = await Promise.all([
    getExperiences() as Promise<ExperienceEntry[]>,
    getUserData(),
  ]);
  return { props: { experiences, info: userData.info }, revalidate: 60 };
};
