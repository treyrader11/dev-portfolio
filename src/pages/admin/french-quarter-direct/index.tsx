import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
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
}

export default function Page({ settings, currentUserEmail, eventCount }: Props) {
  return (
    <FqdPage
      settings={settings}
      currentUserEmail={currentUserEmail}
      eventCount={eventCount}
    />
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }
  const [settings, eventCount] = await Promise.all([
    getFqdNotificationSettings(),
    getFqdEventCount(),
  ]);
  return {
    props: { settings, currentUserEmail: session.user.email ?? "", eventCount },
  };
};
