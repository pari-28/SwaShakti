-- CreateTable
CREATE TABLE "PublicReferenceIncident" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceRecordId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "crimeCode" TEXT,
    "crimeDomain" TEXT,
    "occurredAt" TIMESTAMP(3),
    "reportedAt" TIMESTAMP(3),
    "state" TEXT,
    "district" TEXT,
    "city" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "locationPrecision" TEXT NOT NULL DEFAULT 'CITY',
    "victimAge" INTEGER,
    "victimGender" TEXT,
    "weaponUsed" TEXT,
    "caseClosed" BOOLEAN,
    "caseClosedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicReferenceIncident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PublicReferenceIncident_city_idx" ON "PublicReferenceIncident"("city");

-- CreateIndex
CREATE INDEX "PublicReferenceIncident_category_idx" ON "PublicReferenceIncident"("category");

-- CreateIndex
CREATE INDEX "PublicReferenceIncident_occurredAt_idx" ON "PublicReferenceIncident"("occurredAt");

-- CreateIndex
CREATE INDEX "PublicReferenceIncident_source_idx" ON "PublicReferenceIncident"("source");

-- CreateIndex
CREATE INDEX "PublicReferenceIncident_sourceRecordId_idx" ON "PublicReferenceIncident"("sourceRecordId");
