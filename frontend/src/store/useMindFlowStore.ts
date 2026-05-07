import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import {
  api,
  AuthResponse,
  FocusSessionDto,
  NoteDto,
  setAuthToken,
  StatsDto
} from "../services/api";
import * as Location from "expo-location";
import { fetchWeatherByCoords, WeatherSnapshot } from "../services/weather";

type User = AuthResponse["user"];

export type TaskDto = {
  id: string;
  title: string;
  dayKey: string; // YYYY-MM-DD in local time
  done: boolean;
  createdAt: string;
  completedAt?: string;
};

export type WeatherKind = "clear" | "rain";
export type WeatherState = {
  kind: WeatherKind;
  tempC?: number;
  label?: string;
  updatedAt?: string;
  isAuto: boolean;
};

export type StreakState = {
  days: number;
  lastActiveDayKey?: string;
  updatedAt?: string;
};

export type TaskMilestoneState = {
  pending: boolean;
  dayKey?: string;
  count?: number;
};

type MindFlowState = {
  token: string | null;
  user: User | null;
  notes: NoteDto[];
  sessions: FocusSessionDto[];
  stats: StatsDto;
  tasks: TaskDto[];
  weather: WeatherState;
  streak: StreakState;
  streakUnlockSeen: boolean;
  streakUnlockToastPending: boolean;
  taskMilestone: TaskMilestoneState;
  isLoading: boolean;
  hydrateSession: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchNotes: () => Promise<void>;
  createNote: (content: string) => Promise<void>;
  updateNote: (id: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  completeFocusSession: (duration: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  hydrateTasks: () => Promise<void>;
  addTask: (title: string, dayKey?: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  clearCompletedTasks: () => Promise<void>;
  setWeather: (weather: WeatherKind) => void;
  refreshWeather: () => Promise<void>;
  hydrateStreak: () => Promise<void>;
  acknowledgeStreakUnlock: () => Promise<void>;
  hydrateMilestones: () => Promise<void>;
  acknowledgeTaskMilestone: () => Promise<void>;
};

const sessionKey = "mindflow-session";
const tasksKey = "mindflow-tasks-v1";
const weatherKey = "mindflow-weather-v1";
const streakKey = "mindflow-streak-v1";
const streakUnlockSeenKey = "mindflow-streak-unlock-seen-v1";
const taskMilestoneKey = "mindflow-task-milestone-v1";

const defaultStats: StatsDto = {
  totalFocusMinutes: 138,
  completedSessions: 12,
  streakDays: 7,
  weeklyMinutes: [24, 42, 18, 51, 37, 62, 48],
  notesCount: 18
};

async function persistSession(token: string | null, user: User | null) {
  if (!token || !user) {
    await AsyncStorage.removeItem(sessionKey);
    return;
  }

  await AsyncStorage.setItem(sessionKey, JSON.stringify({ token, user }));
}

async function persistTasks(tasks: TaskDto[]) {
  await AsyncStorage.setItem(tasksKey, JSON.stringify(tasks));
}

async function persistStreak(streak: StreakState) {
  await AsyncStorage.setItem(streakKey, JSON.stringify(streak));
}

async function persistStreakUnlockSeen(value: boolean) {
  await AsyncStorage.setItem(streakUnlockSeenKey, value ? "1" : "0");
}

async function persistTaskMilestoneSeen(dayKey: string, count: number) {
  await AsyncStorage.setItem(taskMilestoneKey, JSON.stringify({ dayKey, count }));
}

function toDayKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dayKeyToDate(dayKey: string) {
  const [y, m, d] = dayKey.split("-").map((v) => Number(v));
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function diffDays(aDayKey: string, bDayKey: string) {
  const a = dayKeyToDate(aDayKey);
  const b = dayKeyToDate(bDayKey);
  const ms = a.getTime() - b.getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

async function bumpStreak(activeDayKey: string, set: any, get: any) {
  const prev = get().streak as StreakState;
  const last = prev.lastActiveDayKey;
  const updatedAt = new Date().toISOString();

  if (!last) {
    const next = { days: 1, lastActiveDayKey: activeDayKey, updatedAt };
    set((s: any) => ({ streak: next, stats: { ...s.stats, streakDays: next.days } }));
    await persistStreak(next);
    if (!get().streakUnlockSeen) set({ streakUnlockToastPending: true });
    return;
  }

  const delta = diffDays(activeDayKey, last);
  if (delta === 0) return;
  const nextDays = delta === 1 ? prev.days + 1 : 1;
  const next = { days: nextDays, lastActiveDayKey: activeDayKey, updatedAt };
  set((s: any) => ({ streak: next, stats: { ...s.stats, streakDays: next.days } }));
  await persistStreak(next);
  if (nextDays === 1 && prev.days === 0 && !get().streakUnlockSeen) set({ streakUnlockToastPending: true });
}

export const useMindFlowStore = create<MindFlowState>()((set, get) => ({
      token: null,
      user: null,
      notes: [
        {
          id: "local-1",
          content:
            "Finish the smallest useful version, then let the next layer reveal itself.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      sessions: [],
      stats: defaultStats,
      tasks: [
        {
          id: "task-1",
          title: "Add your first task",
          dayKey: toDayKey(new Date()),
          done: false,
          createdAt: new Date().toISOString()
        }
      ],
      weather: { kind: "rain", isAuto: true },
      streak: { days: 0 },
      streakUnlockSeen: false,
      streakUnlockToastPending: false,
      taskMilestone: { pending: false },
      isLoading: false,

      hydrateSession: async () => {
        const raw = await AsyncStorage.getItem(sessionKey);
        if (!raw) return;
        const saved = JSON.parse(raw) as { token: string; user: User };
        setAuthToken(saved.token);
        set(saved);
      },

      hydrateTasks: async () => {
        const raw = await AsyncStorage.getItem(tasksKey);
        if (raw) {
          const saved = JSON.parse(raw) as TaskDto[];
          // Migrate old tasks that didn't have dayKey.
          const migrated = saved.map((t) => ({
            ...t,
            dayKey: (t as TaskDto).dayKey ?? toDayKey(new Date(t.createdAt ?? Date.now()))
          }));
          set({ tasks: migrated });
          await persistTasks(migrated);
        }
        const savedWeather = await AsyncStorage.getItem(weatherKey);
        if (savedWeather) {
          try {
            const parsed = JSON.parse(savedWeather) as WeatherState;
            if (parsed && (parsed.kind === "clear" || parsed.kind === "rain")) set({ weather: parsed });
          } catch {
            if (savedWeather === "clear" || savedWeather === "rain") set({ weather: { kind: savedWeather, isAuto: false } });
          }
        }
      },

      acknowledgeStreakUnlock: async () => {
        set({ streakUnlockToastPending: false, streakUnlockSeen: true });
        await persistStreakUnlockSeen(true);
      },

      hydrateMilestones: async () => {
        const raw = await AsyncStorage.getItem(taskMilestoneKey);
        if (!raw) return;
        try {
          const parsed = JSON.parse(raw) as { dayKey?: string; count?: number };
          if (parsed?.dayKey && typeof parsed.count === "number") {
            set({ taskMilestone: { pending: false, dayKey: parsed.dayKey, count: parsed.count } });
          }
        } catch {
          // ignore
        }
      },

      acknowledgeTaskMilestone: async () => {
        set((s) => ({ taskMilestone: { ...s.taskMilestone, pending: false } }));
      },

      hydrateStreak: async () => {
        const raw = await AsyncStorage.getItem(streakKey);
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as StreakState;
            if (parsed && typeof parsed.days === "number") set({ streak: parsed });
          } catch {
            // ignore
          }
        }
        const seen = await AsyncStorage.getItem(streakUnlockSeenKey);
        if (seen === "1") set({ streakUnlockSeen: true });
      },

      register: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post<AuthResponse>("/auth/register", {
            email,
            password
          });
          setAuthToken(data.token);
          await persistSession(data.token, data.user);
          set({ token: data.token, user: data.user });
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post<AuthResponse>("/auth/login", {
            email,
            password
          });
          setAuthToken(data.token);
          await persistSession(data.token, data.user);
          set({ token: data.token, user: data.user });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        setAuthToken(null);
        void persistSession(null, null);
        set({ token: null, user: null });
      },

      fetchNotes: async () => {
        const { data } = await api.get<NoteDto[]>("/notes");
        set({ notes: data });
      },

      createNote: async (content) => {
        const { data } = await api.post<NoteDto>("/notes", { content });
        set({ notes: [data, ...get().notes] });
        void bumpStreak(toDayKey(new Date()), set, get);
      },

      updateNote: async (id, content) => {
        const { data } = await api.put<NoteDto>(`/notes/${id}`, { content });
        set({
          notes: get().notes.map((note) => (note.id === id ? data : note))
        });
      },

      deleteNote: async (id) => {
        await api.delete(`/notes/${id}`);
        set({ notes: get().notes.filter((note) => note.id !== id) });
      },

      completeFocusSession: async (duration) => {
        const { data } = await api.post<FocusSessionDto>("/focus-sessions", {
          duration,
          completed: true
        });
        set({ sessions: [data, ...get().sessions] });
        await get().fetchStats();
        void bumpStreak(toDayKey(new Date()), set, get);
      },

      fetchStats: async () => {
        const { data } = await api.get<StatsDto>("/stats");
        set({ stats: data });
      },

      addTask: async (title, dayKey) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        const task: TaskDto = {
          id: `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          title: trimmed,
          dayKey: dayKey ?? toDayKey(new Date()),
          done: false,
          createdAt: new Date().toISOString()
        };
        const next = [task, ...get().tasks];
        set({ tasks: next });
        await persistTasks(next);
        await bumpStreak(task.dayKey, set, get);
      },

      toggleTask: async (id) => {
        const now = new Date().toISOString();
        let toggledDayKey: string | undefined;
        let becameDone = false;
        const next = get().tasks.map((t) => {
          if (t.id !== id) return t;
          const nextDone = !t.done;
          toggledDayKey = t.dayKey;
          becameDone = nextDone;
          return { ...t, done: nextDone, completedAt: nextDone ? now : undefined };
        });
        set({ tasks: next });
        await persistTasks(next);

        if (!becameDone || !toggledDayKey) return;
        // Milestone: every 5 completed tasks in a day (calm toast)
        const completedCount = next.filter((t) => t.dayKey === toggledDayKey && t.done).length;
        if (completedCount > 0 && completedCount % 5 === 0) {
          const raw = await AsyncStorage.getItem(taskMilestoneKey);
          let already = false;
          if (raw) {
            try {
              const parsed = JSON.parse(raw) as { dayKey?: string; count?: number };
              if (parsed?.dayKey === toggledDayKey && parsed?.count === completedCount) already = true;
            } catch {
              // ignore
            }
          }
          if (!already) {
            set({ taskMilestone: { pending: true, dayKey: toggledDayKey, count: completedCount } });
            await persistTaskMilestoneSeen(toggledDayKey, completedCount);
          }
        }
        await bumpStreak(toggledDayKey, set, get);
      },

      clearCompletedTasks: async () => {
        const next = get().tasks.filter((t) => !t.done);
        set({ tasks: next });
        await persistTasks(next);
      },

      setWeather: (weather) => {
        const next: WeatherState = {
          ...get().weather,
          kind: weather,
          isAuto: false,
          updatedAt: new Date().toISOString()
        };
        set({ weather: next });
        void AsyncStorage.setItem(weatherKey, JSON.stringify(next));
      },

      refreshWeather: async () => {
        try {
          const perm = await Location.requestForegroundPermissionsAsync();
          if (perm.status !== "granted") return;
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced
          });
          const snap: WeatherSnapshot = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
          const next: WeatherState = {
            kind: snap.isRaining ? "rain" : "clear",
            tempC: snap.tempC,
            label: snap.label,
            updatedAt: snap.updatedAt,
            isAuto: true
          };
          set({ weather: next });
          await AsyncStorage.setItem(weatherKey, JSON.stringify(next));
        } catch {
          // If weather fails, keep last known state.
        }
      }
    }));
