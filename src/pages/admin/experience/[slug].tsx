import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { ExperienceDetailPage } from "@/features/experiences";

export default ExperienceDetailPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }

  const slug = context.params?.slug as string;

  // "new" is the create route — render an empty form.
  if (slug === "new") {
    return { props: { experience: null } };
  }

  // Match the requested slug against each company's slug.
  const all = await prisma.experience.findMany();
  const match = all.find((e) => slugify(e.company) === slug);
  if (!match) {
    return { notFound: true };
  }

  return { props: { experience: JSON.parse(JSON.stringify(match)) } };
};
