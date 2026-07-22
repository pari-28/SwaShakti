import prisma from "../config/prisma";

class EmergencyService {
  async create(userId: string, data: any) {
    const { name, phone, relation } = data;

    const contact = await prisma.emergencyContact.create({
      data: {
        name,
        phone,
        relation,
        userId,
      },
    });

    return contact;
  }

  async getAll(userId: string) {
    return await prisma.emergencyContact.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async update(userId: string, contactId: string, data: any) {
    const contact = await prisma.emergencyContact.findFirst({
      where: {
        id: contactId,
        userId,
      },
    });

    if (!contact) {
      throw new Error("Emergency contact not found");
    }

    return await prisma.emergencyContact.update({
      where: {
        id: contactId,
      },
      data,
    });
  }

  async delete(userId: string, contactId: string) {
    const contact = await prisma.emergencyContact.findFirst({
      where: {
        id: contactId,
        userId,
      },
    });

    if (!contact) {
      throw new Error("Emergency contact not found");
    }

    await prisma.emergencyContact.delete({
      where: {
        id: contactId,
      },
    });

    return {
      message: "Emergency contact deleted successfully",
    };
  }
}

export default new EmergencyService();