import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

export class AuthService {
  async register(data: any) {
    const {
  fullName,
  email,
  password,
  phone,
  emergencyContacts,
} = data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const existingPhone = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (existingPhone) {
      throw new Error("Phone number already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
  data: {
    fullName,
    email,
    password: hashedPassword,
    phone,

    emergencyContacts: {
      create: emergencyContacts.map((contact: any) => ({
        name: contact.name,
        phone: contact.phone,
        relation: contact.relation,
      })),
    },
  },

  include: {
    emergencyContacts: true,
  },
});

    const { password: _, ...userWithoutPassword } = user;

    const token = generateToken(user.id);

    return {
    token,
    user: userWithoutPassword,
    };
  }

  async login(data: any) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  const token = generateToken(user.id);

  return {
    token,
    user: userWithoutPassword,
  };
}

async saveFcmToken(userId: string, token: string) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      fcmToken: token,
    },
  });

  return {
    message: "FCM token saved successfully",
  };
}
}