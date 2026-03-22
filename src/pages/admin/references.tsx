import { AdminReferencesPage } from "@/features/references";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import type { GetServerSideProps } from "next";

export default AdminReferencesPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }

  const references = await prisma.reference.findMany({ orderBy: { sortOrder: "asc" } });
  return { props: { references: JSON.parse(JSON.stringify(references)) } };
};
