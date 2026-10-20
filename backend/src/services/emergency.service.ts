import prisma from "../config/prisma";

class EmergencyService {
  async create(userId: string, data: any) {
    const { name, phone, email, relation } = data;

    const totalContacts = await prisma.emergencyContact.count({
  where: {
    userId,
  },
});

if (totalContacts >= 5) {
  throw new Error("Maximum 5 emergency contacts allowed.");
}

const existingPhone = await prisma.emergencyContact.findFirst({
  where: {
    userId,
    phone,
  },
});

if (existingPhone) {
  throw new Error("This phone number already exists.");
}

    const contact = await prisma.emergencyContact.create({
      data: {
  name,
  phone,
  email,
  relation,
  userId,
  isPrimary: totalContacts === 0,
},
    });

    return contact;
  }

  async getAll(userId: string) {
    return await prisma.emergencyContact.findMany({
      where: {
        userId,
      },
      orderBy: [
  {
    isPrimary: "desc",
  },
  {
    createdAt: "desc",
  },
],
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
if (data.phone) {
  const existingPhone = await prisma.emergencyContact.findFirst({
    where: {
      userId,
      phone: data.phone,
      NOT: {
        id: contactId,
      },
    },
  });

  if (existingPhone) {
    throw new Error("Phone number already exists.");
  }
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

    const wasPrimary = contact.isPrimary;

await prisma.emergencyContact.delete({
  where: {
    id: contactId,
  },
});

if (wasPrimary) {
  const nextContact = await prisma.emergencyContact.findFirst({
    where: { userId },
    orderBy: [
  {
    isPrimary: "desc",
  },
  {
    createdAt: "desc",
  },
],
  });

  if (nextContact) {
    await prisma.emergencyContact.update({
      where: {
        id: nextContact.id,
      },
      data: {
        isPrimary: true,
      },
    });
  }
}

return {
  message: "Emergency contact deleted successfully",
};
  }

  async setPrimary(userId: string, contactId: string) {
  const contact = await prisma.emergencyContact.findFirst({
    where: {
      id: contactId,
      userId,
    },
  });

  if (!contact) {
    throw new Error("Emergency contact not found.");
  }

  await prisma.emergencyContact.updateMany({
    where: {
      userId,
    },
    data: {
      isPrimary: false,
    },
  });

  return prisma.emergencyContact.update({
    where: {
      id: contactId,
    },
    data: {
      isPrimary: true,
    },
  });
}
}

export default new EmergencyService();