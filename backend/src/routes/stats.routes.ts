import { Router } from "express";
import { getUserStats } from "../controllers/stats.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const statsRoutes = Router();

statsRoutes.get("/", requireAuth, getUserStats);
