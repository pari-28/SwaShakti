/*
  Warnings:

  - A unique constraint covering the columns `[source,sourceRecordId]` on the table `PublicReferenceIncident` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PublicReferenceIncident_source_sourceRecordId_key" ON "PublicReferenceIncident"("source", "sourceRecordId");
