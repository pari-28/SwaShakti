-- CreateTable
CREATE TABLE "CommunityReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "locationPrecision" TEXT NOT NULL DEFAULT 'APPROXIMATE',
    "city" TEXT,
    "district" TEXT,
    "state" TEXT,
    "occurredAt" TIMESTAMP(3),
    "evidenceUrl" TEXT,
    "evidencePublicId" TEXT,
    "evidenceType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunityReport_userId_idx" ON "CommunityReport"("userId");

-- CreateIndex
CREATE INDEX "CommunityReport_category_idx" ON "CommunityReport"("category");

-- CreateIndex
CREATE INDEX "CommunityReport_city_idx" ON "CommunityReport"("city");

-- CreateIndex
CREATE INDEX "CommunityReport_occurredAt_idx" ON "CommunityReport"("occurredAt");

-- CreateIndex
CREATE INDEX "CommunityReport_status_idx" ON "CommunityReport"("status");

-- AddForeignKey
ALTER TABLE "CommunityReport" ADD CONSTRAINT "CommunityReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
