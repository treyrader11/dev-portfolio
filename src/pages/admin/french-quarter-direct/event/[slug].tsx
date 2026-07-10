import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { EventDetailPage } from "@/features/fqd/components/event-detail-page";
import { getFqdEventBySlug } from "@/features/fqd/actions/get-event-by-slug";
import type { FqdEventListItem } from "@/features/fqd/types/fqd-types";

interface Props {
  event: FqdEventListItem;
}

export default function Page({ event }: Props) {
  return <EventDetailPage event={event} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }
  const event = await getFqdEventBySlug(ctx.params?.slug as string);
  if (!event) return { notFound: true };
  return { props: { event } };
};
