import prisma from "../src/config/prisma.js";

async function main() {
  const count = await prisma.publicReferenceIncident.count();

  console.log(`PublicReferenceIncident count: ${count}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });