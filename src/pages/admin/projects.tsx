import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { AdminProjectsPage } from "@/features/portfolio";

export default AdminProjectsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }

  const projects = await prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return {
    props: { projects: JSON.parse(JSON.stringify(projects)) },
  };
};
