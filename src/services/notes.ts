import { notesRepository } from "../repositories/notes.js";
import {
  CreateBoxType,
  CreateNoteType,
  ReorderBoxesType,
  UpdateBoxType,
  UpdateNoteType,
} from "../schemas/notes.js";

// ---------- Notes ----------

export const findAllNotesByUser = async (userId: string) => {
  return notesRepository.findAllByUser(userId);
};

export const findNoteById = async (id: string, userId: string) => {
  return notesRepository.findById(id, userId);
};

export const createNote = async (data: CreateNoteType, userId: string) => {
  const note = await notesRepository.create(data, userId);

  // Toda anotação inicia com um bloco text vazio !!!
  await notesRepository.createBox(note!.id, userId, {
    type: "text",
    content: { text: "" },
    position: 0,
  });

  return note;
};

export const updateNote = async (id: string, userId: string, data: UpdateNoteType) => {
  return notesRepository.update(id, userId, data);
};

export const deleteNote = async (id: string, userId: string) => {
  return notesRepository.delete(id, userId);
};

// ---------- Boxes ----------

export const findBoxesByNote = async (notesId: string, userId: string) => {
  return notesRepository.findBoxesByNote(notesId, userId);
};

export const createBox = async (notesId: string, userId: string, data: CreateBoxType) => {
  return notesRepository.createBox(notesId, userId, data);
};

export const updateBox = async (
  noteId: string,
  boxId: string,
  userId: string,
  data: UpdateBoxType
) => {
  // Garante que o box pertence à nota correta antes de atualizar
  const box = await notesRepository.findBoxById(boxId, userId);
  if (!box || box.notesId !== noteId) return null;

  return notesRepository.updateBox(boxId, userId, data);
};

export const deleteBox = async (noteId: string, boxId: string, userId: string) => {
  const box = await notesRepository.findBoxById(boxId, userId);
  if (!box || box.notesId !== noteId) return null;

  return notesRepository.deleteBox(boxId, userId);
};

export const reorderBoxes = async (
  noteId: string,
  userId: string,
  data: ReorderBoxesType
) => {
  // Valida que todos os boxes pertencem à nota
  const boxes = await notesRepository.findBoxesByNote(noteId, userId);
  const boxIds = new Set(boxes.map((b) => b.id));

  const allBelong = data.boxes.every((b) => boxIds.has(b.id));
  if (!allBelong) return null;

  return notesRepository.reorderBoxes(data.boxes, userId);
};