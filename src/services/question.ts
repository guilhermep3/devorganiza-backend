import { AlternativeInsert, updateAlternativeType } from "../schemas/alternative.js";
import { questionRepositories } from "../repositories/question.js";

export const createNewQuestion = async (question: string, quizId: string) => {
  return await questionRepositories.create(question, quizId)
};

export const createNewQuestions = async (data: { question: string; quizId: string }[]) => {
  return await questionRepositories.createMany(data)
};

export const updateQuestionById = async (question: string, id: string) => {
  return await questionRepositories.update(question, id)
};

export const deleteQuestionById = async (id: string) => {
  return await questionRepositories.delete(id)
};

export const createNewAlternatives = async (data: AlternativeInsert[]) => {
  return await questionRepositories.createAlternatives(data)
};

export const updateAlternativeById = async (data: updateAlternativeType, id: string) => {
  return await questionRepositories.updateAlternative(data, id)
};

export const deleteAlternativeById = async (id: string) => {
  return await questionRepositories.delete(id)
};