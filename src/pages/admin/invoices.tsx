import { AdminInvoicesPage } from "@/features/invoices";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import type { GetServerSideProps } from "next";

export default AdminInvoicesPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session?.user?.isAdmin) {
    return { redirect: { destination: "/admin/signin", permanent: false } };
  }

  const [invoices, uninvoiced] = await Promise.all([
    prisma.invoice.findMany({
      orderBy: { date: "desc" },
      include: {
        lineItems: { orderBy: { sortOrder: "asc" } },
        _count: { select: { timeEntries: true } },
      },
    }),
    prisma.timeEntry.findMany({
      where: { invoiceId: null, endTime: { not: null } },
      orderBy: { startTime: "desc" },
    }),
  ]);

  // Group uninvoiced entries by ticket
  const byTicket: Record<
    string,
    { ticketKey: string; ticketSummary: string; totalSeconds: number; entryIds: string[] }
  > = {};
  for (const e of uninvoiced) {
    if (!byTicket[e.ticketKey]) {
      byTicket[e.ticketKey] = {
        ticketKey: e.ticketKey,
        ticketSummary: e.ticketSummary,
        totalSeconds: 0,
        entryIds: [],
      };
    }
    byTicket[e.ticketKey].totalSeconds += e.duration || 0;
    byTicket[e.ticketKey].entryIds.push(e.id);
  }

  const uninvoicedEntries = Object.values(byTicket).map((t) => ({
    ticketKey: t.ticketKey,
    ticketSummary: t.ticketSummary,
    totalHours: Math.round((t.totalSeconds / 3600) * 100) / 100,
    entryIds: t.entryIds,
  }));

  return {
    props: {
      invoices: JSON.parse(JSON.stringify(invoices)),
      uninvoicedEntries,
    },
  };
};
