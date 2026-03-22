import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/admin/lib/admin-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await requireAdmin(req, res))) return;

  const id = req.query.id as string;

  // Handle PDF sub-route: /api/admin/invoices/[id]?pdf=true
  if (req.method === "GET" && req.query.pdf === "true") {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { lineItems: { orderBy: { sortOrder: "asc" } } },
    });
    if (!invoice) return res.status(404).json({ error: "Not found" });

    // Dynamic import to avoid loading react-pdf on every API route
    const { renderToBuffer } = await import("@react-pdf/renderer");
    const { InvoicePDF } = await import("@/lib/pdf/invoice-template");
    const { createElement } = await import("react");

    const element = createElement(InvoicePDF, {
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.date.toISOString(),
      dueDate: invoice.dueDate?.toISOString() || null,
      periodStart: invoice.periodStart?.toISOString() || null,
      periodEnd: invoice.periodEnd?.toISOString() || null,
      fromName: invoice.fromName,
      fromEmail: invoice.fromEmail,
      fromAddress: invoice.fromAddress,
      fromPhone: invoice.fromPhone,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      clientAddress: invoice.clientAddress,
      lineItems: invoice.lineItems.map((li) => ({
        description: li.description,
        type: li.type,
        quantity: li.quantity,
        rate: li.rate,
        amount: li.amount,
        date: li.date?.toISOString() || null,
        dayOfWeek: li.dayOfWeek || null,
      })),
      subtotal: invoice.subtotal,
      taxRate: invoice.taxRate,
      taxAmount: invoice.taxAmount,
      total: invoice.total,
      hourlyRate: invoice.hourlyRate,
      totalHours: invoice.totalHours,
      notes: invoice.notes,
      workSummary: invoice.workSummary,
    });

    const buffer = await renderToBuffer(
      element as unknown as Parameters<typeof renderToBuffer>[0]
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${invoice.invoiceNumber}.pdf"`
    );
    return res.send(buffer);
  }

  if (req.method === "GET") {
    const item = await prisma.invoice.findUnique({
      where: { id },
      include: {
        lineItems: { orderBy: { sortOrder: "asc" } },
        timeEntries: { orderBy: { startTime: "desc" } },
      },
    });
    if (!item) return res.status(404).json({ error: "Not found" });
    return res.json(item);
  }

  if (req.method === "PUT") {
    const { status, clientName, clientEmail, clientAddress, dueDate, notes, taxRate, lineItems } =
      req.body;

    const data: Record<string, unknown> = {};
    if (status !== undefined) data.status = status;
    if (clientName !== undefined) data.clientName = clientName;
    if (clientEmail !== undefined) data.clientEmail = clientEmail;
    if (clientAddress !== undefined) data.clientAddress = clientAddress;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
    if (notes !== undefined) data.notes = notes;

    // If lineItems provided, rewrite them
    if (lineItems) {
      await prisma.invoiceLineItem.deleteMany({ where: { invoiceId: id } });

      const processedItems = lineItems.map(
        (
          item: {
            description: string;
            type: string;
            quantity: number;
            rate: number;
            ticketKey?: string;
          },
          i: number
        ) => ({
          invoiceId: id,
          description: item.description,
          type: item.type || "hourly",
          quantity: item.quantity,
          rate: item.rate,
          amount: Math.round(item.quantity * item.rate * 100) / 100,
          ticketKey: item.ticketKey || null,
          sortOrder: i,
        })
      );

      await prisma.invoiceLineItem.createMany({ data: processedItems });

      const subtotal = processedItems.reduce(
        (sum: number, item: { amount: number }) => sum + item.amount,
        0
      );
      const rate = taxRate ?? 0;
      const taxAmount = Math.round(subtotal * (rate / 100) * 100) / 100;
      data.subtotal = subtotal;
      data.taxRate = rate;
      data.taxAmount = taxAmount;
      data.total = Math.round((subtotal + taxAmount) * 100) / 100;
    }

    const item = await prisma.invoice.update({
      where: { id },
      data,
      include: { lineItems: { orderBy: { sortOrder: "asc" } } },
    });
    return res.json(item);
  }

  if (req.method === "DELETE") {
    // Unlink time entries first (onDelete: SetNull handles this at DB level,
    // but let's be explicit)
    await prisma.timeEntry.updateMany({
      where: { invoiceId: id },
      data: { invoiceId: null },
    });
    await prisma.invoice.delete({ where: { id } });
    return res.json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
