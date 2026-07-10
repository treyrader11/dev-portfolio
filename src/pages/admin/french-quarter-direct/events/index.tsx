import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { EventsListPage } from "@/features/fqd/components/events-list-page";
import { getFqdEvents, type GetFqdEventsResult } from "@/features/fqd/actions/get-events";

interface Props {
  data: GetFqdEventsResult;
}

export default function Page({ data }: Props) {
  return <EventsListPage data={data} />;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }
  const page = Number(ctx.query.page ?? 1) || 1;
  const data = await getFqdEvents(page, 20);
  return { props: { data } };
};
