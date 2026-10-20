import prisma from "../src/config/prisma.js";

async function main() {
  const count = await prisma.publicReferenceIncident.count();

  const first = await prisma.publicReferenceIncident.findFirst({
    orderBy: {
      sourceRecordId: "asc",
    },
  });

  const last = await prisma.publicReferenceIncident.findFirst({
    orderBy: {
      sourceRecordId: "desc",
    },
  });

  console.log("PublicReferenceIncident count:", count);
  console.log("First sourceRecordId:", first?.sourceRecordId);
  console.log("Last sourceRecordId:", last?.sourceRecordId);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });