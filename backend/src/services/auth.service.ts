import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { HttpError } from "../utils/http.js";
import { signToken } from "../utils/jwt.js";

const rounds = 12;

function toAuthResponse(user: { id: string; email: string; createdAt: Date }) {
  return {
    token: signToken({ sub: user.id, email: user.email }),
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt.toISOString()
    }
  };
}

export async function registerUser(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new HttpError(409, "Email already exists");
  }

  const hashed = await bcrypt.hash(password, rounds);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed
    }
  });

  return toAuthResponse(user);
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new HttpError(401, "Invalid email or password");
  }

  return toAuthResponse(user);
}
