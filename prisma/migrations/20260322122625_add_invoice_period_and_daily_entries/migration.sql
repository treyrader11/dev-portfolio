-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "fromPhone" TEXT,
ADD COLUMN     "hourlyRate" DOUBLE PRECISION,
ADD COLUMN     "periodEnd" TIMESTAMP(3),
ADD COLUMN     "periodStart" TIMESTAMP(3),
ADD COLUMN     "totalHours" DOUBLE PRECISION,
ADD COLUMN     "workSummary" TEXT[];

-- AlterTable
ALTER TABLE "InvoiceLineItem" ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "dayOfWeek" TEXT;
