import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { ProjectDetailPage } from "@/features/portfolio";

export default ProjectDetailPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }

  const slug = context.params?.slug as string;

  // "new" is the create route — render an empty form.
  if (slug === "new") {
    return { props: { project: null } };
  }

  // Match the requested slug against each project's title slug.
  const all = await prisma.project.findMany();
  const match = all.find((p) => slugify(p.title) === slug);
  if (!match) {
    return { notFound: true };
  }

  return { props: { project: JSON.parse(JSON.stringify(match)) } };
};
