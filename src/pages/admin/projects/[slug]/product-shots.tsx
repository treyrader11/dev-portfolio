import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { ProductShotsPage } from "@/features/portfolio/components/product-shots-page";

export default ProductShotsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }

  const slug = context.params?.slug as string;
  const all = await prisma.project.findMany();
  const match = all.find((p) => slugify(p.title) === slug);
  if (!match) {
    return { notFound: true };
  }

  return { props: { project: JSON.parse(JSON.stringify(match)) } };
};
