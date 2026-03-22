import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { AdminExperiencesPage } from "@/features/experiences";

export default AdminExperiencesPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }
  const experiences = await prisma.experience.findMany({ orderBy: { sortOrder: "asc" } });
  return { props: { experiences: JSON.parse(JSON.stringify(experiences)) } };
};
