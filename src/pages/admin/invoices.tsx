import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import type { GetServerSideProps } from "next";

interface LineItem {
  description: string;
  type: "hourly" | "fixed";
  quantity: number;
  rate: number;
  ticketKey?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string | null;
  status: string;
  clientName: string;
  clientEmail: string | null;
  clientAddress: string | null;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string | null;
  lineItems: Array<{
    id: string;
    description: string;
    type: string;
    quantity: number;
    rate: number;
    amount: number;
    ticketKey: string | null;
  }>;
  _count: { timeEntries: number };
}

interface UninvoicedEntry {
  ticketKey: string;
  ticketSummary: string;
  totalHours: number;
  entryIds: string[];
}

interface Props {
  invoices: Invoice[];
  uninvoicedEntries: UninvoicedEntry[];
}

const statusBadge: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
};

const emptyLineItem: LineItem = {
  description: "",
  type: "hourly",
  quantity: 0,
  rate: 0,
};

export default function AdminInvoices({
  invoices: initialInvoices,
  uninvoicedEntries,
}: Props) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([{ ...emptyLineItem }]);
  const [selectedEntryIds, setSelectedEntryIds] = useState<string[]>([]);

  function resetForm() {
    setClientName("");
    setClientEmail("");
    setClientAddress("");
    setDueDate("");
    setTaxRate(0);
    setNotes("");
    setLineItems([{ ...emptyLineItem }]);
    setSelectedEntryIds([]);
    setShowForm(false);
  }

  function updateLineItem(index: number, field: keyof LineItem, value: string | number) {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  }

  function importTimeEntries() {
    const newItems: LineItem[] = [];
    const ids: string[] = [];

    for (const entry of uninvoicedEntries) {
      newItems.push({
        description: `${entry.ticketKey} — ${entry.ticketSummary}`,
        type: "hourly",
        quantity: Math.round(entry.totalHours * 100) / 100,
        rate: 0,
        ticketKey: entry.ticketKey,
      });
      ids.push(...entry.entryIds);
    }

    if (newItems.length > 0) {
      setLineItems((prev) => {
        const nonEmpty = prev.filter((li) => li.description.trim() !== "");
        return [...nonEmpty, ...newItems];
      });
      setSelectedEntryIds((prev) => [...prev, ...ids]);
    }
  }

  const subtotal = lineItems.reduce((sum, li) => sum + li.quantity * li.rate, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  async function createInvoice() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientEmail: clientEmail || undefined,
          clientAddress: clientAddress || undefined,
          dueDate: dueDate || undefined,
          taxRate,
          notes: notes || undefined,
          lineItems: lineItems.filter((li) => li.description.trim()),
          timeEntryIds: selectedEntryIds,
        }),
      });
      if (res.ok) {
        // Refresh invoices
        const listRes = await fetch("/api/admin/invoices");
        if (listRes.ok) setInvoices(await listRes.json());
        resetForm();
      }
    } catch {
      // ignore
    }
    setSaving(false);
  }

  async function deleteInvoice(id: string) {
    if (!confirm("Delete this invoice?")) return;
    const res = await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
    if (res.ok) {
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    }
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/invoices/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
      );
    }
  }

  return (
    <AdminLayout title="Invoices">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
          >
            {showForm ? "Cancel" : "Create Invoice"}
          </button>
        </div>

        {/* Create Invoice Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              New Invoice
            </h2>

            {/* Client Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name *
                </label>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Email
                </label>
                <input
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Address
                </label>
                <textarea
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Line Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Line Items
                </h3>
                <div className="flex gap-2">
                  {uninvoicedEntries.length > 0 && (
                    <button
                      onClick={importTimeEntries}
                      className="text-xs px-3 py-1 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      Import from Time Entries ({uninvoicedEntries.length}{" "}
                      tickets)
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setLineItems([...lineItems, { ...emptyLineItem }])
                    }
                    className="text-xs px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    + Add Line Item
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">
                        Description
                      </th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 w-24">
                        Type
                      </th>
                      <th className="text-right px-3 py-2 text-xs font-medium text-gray-500 w-24">
                        Qty/Hrs
                      </th>
                      <th className="text-right px-3 py-2 text-xs font-medium text-gray-500 w-24">
                        Rate ($)
                      </th>
                      <th className="text-right px-3 py-2 text-xs font-medium text-gray-500 w-24">
                        Amount
                      </th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="px-3 py-2">
                          <input
                            value={item.description}
                            onChange={(e) =>
                              updateLineItem(i, "description", e.target.value)
                            }
                            placeholder="Description"
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={item.type}
                            onChange={(e) =>
                              updateLineItem(i, "type", e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="fixed">Fixed</option>
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={item.quantity || ""}
                            onChange={(e) =>
                              updateLineItem(
                                i,
                                "quantity",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            type="number"
                            step="0.25"
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm text-right"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={item.rate || ""}
                            onChange={(e) =>
                              updateLineItem(
                                i,
                                "rate",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            type="number"
                            step="0.01"
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm text-right"
                          />
                        </td>
                        <td className="px-3 py-2 text-right text-sm font-medium">
                          ${(item.quantity * item.rate).toFixed(2)}
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() =>
                              setLineItems(lineItems.filter((_, j) => j !== i))
                            }
                            className="text-red-400 hover:text-red-600 text-sm"
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm gap-2">
                  <span className="text-gray-500">Tax</span>
                  <div className="flex items-center gap-1">
                    <input
                      value={taxRate || ""}
                      onChange={(e) =>
                        setTaxRate(parseFloat(e.target.value) || 0)
                      }
                      type="number"
                      step="0.1"
                      className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-right"
                    />
                    <span className="text-gray-500">%</span>
                    <span className="ml-2 font-medium">
                      ${taxAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Payment terms, additional notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={createInvoice}
                disabled={!clientName.trim() || saving}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Invoice"}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Invoice List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Invoice #
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Client
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(inv.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {inv.clientName}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={inv.status}
                      onChange={(e) => updateStatus(inv.id, e.target.value)}
                      className={`text-xs font-medium rounded-full px-2 py-0.5 border-0 ${statusBadge[inv.status] || statusBadge.draft}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                    ${inv.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          window.open(
                            `/api/admin/invoices/${inv.id}?pdf=true`,
                            "_blank"
                          )
                        }
                        className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => deleteInvoice(inv.id)}
                        className="text-xs px-2 py-1 text-red-600 border border-red-200 rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No invoices yet. Create your first invoice above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

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
