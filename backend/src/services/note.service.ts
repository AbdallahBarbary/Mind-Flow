import { prisma } from "../config/prisma.js";
import { assertFound } from "../utils/http.js";

export function listNotes(userId: string) {
  return prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });
}

export function createNote(userId: string, content: string) {
  return prisma.note.create({
    data: {
      userId,
      content
    }
  });
}

export async function updateNote(userId: string, id: string, content: string) {
  await assertFound(
    await prisma.note.findFirst({
      where: { id, userId }
    })
  );

  return prisma.note.update({
    where: { id },
    data: { content }
  });
}

export async function deleteNote(userId: string, id: string) {
  await assertFound(
    await prisma.note.findFirst({
      where: { id, userId }
    })
  );

  await prisma.note.delete({ where: { id } });
}
