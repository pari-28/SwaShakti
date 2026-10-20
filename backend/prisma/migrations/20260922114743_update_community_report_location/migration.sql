/*
  Warnings:

  - Added the required column `location` to the `CommunityReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommunityReport"
ADD COLUMN "location" TEXT NOT NULL DEFAULT 'Unknown';

ALTER TABLE "CommunityReport"
ALTER COLUMN "latitude" DROP NOT NULL;

ALTER TABLE "CommunityReport"
ALTER COLUMN "longitude" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "CommunityReport_location_idx" ON "CommunityReport"("location");
