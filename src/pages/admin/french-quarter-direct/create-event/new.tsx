import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { EventFormPage } from "@/features/fqd/components/event-form-page";
import { getDefaultAiProvider } from "@/features/fqd/lib/ai-settings";
import type { FqdProvider } from "@/features/fqd/types/fqd-types";

interface Props {
  defaultProvider: FqdProvider;
}

export default function Page({ defaultProvider }: Props) {
  return <EventFormPage mode="create" defaultProvider={defaultProvider} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }
  const defaultProvider = await getDefaultAiProvider();
  return { props: { defaultProvider } };
};
