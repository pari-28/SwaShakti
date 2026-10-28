import prisma from "../src/config/prisma.js";

async function main() {
  const labels = ["Kerala", "Bangalore", "Bengaluru"];

  for (const label of labels) {
    console.log(`\n=== ${label}: Public reference records ===`);

    const publicRecords = await prisma.publicReferenceIncident.findMany({
      where: { city: { equals: label, mode: "insensitive" } },
      select: {
        source: true,
        sourceRecordId: true,
        city: true,
        state: true,
        district: true,
        category: true,
      },
      take: 10,
    });

    console.log(JSON.stringify(publicRecords, null, 2));

    console.log(`\n=== ${label}: Submitted community reports ===`);

    const communityRecords = await prisma.communityReport.findMany({
      where: {
        city: { equals: label, mode: "insensitive" },
        status: "SUBMITTED",
      },
      select: {
        city: true,
        state: true,
        district: true,
        category: true,
        location: true,
      },
      take: 10,
    });

    console.log(JSON.stringify(communityRecords, null, 2));
  }
}

main()
  .catch((error) => {
    console.error("Audit failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
