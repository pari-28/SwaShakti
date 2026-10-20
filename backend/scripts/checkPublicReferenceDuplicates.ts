import prisma from "../src/config/prisma.js";

async function main() {
  const duplicates = await prisma.$queryRaw<
    Array<{
      sourceRecordId: string;
      count: bigint;
    }>
  >`
    SELECT
      "sourceRecordId",
      COUNT(*) AS count
    FROM "PublicReferenceIncident"
    GROUP BY "sourceRecordId"
    HAVING COUNT(*) > 1
    ORDER BY COUNT(*) DESC
    LIMIT 20;
  `;

  console.log("Duplicate sourceRecordIds:");

  if (duplicates.length === 0) {
    console.log("None");
    return;
  }

  for (const row of duplicates) {
    console.log(
      `${row.sourceRecordId}: ${row.count.toString()} records`
    );
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });