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

// ---------- Blocks ----------
notesRoutes.post("/:id/blocks", verifyJWT, notesController.postBlock);
notesRoutes.put("/:id/blocks/reorder", verifyJWT, notesController.putReorderBlocks);
notesRoutes.put("/:id/blocks/:blockId", verifyJWT, notesController.putBlock);
notesRoutes.delete("/:id/blocks/:blockId", verifyJWT, notesController.deleteBlockController);