import { Router } from "express";
import { getNotes, postNote, putNote, removeNote } from "../controllers/note.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const noteRoutes = Router();

noteRoutes.use(requireAuth);
noteRoutes.get("/", getNotes);
noteRoutes.post("/", postNote);
noteRoutes.put("/:id", putNote);
noteRoutes.delete("/:id", removeNote);
