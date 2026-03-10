import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await requireAdmin(req, res))) return;

  if (req.method === "GET") {
    const items = await prisma.invoice.findMany({
      orderBy: { date: "desc" },
      include: {
        lineItems: { orderBy: { sortOrder: "asc" } },
        _count: { select: { timeEntries: true } },
      },
    });
    return res.json(items);
  }

  if (req.method === "POST") {
    const {
      clientName,
      clientEmail,
      clientAddress,
      dueDate,
      taxRate = 0,
      notes,
      lineItems = [],
      timeEntryIds = [],
    } = req.body;

    // Generate invoice number
    const year = new Date().getFullYear();
    const count = await prisma.invoice.count({
      where: {
        invoiceNumber: { startsWith: `INV-${year}` },
      },
    });
    const invoiceNumber = `INV-${year}-${String(count + 1).padStart(3, "0")}`;

    // Get "from" info from userData config
    let fromName = "Trey Rader";
    let fromEmail = "developertrey@gmail.com";
    let fromAddress: string | null = null;
    try {
      const userData = await prisma.siteConfig.findUnique({
        where: { key: "userData" },
      });
      if (userData?.value) {
        const data = userData.value as Record<string, unknown>;
        if (data.name) fromName = data.name as string;
        if (data.email) fromEmail = data.email as string;
      }
    } catch {
      // use defaults
    }

    // Compute line item amounts and totals
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
        description: item.description,
        type: item.type || "hourly",
        quantity: item.quantity,
        rate: item.rate,
        amount: Math.round(item.quantity * item.rate * 100) / 100,
        ticketKey: item.ticketKey || null,
        sortOrder: i,
      })
    );

    const subtotal = processedItems.reduce(
      (sum: number, item: { amount: number }) => sum + item.amount,
      0
    );
    const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
    const total = Math.round((subtotal + taxAmount) * 100) / 100;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientName,
        clientEmail: clientEmail || null,
        clientAddress: clientAddress || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        fromName,
        fromEmail,
        fromAddress,
        subtotal,
        taxRate,
        taxAmount,
        total,
        notes: notes || null,
        lineItems: {
          create: processedItems,
        },
      },
      include: { lineItems: true },
    });

    // Link time entries if provided
    if (timeEntryIds.length > 0) {
      await prisma.timeEntry.updateMany({
        where: { id: { in: timeEntryIds } },
        data: { invoiceId: invoice.id },
      });
    }

    return res.status(201).json(invoice);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
