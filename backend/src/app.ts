import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { authRoutes } from "./routes/auth.routes.js";
import { focusRoutes } from "./routes/focus.routes.js";
import { noteRoutes } from "./routes/note.routes.js";
import { statsRoutes } from "./routes/stats.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (env.CORS_ORIGIN === "*") return callback(null, true);
      const allowlist = env.CORS_ORIGIN.split(",").map((value) => value.trim());
      return callback(null, allowlist.includes(origin));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    name: "MindFlow API",
    message: "Backend is running.",
    endpoints: {
      health: "/health",
      auth: "/auth",
      notes: "/notes",
      focusSessions: "/focus-sessions",
      stats: "/stats"
    }
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, name: "MindFlow API" });
});

app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/focus-sessions", focusRoutes);
app.use("/stats", statsRoutes);

app.use(errorMiddleware);
