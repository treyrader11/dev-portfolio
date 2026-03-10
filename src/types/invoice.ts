export interface TimeEntryData {
  id: string;
  ticketKey: string;
  ticketSummary: string;
  projectKey: string | null;
  projectName: string | null;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  notes: string | null;
  invoiceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineItemData {
  id: string;
  description: string;
  type: string;
  quantity: number;
  rate: number;
  amount: number;
  ticketKey: string | null;
  sortOrder: number;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string | null;
  status: string;
  clientName: string;
  clientEmail: string | null;
  clientAddress: string | null;
  fromName: string;
  fromEmail: string | null;
  fromAddress: string | null;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string | null;
  lineItems: InvoiceLineItemData[];
  createdAt: string;
  updatedAt: string;
}
