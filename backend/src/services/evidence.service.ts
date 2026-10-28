import prisma from "../config/prisma";


export class EvidenceService {
  static async createEvidence(data: {
    userId: string;
    sosId: string;
    type: "IMAGE" | "VIDEO" | "AUDIO";
    fileName: string;
    fileUrl: string;
    publicId?: string;
  }) {

    console.log("Creating evidence for SOS:", data.sosId);



const existingSOS = await prisma.sOSAlert.findUnique({
  where: {
    id: data.sosId,
  },
});

console.log("Existing SOS:", existingSOS);

    return prisma.evidence.create({
      data,
    });
  }

  static async getEvidenceBySOS(sosId: string) {
    return prisma.evidence.findMany({
      where: {
        sosId,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });
  }

  static async deleteEvidence(id: string) {
    return prisma.evidence.delete({
      where: {
        id,
      },
    });
  }
}