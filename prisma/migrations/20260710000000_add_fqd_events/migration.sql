-- French Quarter Direct: additive migration (creates two new tables only).
-- Safe to apply with `prisma migrate deploy` — no existing tables are touched.

-- CreateTable
CREATE TABLE "FqdEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "startTime" TEXT,
    "locationName" TEXT,
    "address" TEXT,
    "description" TEXT,
    "admission" TEXT,
    "website" TEXT,
    "category" TEXT,
    "subcategory" TEXT,
    "ticketUrl" TEXT,
    "organizer" TEXT,
    "expectedAttendance" TEXT,
    "ageRequirement" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "rawResearch" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FqdEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FqdEventImage" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cloudinaryId" TEXT,
    "alt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FqdEventImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FqdEvent_slug_key" ON "FqdEvent"("slug");

-- CreateIndex
CREATE INDEX "FqdEventImage_eventId_idx" ON "FqdEventImage"("eventId");

-- AddForeignKey
ALTER TABLE "FqdEventImage" ADD CONSTRAINT "FqdEventImage_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FqdEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
