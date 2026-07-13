import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { EventFormPage } from "@/features/fqd/components/event-form-page";
import { getFqdEvent } from "@/features/fqd/actions/get-event";
import { getDefaultAiProvider } from "@/features/fqd/lib/ai-settings";
import type {
  FqdEventListItem,
  FqdProvider,
} from "@/features/fqd/types/fqd-types";

interface Props {
  event: FqdEventListItem;
  defaultProvider: FqdProvider;
}

export default function Page({ event, defaultProvider }: Props) {
  return (
    <EventFormPage mode="edit" event={event} defaultProvider={defaultProvider} />
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }
  const event = await getFqdEvent(ctx.params?.id as string);
  if (!event) return { notFound: true };
  const defaultProvider = await getDefaultAiProvider();
  return { props: { event, defaultProvider } };
};
