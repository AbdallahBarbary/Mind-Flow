import { Router } from "express";
import {
  getFocusSessionById,
  getFocusSessions,
  postFocusSession
} from "../controllers/focus.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const focusRoutes = Router();

focusRoutes.use(requireAuth);
focusRoutes.get("/", getFocusSessions);
focusRoutes.post("/", postFocusSession);
focusRoutes.get("/:id", getFocusSessionById);
