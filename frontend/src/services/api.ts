import axios from "axios";

declare const process: {
  env: {
    EXPO_PUBLIC_API_URL?: string;
  };
};

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

export const api = axios.create({
  baseURL,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json"
  }
});

export function setAuthToken(token?: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
}

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    createdAt: string;
  };
};

export type NoteDto = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type FocusSessionDto = {
  id: string;
  duration: number;
  completed: boolean;
  createdAt: string;
};

export type StatsDto = {
  totalFocusMinutes: number;
  completedSessions: number;
  streakDays: number;
  weeklyMinutes: number[];
  notesCount: number;
};
