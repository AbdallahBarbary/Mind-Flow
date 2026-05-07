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

type User = AuthResponse["user"];

type MindFlowState = {
  token: string | null;
  user: User | null;
  notes: NoteDto[];
  sessions: FocusSessionDto[];
  stats: StatsDto;
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
};

const sessionKey = "mindflow-session";

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
      isLoading: false,

      hydrateSession: async () => {
        const raw = await AsyncStorage.getItem(sessionKey);
        if (!raw) return;
        const saved = JSON.parse(raw) as { token: string; user: User };
        setAuthToken(saved.token);
        set(saved);
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
      },

      fetchStats: async () => {
        const { data } = await api.get<StatsDto>("/stats");
        set({ stats: data });
      }
    }));
