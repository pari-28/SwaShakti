import prisma from "./src/config/prisma.ts";

async function main() {
  const result = await prisma.publicReferenceIncident.aggregate({
    _count: {
      _all: true,
      city: true,
      district: true,
      state: true,
      latitude: true,
      longitude: true,
    },
  });

  console.log("\n=== PUBLIC REFERENCE DATA COUNTS ===");
  console.table(result._count);

  const cities = await prisma.publicReferenceIncident.findMany({
    select: {
      city: true,
    },
    distinct: ["city"],
    orderBy: {
      city: "asc",
    },
    take: 30,
  });

  console.log("\n=== SAMPLE CITY VALUES ===");
  console.table(cities);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });