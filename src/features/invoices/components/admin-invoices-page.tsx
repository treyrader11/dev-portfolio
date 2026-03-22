import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/features/admin/components/admin-layout";
import {
  RiUploadLine,
  RiSparklingLine,
  RiMicLine,
  RiMicOffLine,
  RiLoader4Line,
  RiCloseLine,
} from "react-icons/ri";

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
  periodStart: string | null;
  periodEnd: string | null;
  status: string;
  clientName: string;
  clientEmail: string | null;
  clientAddress: string | null;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  hourlyRate: number | null;
  totalHours: number | null;
  notes: string | null;
  workSummary: string[];
  lineItems: Array<{
    id: string;
    description: string;
    type: string;
    quantity: number;
    rate: number;
    amount: number;
    ticketKey: string | null;
    date: string | null;
    dayOfWeek: string | null;
  }>;
  _count: { timeEntries: number };
}

interface UninvoicedEntry {
  ticketKey: string;
  ticketSummary: string;
  totalHours: number;
  entryIds: string[];
}

interface AIProvider {
  name: string;
  label: string;
  available: boolean;
}

export interface AdminInvoicesPageProps {
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

export function AdminInvoicesPage({
  invoices: initialInvoices,
  uninvoicedEntries,
}: AdminInvoicesPageProps) {
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

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Edit modal state
  const [showAIEdit, setShowAIEdit] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [aiProvider, setAIProvider] = useState("openai");
  const [aiProviders, setAIProviders] = useState<AIProvider[]>([]);
  const [aiLoading, setAILoading] = useState(false);
  const [aiError, setAIError] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);
  const [listening, setListening] = useState(false);

  // Voice typewriter refs (matching mardimix pattern)
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const voiceTargetRef = useRef("");
  const voiceRevealedRef = useRef(0);
  const voiceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voiceBaseLengthRef = useRef(0);

  // Cleanup voice timer on unmount
  useEffect(() => {
    return () => {
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current);
    };
  }, []);

  // Auto-resize textarea when prompt changes (voice input)
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [aiPrompt]);

  // Fetch AI providers when edit modal opens
  useEffect(() => {
    if (showAIEdit && aiProviders.length === 0) {
      fetch("/api/admin/invoices/providers")
        .then((res) => (res.ok ? res.json() : []))
        .then((data: AIProvider[]) => {
          setAIProviders(data);
          const first = data.find((p) => p.available);
          if (first) setAIProvider(first.name);
        })
        .catch(() => {});
    }
  }, [showAIEdit, aiProviders.length]);

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

  function applyParsedInvoice(data: {
    clientName?: string;
    clientEmail?: string | null;
    clientAddress?: string | null;
    dueDate?: string | null;
    taxRate?: number;
    notes?: string | null;
    lineItems?: Array<{
      description: string;
      type: string;
      quantity: number;
      rate: number;
    }>;
  }) {
    if (data.clientName) setClientName(data.clientName);
    if (data.clientEmail) setClientEmail(data.clientEmail);
    if (data.clientAddress) setClientAddress(data.clientAddress);
    if (data.dueDate) setDueDate(data.dueDate);
    if (data.taxRate) setTaxRate(data.taxRate);
    if (data.notes) setNotes(data.notes);
    if (data.lineItems && data.lineItems.length > 0) {
      setLineItems(
        data.lineItems.map((li) => ({
          description: li.description,
          type: li.type === "fixed" ? "fixed" : "hourly",
          quantity: li.quantity || 0,
          rate: li.rate || 0,
        }))
      );
    }
    setShowForm(true);
  }

  // ---------- Upload PDF ----------
  async function handleUploadPDF(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setUploadError("Please select a PDF file");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const res = await fetch("/api/admin/invoices/parse-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfBase64: base64, provider: aiProvider, autoSave: true }),
      });

      if (res.ok) {
        // Refresh invoice list since it was auto-saved
        const listRes = await fetch("/api/admin/invoices");
        if (listRes.ok) setInvoices(await listRes.json());
      } else {
        const err = await res.json();
        setUploadError(err.error || "Failed to parse PDF");
      }
    } catch {
      setUploadError("Failed to upload PDF");
    }

    setUploading(false);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ---------- Voice Input (mardimix pattern) ----------
  function flushVoiceReveal() {
    if (voiceTimerRef.current) {
      clearTimeout(voiceTimerRef.current);
      voiceTimerRef.current = null;
    }
    const target = voiceTargetRef.current;
    voiceRevealedRef.current = target.length;
    setAIPrompt(target);
  }

  async function polishPrompt(rawText: string) {
    const trimmed = rawText.trim();
    if (!trimmed) return;

    setIsPolishing(true);
    try {
      const res = await fetch("/api/admin/invoices/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      if (res.ok) {
        const { polished } = await res.json();
        if (polished) {
          voiceTargetRef.current = polished;
          voiceRevealedRef.current = polished.length;
          setAIPrompt(polished);
        }
      }
    } catch {
      // Keep raw text on failure
    }
    setIsPolishing(false);
  }

  function toggleVoiceInput() {
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      flushVoiceReveal();
      return;
    }

    const SpeechRecognitionAPI =
      typeof window !== "undefined"
        ? (window.SpeechRecognition ?? window.webkitSpeechRecognition)
        : null;

    if (!SpeechRecognitionAPI) {
      setAIError("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    const baseText = aiPrompt ? aiPrompt.trimEnd() + " " : "";
    voiceTargetRef.current = baseText;
    voiceRevealedRef.current = baseText.length;
    voiceBaseLengthRef.current = baseText.length;

    const TRIGGER_WORDS = /\b(finish|done|generate)\b\.?$/i;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalPart = "";
      let interimPart = "";
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalPart += transcript;
        } else {
          interimPart += transcript;
        }
      }

      const fullText = (baseText + finalPart).trimEnd();

      if (finalPart && TRIGGER_WORDS.test(fullText)) {
        const cleaned = fullText.replace(TRIGGER_WORDS, "").trimEnd();
        if (voiceTimerRef.current) {
          clearTimeout(voiceTimerRef.current);
          voiceTimerRef.current = null;
        }
        voiceTargetRef.current = cleaned;
        voiceRevealedRef.current = cleaned.length;
        setAIPrompt(cleaned);

        recognition.stop();
        polishPrompt(cleaned);
        return;
      }

      voiceTargetRef.current = fullText + (interimPart ? interimPart : "");

      if (!voiceTimerRef.current) {
        const tick = () => {
          const target = voiceTargetRef.current;
          const revealed = voiceRevealedRef.current;

          if (revealed > target.length) {
            voiceRevealedRef.current = target.length;
            setAIPrompt(target);
            voiceTimerRef.current = null;
            return;
          }

          if (revealed >= target.length) {
            voiceTimerRef.current = null;
            return;
          }

          voiceRevealedRef.current++;
          setAIPrompt(
            voiceTargetRef.current.slice(0, voiceRevealedRef.current)
          );
          voiceTimerRef.current = setTimeout(tick, 25);
        };
        voiceTimerRef.current = setTimeout(tick, 25);
      }
    };

    recognition.onstart = () => {};

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
      if (voiceTimerRef.current) {
        clearTimeout(voiceTimerRef.current);
        voiceTimerRef.current = null;
      }
      const target = voiceTargetRef.current;
      voiceRevealedRef.current = target.length;
      setAIPrompt(target);

      if (target.trim().length > 0) {
        polishPrompt(target);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setListening(false);
      recognitionRef.current = null;
      flushVoiceReveal();
      if (event.error !== "aborted") {
        setAIError(`Voice input error: ${event.error}`);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  // ---------- AI Edit Invoice ----------
  async function handleAIEdit() {
    if (!aiPrompt.trim()) return;

    setAILoading(true);
    setAIError("");

    const currentInvoice = {
      clientName,
      clientEmail: clientEmail || null,
      clientAddress: clientAddress || null,
      dueDate: dueDate || null,
      taxRate,
      notes: notes || null,
      lineItems: lineItems
        .filter((li) => li.description.trim())
        .map((li) => ({
          description: li.description,
          type: li.type,
          quantity: li.quantity,
          rate: li.rate,
        })),
    };

    try {
      const res = await fetch("/api/admin/invoices/edit-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          provider: aiProvider,
          invoice: currentInvoice,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        applyParsedInvoice(data.invoice);
        setShowAIEdit(false);
        setAIPrompt("");
      } else {
        const err = await res.json();
        setAIError(err.error || "AI editing failed");
      }
    } catch {
      setAIError("AI editing failed");
    }

    setAILoading(false);
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
          <div className="flex items-center gap-2">
            {/* Upload Invoice PDF */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleUploadPDF}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? (
                <RiLoader4Line className="w-4 h-4 animate-spin" />
              ) : (
                <RiUploadLine className="w-4 h-4" />
              )}
              {uploading ? "Parsing..." : "Upload Invoice"}
            </button>
            {/* Create Invoice */}
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
            >
              {showForm ? "Cancel" : "Create Invoice"}
            </button>
          </div>
        </div>

        {/* Upload Error */}
        {uploadError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center justify-between">
            <span>{uploadError}</span>
            <button onClick={() => setUploadError("")} className="text-red-400 hover:text-red-600">
              <RiCloseLine className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Create Invoice Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                New Invoice
              </h2>
              {/* AI Edit Button */}
              <button
                onClick={() => setShowAIEdit(true)}
                className="px-3 py-1.5 text-xs font-medium border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 flex items-center gap-1.5"
              >
                <RiSparklingLine className="w-3.5 h-3.5" />
                Edit with AI
              </button>
            </div>

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

        {/* AI Edit Modal */}
        <AnimatePresence>
          {showAIEdit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <RiSparklingLine className="w-5 h-5 text-purple-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Edit Invoice with AI</h2>
                  </div>
                  <button
                    onClick={() => {
                      setShowAIEdit(false);
                      setAIPrompt("");
                      setAIError("");
                      if (listening) {
                        recognitionRef.current?.stop();
                        setListening(false);
                      }
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <RiCloseLine className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-sm text-gray-500">
                    Describe the changes you want to make. Use the mic to dictate your prompt.
                  </p>

                  {/* Prompt textarea with voice input */}
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={aiPrompt}
                      onChange={(e) => setAIPrompt(e.target.value)}
                      disabled={aiLoading}
                      rows={4}
                      className={`w-full px-3 py-2 pr-12 border rounded-lg text-sm resize-none overflow-hidden transition-all ${
                        listening
                          ? "ring-2 ring-red-400 border-red-300 text-transparent caret-transparent"
                          : "border-gray-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                      }`}
                      placeholder={
                        listening
                          ? "Listening..."
                          : 'e.g. "Change the rate for all hourly items to $150" or "Add a 10% discount line item"'
                      }
                    />

                    {/* Voice typewriter overlay */}
                    {listening && aiPrompt && (
                      <div className="absolute inset-0 px-3 py-2 pr-12 text-sm text-gray-900 pointer-events-none whitespace-pre-wrap break-words overflow-hidden">
                        {aiPrompt.split("").map((char, i) => {
                          if (i < voiceBaseLengthRef.current) {
                            return <span key={i}>{char}</span>;
                          }
                          return (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0 }}
                              className="relative"
                            >
                              <span>{char}</span>
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{
                                  times: [0, 0.1, 1],
                                  duration: 0.125,
                                  ease: "easeInOut",
                                }}
                                className="absolute bottom-0 left-px right-0 top-0 bg-purple-400"
                              />
                            </motion.span>
                          );
                        })}
                      </div>
                    )}

                    {/* Mic button */}
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      disabled={aiLoading || isPolishing}
                      className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all disabled:opacity-40 ${
                        listening
                          ? "bg-red-100 text-red-500"
                          : "bg-purple-100 text-purple-500 hover:bg-purple-200"
                      }`}
                      title={listening ? "Stop listening" : "Voice input"}
                    >
                      <AnimatePresence mode="wait">
                        {listening ? (
                          <motion.div
                            key="mic-on"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ repeat: Infinity, duration: 1.2 }}
                          >
                            <RiMicLine className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="mic-off"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            <RiMicOffLine className="w-4 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>

                  {/* Polishing indicator */}
                  <AnimatePresence>
                    {isPolishing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-xs text-purple-600"
                      >
                        <RiLoader4Line className="w-3 h-3 animate-spin" />
                        <span>Polishing prompt...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Provider selector + Edit button */}
                  <div className="flex items-end gap-3">
                    <div className="w-48 space-y-1">
                      <label className="text-xs font-medium text-gray-500">AI Provider</label>
                      <select
                        value={aiProvider}
                        onChange={(e) => setAIProvider(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg"
                      >
                        {aiProviders.filter((p) => p.available).map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.label}
                          </option>
                        ))}
                        {aiProviders.filter((p) => p.available).length === 0 && (
                          <option value="">No providers configured</option>
                        )}
                      </select>
                    </div>
                    <button
                      onClick={handleAIEdit}
                      disabled={aiLoading || !aiPrompt.trim()}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {aiLoading ? (
                        <RiLoader4Line className="w-4 h-4 animate-spin" />
                      ) : (
                        <RiSparklingLine className="w-4 h-4" />
                      )}
                      {aiLoading ? "Editing..." : "Apply Changes"}
                    </button>
                  </div>

                  {/* AI Error */}
                  {aiError && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                      {aiError}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                  Period
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Client
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Hours
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
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {inv.periodStart && inv.periodEnd ? (
                      <>
                        {new Date(inv.periodStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {" – "}
                        {new Date(inv.periodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {inv.clientName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {inv.totalHours ? (
                      <span>
                        {inv.totalHours} hrs
                        {inv.hourlyRate ? (
                          <span className="text-gray-400"> @ ${inv.hourlyRate}/hr</span>
                        ) : null}
                      </span>
                    ) : (
                      "—"
                    )}
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
                    colSpan={8}
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
