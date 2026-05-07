import { prisma } from "../config/prisma.js";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysBetween(a: Date, b: Date) {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86400000);
}

export async function getStats(userId: string) {
  const [sessions, notesCount] = await Promise.all([
    prisma.focusSession.findMany({
      where: { userId, completed: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.note.count({ where: { userId } })
  ]);

  const totalFocusMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
  const completedSessions = sessions.length;
  const today = startOfDay(new Date());

  const weeklyMinutes = Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - offset));
    return sessions
      .filter((session) => daysBetween(session.createdAt, day) === 0)
      .reduce((sum, session) => sum + session.duration, 0);
  });

  const activeDays = new Set(sessions.map((session) => startOfDay(session.createdAt).toISOString()));
  let streakDays = 0;
  for (let offset = 0; offset < 365; offset += 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    if (!activeDays.has(day.toISOString())) break;
    streakDays += 1;
  }

  return {
    totalFocusMinutes,
    completedSessions,
    streakDays,
    weeklyMinutes,
    notesCount
  };
}
