import { prisma } from "../config/prisma.js";
import { assertFound } from "../utils/http.js";

export function listFocusSessions(userId: string) {
  return prisma.focusSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
}

export function createFocusSession(userId: string, duration: number, completed: boolean) {
  return prisma.focusSession.create({
    data: {
      userId,
      duration,
      completed
    }
  });
}

export async function getFocusSession(userId: string, id: string) {
  return assertFound(
    await prisma.focusSession.findFirst({
      where: { id, userId }
    })
  );
}
