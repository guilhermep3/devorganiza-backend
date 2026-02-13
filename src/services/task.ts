import { taskRepository } from "../repositories/task.js";
import { TaskInsert } from "../schemas/task.js";

export const createUserTask = async (data: TaskInsert) => {
  return taskRepository.create(data);
};

export const findTaskById = async (taskId: string) => {
  return taskRepository.findById(taskId);
};

export const updateUserTask = async (
  taskId: string,
  data: Partial<TaskInsert>
) => {
  return taskRepository.update(taskId, data);
};

export const deleteUserTask = async (taskId: string) => {
  return taskRepository.delete(taskId);
};

export const findTasksCount = async (studyId: string) => {
  return taskRepository.countByStudyId(studyId);
};

export const findFinishedTasksCount = async (studyId: string) => {
  return taskRepository.countFinishedByStudyId(studyId);
};
