import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

interface LineItem {
  description: string;
  type: string;
  quantity: number;
  rate: number;
  amount: number;
  date: string | null;
  dayOfWeek: string | null;
}

interface InvoiceProps {
  invoiceNumber: string;
  date: string;
  dueDate: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  fromName: string;
  fromEmail: string | null;
  fromAddress: string | null;
  fromPhone: string | null;
  clientName: string;
  clientEmail: string | null;
  clientAddress: string | null;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  hourlyRate: number | null;
  totalHours: number | null;
  notes: string | null;
  workSummary: string[];
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
  headerLeft: {},
  invoiceTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    letterSpacing: 2,
  },
  clientLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
  },
  clientName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
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
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 8,
    marginTop: 20,
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
  tableRowMuted: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fafafa",
  },
  // Daily time log columns
  colDate: { width: "20%", fontSize: 9 },
  colDay: { width: "20%", fontSize: 9 },
  colDesc: { width: "40%", fontSize: 9 },
  colHrs: { width: "20%", fontSize: 9, textAlign: "right" as const },
  // Standard line item columns
  colDescription: { width: "40%", fontSize: 9 },
  colType: { width: "15%", fontSize: 9, textAlign: "center" as const },
  colQty: { width: "15%", fontSize: 9, textAlign: "center" as const },
  colRate: { width: "15%", fontSize: 9, textAlign: "right" as const },
  colAmount: { width: "15%", fontSize: 9, textAlign: "right" as const },
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
  workSummary: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
  bulletPoint: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.6,
    marginBottom: 2,
  },
  notes: {
    marginTop: 20,
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
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    paddingTop: 8,
    fontSize: 8,
    color: "#9ca3af",
    textAlign: "center",
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

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export function InvoicePDF({
  invoiceNumber,
  date,
  dueDate,
  periodStart,
  periodEnd,
  fromName,
  fromEmail,
  fromAddress,
  fromPhone,
  clientName,
  clientEmail,
  clientAddress,
  lineItems,
  subtotal,
  taxRate,
  taxAmount,
  total,
  hourlyRate,
  totalHours,
  notes,
  workSummary,
}: InvoiceProps) {
  const hasDailyEntries = lineItems.some((li) => li.date);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.clientName}>{clientName}</Text>
          </View>
          <View style={styles.invoiceMeta}>
            <Text style={styles.metaLabel}>Invoice Number</Text>
            <Text style={styles.metaValue}>{invoiceNumber}</Text>
            <Text style={styles.metaLabel}>Invoice Date</Text>
            <Text style={styles.metaValue}>{formatDate(date)}</Text>
            {periodStart && periodEnd && (
              <>
                <Text style={styles.metaLabel}>Invoice Period</Text>
                <Text style={styles.metaValue}>
                  {formatDate(periodStart)} – {formatDate(periodEnd)}
                </Text>
              </>
            )}
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
            <Text style={styles.addressLabel}>Bill From</Text>
            <Text style={styles.addressName}>{fromName}</Text>
            {fromPhone && <Text style={styles.addressText}>{fromPhone}</Text>}
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

        {/* Hours Logged — Daily time log format */}
        {hasDailyEntries ? (
          <>
            <Text style={styles.sectionTitle}>Hours Logged</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.colDate, styles.headerText]}>Date</Text>
              <Text style={[styles.colDay, styles.headerText]}>Day</Text>
              <Text style={[styles.colDesc, styles.headerText]}>Description</Text>
              <Text style={[styles.colHrs, styles.headerText]}>Hrs</Text>
            </View>
            {lineItems.map((item, i) => (
              <View
                key={i}
                style={item.quantity === 0 ? styles.tableRowMuted : styles.tableRow}
              >
                <Text style={styles.colDate}>
                  {item.date ? formatShortDate(item.date) : "—"}
                </Text>
                <Text style={styles.colDay}>{item.dayOfWeek || "—"}</Text>
                <Text style={styles.colDesc}>{item.description}</Text>
                <Text style={styles.colHrs}>
                  {item.quantity > 0 ? String(item.quantity) : "—"}
                </Text>
              </View>
            ))}

            {/* Totals summary */}
            <View style={styles.totals}>
              {totalHours != null && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Hours</Text>
                  <Text style={styles.totalValue}>{totalHours} hrs</Text>
                </View>
              )}
              {hourlyRate != null && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Rate</Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(hourlyRate)} / hr
                  </Text>
                </View>
              )}
              {taxRate > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tax ({taxRate}%)</Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(taxAmount)}
                  </Text>
                </View>
              )}
              <View style={styles.grandTotal}>
                <Text style={styles.grandTotalLabel}>Total Due</Text>
                <Text style={styles.grandTotalValue}>
                  {formatCurrency(total)}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Standard line items format */}
            <View style={styles.tableHeader}>
              <Text style={[styles.colDescription, styles.headerText]}>
                Description
              </Text>
              <Text style={[styles.colType, styles.headerText]}>Type</Text>
              <Text style={[styles.colQty, styles.headerText]}>Qty/Hrs</Text>
              <Text style={[styles.colRate, styles.headerText]}>Rate</Text>
              <Text style={[styles.colAmount, styles.headerText]}>Amount</Text>
            </View>
            {lineItems.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.colDescription}>{item.description}</Text>
                <Text style={styles.colType}>
                  {item.type === "hourly" ? "Hourly" : "Fixed"}
                </Text>
                <Text style={styles.colQty}>
                  {item.type === "hourly"
                    ? `${item.quantity.toFixed(2)} hrs`
                    : String(item.quantity)}
                </Text>
                <Text style={styles.colRate}>{formatCurrency(item.rate)}</Text>
                <Text style={styles.colAmount}>
                  {formatCurrency(item.amount)}
                </Text>
              </View>
            ))}

            <View style={styles.totals}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(subtotal)}
                </Text>
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
          </>
        )}

        {/* Work Summary */}
        {workSummary && workSummary.length > 0 && (
          <View style={styles.workSummary}>
            <Text style={styles.notesLabel}>Work Completed</Text>
            {workSummary.map((item, i) => (
              <Text key={i} style={styles.bulletPoint}>
                • {item}
              </Text>
            ))}
          </View>
        )}

        {/* Notes */}
        {notes && (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          {fromName}
          {fromPhone ? ` | ${fromPhone}` : ""}
          {` | ${clientName}`}
        </Text>
      </Page>
    </Document>
  );
}
