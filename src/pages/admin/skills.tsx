import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { AdminSkillsPage } from "@/features/skills";

export default AdminSkillsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }
  const skills = await prisma.skill.findMany({ orderBy: { sortOrder: "asc" } });
  return { props: { skills: JSON.parse(JSON.stringify(skills)) } };
};
