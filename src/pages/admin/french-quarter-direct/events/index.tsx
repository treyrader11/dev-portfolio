import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { EventsListPage } from "@/features/fqd/components/events-list-page";
import { getFqdEvents, type GetFqdEventsResult } from "@/features/fqd/actions/get-events";
import { runExpiration } from "@/features/fqd/lib/event-notifications";

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
  // Lazy expiry pass: email (when enabled) + remove events past their end date,
  // so it works even if the daily cron hasn't run (local dev / delayed cron).
  // Best-effort — never block or break the page on failure. When nothing is
  // expired this is a single cheap query.
  try {
    await runExpiration();
  } catch (err) {
    console.error("[fqd] lazy expiry pass failed:", err);
  }

  const page = Number(ctx.query.page ?? 1) || 1;
  const data = await getFqdEvents(page, 50);
  return { props: { data } };
};
