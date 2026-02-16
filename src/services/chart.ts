import { chartRepository } from "../repositories/chart.js";

export const findWeeklyProductivity = async (userId: string) => {
  return await chartRepository.weeklyProductivity(userId)
};

export const findTasksByType = async (userId: string) => {
  return await chartRepository.tasksByType(userId)
};

export const findFinishedTasksByMonth = async (userId: string) => {
  return await chartRepository.finishedTasksByMonth(userId)
};

export const findAverageTimeFinish = async (userId: string) => {
  return await chartRepository.averageTimeFinish(userId)
};

export const findAverageScore = async (userId: string) => {
  return await chartRepository.averageScore(userId)
};

export const findFasterAttempts = async (userId: string) => {
  return await chartRepository.fasterAttempts(userId)
}