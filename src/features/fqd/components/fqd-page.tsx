import Link from "next/link";
import AdminLayout from "@/features/admin/components/admin-layout";
import { FqdNotificationSettings } from "./fqd-notification-settings";
import type { FqdNotificationSettings as Settings } from "../lib/notification-settings";

interface Props {
  settings: Settings;
  currentUserEmail: string;
  eventCount: number;
  emailOptions: string[];
}

export function FqdPage({
  settings,
  currentUserEmail,
  eventCount,
  emailOptions,
}: Props) {
  return (
    <AdminLayout
      title="French Quarter Direct"
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "French Quarter Direct" },
      ]}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/french-quarter-direct/events">
          <div className="h-full rounded-lg border border-dark-600 bg-dark-400 p-6 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-white">Events</h2>
              <span className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-sm font-semibold text-secondary">
                {eventCount}
              </span>
            </div>
            <p className="mt-2 text-sm text-light-400">
              Manage New Orleans event listings — research, edit, and prepare
              them for export.
            </p>
          </div>
        </Link>
      </div>

      <FqdNotificationSettings
        initial={settings}
        currentUserEmail={currentUserEmail}
        emailOptions={emailOptions}
      />
    </AdminLayout>
  );
}
