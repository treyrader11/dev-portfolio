import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

interface LineItem {
  description: string;
  type: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceProps {
  invoiceNumber: string;
  date: string;
  dueDate: string | null;
  fromName: string;
  fromEmail: string | null;
  fromAddress: string | null;
  clientName: string;
  clientEmail: string | null;
  clientAddress: string | null;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string | null;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  invoiceTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    letterSpacing: 2,
  },
  invoiceMeta: {
    textAlign: "right",
  },
  metaLabel: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  addresses: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  addressBlock: {
    width: "45%",
  },
  addressLabel: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  addressName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  addressText: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  colDescription: { width: "40%", fontSize: 9 },
  colType: { width: "15%", fontSize: 9, textAlign: "center" },
  colQty: { width: "15%", fontSize: 9, textAlign: "center" },
  colRate: { width: "15%", fontSize: 9, textAlign: "right" },
  colAmount: { width: "15%", fontSize: 9, textAlign: "right" },
  headerText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  totals: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  grandTotal: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 2,
    borderColor: "#111827",
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  grandTotalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  notes: {
    marginTop: 40,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
  notesLabel: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  notesText: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.4,
  },
});

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function InvoicePDF({
  invoiceNumber,
  date,
  dueDate,
  fromName,
  fromEmail,
  fromAddress,
  clientName,
  clientEmail,
  clientAddress,
  lineItems,
  subtotal,
  taxRate,
  taxAmount,
  total,
  notes,
}: InvoiceProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <View style={styles.invoiceMeta}>
            <Text style={styles.metaLabel}>Invoice Number</Text>
            <Text style={styles.metaValue}>{invoiceNumber}</Text>
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>{formatDate(date)}</Text>
            {dueDate && (
              <>
                <Text style={styles.metaLabel}>Due Date</Text>
                <Text style={styles.metaValue}>{formatDate(dueDate)}</Text>
              </>
            )}
          </View>
        </View>

        {/* Addresses */}
        <View style={styles.addresses}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>From</Text>
            <Text style={styles.addressName}>{fromName}</Text>
            {fromEmail && <Text style={styles.addressText}>{fromEmail}</Text>}
            {fromAddress && (
              <Text style={styles.addressText}>{fromAddress}</Text>
            )}
          </View>
          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>Bill To</Text>
            <Text style={styles.addressName}>{clientName}</Text>
            {clientEmail && (
              <Text style={styles.addressText}>{clientEmail}</Text>
            )}
            {clientAddress && (
              <Text style={styles.addressText}>{clientAddress}</Text>
            )}
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colDescription, styles.headerText]}>
            Description
          </Text>
          <Text style={[styles.colType, styles.headerText]}>Type</Text>
          <Text style={[styles.colQty, styles.headerText]}>Qty/Hrs</Text>
          <Text style={[styles.colRate, styles.headerText]}>Rate</Text>
          <Text style={[styles.colAmount, styles.headerText]}>Amount</Text>
        </View>

        {/* Table Rows */}
        {lineItems.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.colDescription}>{item.description}</Text>
            <Text style={styles.colType}>
              {item.type === "hourly" ? "Hourly" : "Fixed"}
            </Text>
            <Text style={styles.colQty}>
              {item.type === "hourly"
                ? `${item.quantity.toFixed(2)} hrs`
                : item.quantity}
            </Text>
            <Text style={styles.colRate}>{formatCurrency(item.rate)}</Text>
            <Text style={styles.colAmount}>{formatCurrency(item.amount)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          {taxRate > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({taxRate}%)</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(taxAmount)}
              </Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(total)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {notes && (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
