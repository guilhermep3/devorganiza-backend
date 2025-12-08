import type { Response } from "express";
import type { ExtendedRequest } from "../types/request.js";
import {
  createUserTask, deleteUserTask, findFinishedTasksCount, findTasksCount,
  findUserTasks, updateUserTask
} from "../services/task.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.js";
import { updateStudyProgress } from "../services/study.js";

export const getTasks = async (req: ExtendedRequest, res: Response) => {
  try {
    const studyId = Number(req.params.studyId);
    if (!studyId) {
      res.status(400).json({ error: "Id do estudo inválido" });
      return;
    }

    const tasks = await findUserTasks(studyId);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as tarefas", errorDetails: error });
  }
}

export const createTask = async (req: ExtendedRequest, res: Response) => {
  try {
    const studyId = Number(req.params.studyId);
    if (!studyId) {
      res.status(400).json({ error: "Id do estudo inválido" });
      return;
    }

    const safeData = await createTaskSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(400).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const convertedData = {
      ...safeData.data,
      title: safeData.data.title,
      link: safeData.data.link ?? null,
      finishIn: safeData.data.finishIn ?? null,
      done: false,
    };

    const newTask = await createUserTask({
      ...convertedData,
      studyId
    });


    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar tarefa", errorDetails: error });
  }
}

export const updateTask = async (req: ExtendedRequest, res: Response) => {
  try {
    const taskId = Number(req.params.taskId);
    if (!taskId) {
      res.status(400).json({ error: "Id da tarefa inválida" });
      return;
    }

    const safeData = updateTaskSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(400).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const cleanedData: any = Object.fromEntries(
      Object.entries(safeData.data).filter(([_, v]) => v !== undefined)
    );
    if ("done" in cleanedData) {
      if (cleanedData.done === true) {
        cleanedData.finishedAt = new Date();
      } else {
        cleanedData.finishedAt = null;
      }
    }

    const updatedTask = await updateUserTask(taskId, cleanedData as Parameters<typeof updateUserTask>[1]);

    const updatedTaskRecord = Array.isArray(updatedTask) ? updatedTask[0] : updatedTask;

    if ("done" in cleanedData) {
      const studyId = (updatedTaskRecord as any).studyId;
      const tasksCount = await findTasksCount(studyId);
      const finishedTasksCount = await findFinishedTasksCount(studyId);
      const progress = tasksCount === 0 ? 0 : (finishedTasksCount / tasksCount) * 100;

      await updateStudyProgress(studyId, progress);
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao atualizar tarefa",
      errorDetails: error
    });
  }
};

export const deleteTask = async (req: ExtendedRequest, res: Response) => {
  try {
    const taskId = Number(req.params.taskId);
    if (!taskId) {
      res.status(400).json({ error: "Id da tarefa inválida" });
      return;
    }

    await deleteUserTask(taskId);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar tarefa", errorDetails: error });
  }
}