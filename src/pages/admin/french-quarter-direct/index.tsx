import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { FqdPage } from "@/features/fqd/components/fqd-page";
import { getFqdEventCount } from "@/features/fqd/actions/get-events";
import {
  getFqdNotificationSettings,
  type FqdNotificationSettings,
} from "@/features/fqd/lib/notification-settings";

interface Props {
  settings: FqdNotificationSettings;
  currentUserEmail: string;
  eventCount: number;
  emailOptions: string[];
}

export default function Page({
  settings,
  currentUserEmail,
  eventCount,
  emailOptions,
}: Props) {
  return (
    <FqdPage
      settings={settings}
      currentUserEmail={currentUserEmail}
      eventCount={eventCount}
      emailOptions={emailOptions}
    />
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }
  const [settings, eventCount, users] = await Promise.all([
    getFqdNotificationSettings(),
    getFqdEventCount(),
    prisma.user.findMany({
      where: { email: { not: null } },
      select: { email: true },
      orderBy: { email: "asc" },
    }),
  ]);
  const emailOptions = Array.from(
    new Set(users.map((u) => u.email).filter((e): e is string => !!e)),
  );
  return {
    props: {
      settings,
      currentUserEmail: session.user.email ?? "",
      eventCount,
      emailOptions,
    },
  };
};
