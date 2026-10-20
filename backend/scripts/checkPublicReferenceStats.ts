import prisma from "../src/config/prisma.js";

async function main() {
  const result = await prisma.$queryRaw<
    Array<{
      total: bigint;
      distinctIds: bigint;
      minId: number | null;
      maxId: number | null;
    }>
  >`
    SELECT
      COUNT(*) AS total,
      COUNT(DISTINCT "sourceRecordId") AS "distinctIds",
      MIN(CAST("sourceRecordId" AS INTEGER)) AS "minId",
      MAX(CAST("sourceRecordId" AS INTEGER)) AS "maxId"
    FROM "PublicReferenceIncident";
  `;

  console.log("Public Reference Data statistics:");
  console.log("Total rows:", result[0].total.toString());
  console.log("Distinct source IDs:", result[0].distinctIds.toString());
  console.log("Minimum source ID:", result[0].minId);
  console.log("Maximum source ID:", result[0].maxId);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });