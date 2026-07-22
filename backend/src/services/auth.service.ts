import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

export class AuthService {
  async register(data: any) {
    const { fullName, email, password, phone } = data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
    data: {
        fullName,
        email,
        password: hashedPassword,
        phone,
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
}