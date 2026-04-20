import { Router } from "express";
import * as notesController from "../controllers/notes.js";
import { verifyJWT } from "../middlewares/verifyJwt.js";

export const notesRoutes = Router();

// ---------- Notes ----------
notesRoutes.get("/", verifyJWT, notesController.getAllNotes);
notesRoutes.get("/:id", verifyJWT, notesController.getNote);
notesRoutes.post("/", verifyJWT, notesController.postNote);
notesRoutes.put("/:id", verifyJWT, notesController.putNote);
notesRoutes.delete("/:id", verifyJWT, notesController.deleteNoteController);

// ---------- Boxes ----------
notesRoutes.post("/:id/boxes", verifyJWT, notesController.postBox);
notesRoutes.put("/:id/boxes/reorder", verifyJWT, notesController.putReorderBoxes);
notesRoutes.put("/:id/boxes/:boxId", verifyJWT, notesController.putBox);
notesRoutes.delete("/:id/boxes/:boxId", verifyJWT, notesController.deleteBoxController);