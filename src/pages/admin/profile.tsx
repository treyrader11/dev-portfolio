import { AdminProfilePage } from "@/features/profile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { userData as fallbackUserData } from "@/lib/data";
import type { GetServerSideProps } from "next";
import type { UserData } from "@/types/data";

export default AdminProfilePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }

  const config = await prisma.siteConfig.findUnique({
    where: { key: "userData" },
  });

  const data: UserData = config
    ? { ...(config.value as unknown as UserData) }
    : { ...fallbackUserData };

  // Auto-fill the GitHub username from the logged-in GitHub account when it
  // hasn't been set yet.
  if (!data.githubUsername && session.user.githubUsername) {
    data.githubUsername = session.user.githubUsername;
  }

  return { props: { data } };
};
