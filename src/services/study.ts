import { StudyInsert } from "../schemas/study.js"
import { studyRepository } from "../repositories/study.js";

export const findAllStudies = async (userId: string, perPage: number, currentPage: number) => {
  const rows = await studyRepository.findAll(userId, perPage, currentPage);

  const map = new Map<string, any>();

  for (const row of rows) {
    const study = row.studies;
    const task = row.tasks;

    if (!map.has(study.id)) {
      map.set(study.id, {
        study,
        tasks: []
      });
    }

    if (task) {
      map.get(study.id).tasks.push(task);
    }
  }

  return Array.from(map.values());
};

export const findUserStudies = async (userId: string) => {
  const rows = await studyRepository.findStudies(userId);

  const studiesMap = new Map<string, any>();

  for (const row of rows) {
    const study = row.studies;
    const task = row.tasks;

    if (!studiesMap.has(study.id)) {
      studiesMap.set(study.id, {
        study,
        tasks: [],
      });
    }

    if (task) {
      studiesMap.get(study.id).tasks.push(task);
    }
  }

  return Array.from(studiesMap.values());
}

export const findUserStudyById = async (id: string) => {
  const rows = await studyRepository.findById(id);

  if (!rows.length) return null;

  const study = rows[0]?.studies;
  const tasks = rows
    .map(r => r.tasks)
    .filter(t => t !== null);

  return {
    study, tasks
  };
}

export const findUserStudyByName = async (name: string, userId: string) => {
  return await studyRepository.findByName(name, userId);
};

export const createUserStudy = async (data: StudyInsert) => {
  return await studyRepository.create(data);
}

export const updateStudyById = async (studyId: string, userId: string, data: Partial<StudyInsert>) => {
  return await studyRepository.update(studyId, userId, data);
};

export const updateStudyStatusProgress = async (id: string, progress: number) => {
  const dataUpdated: Record<string, any> = {};

  dataUpdated.progress = progress;

  if (progress === 100) {
    dataUpdated.status = "finalizado";
    dataUpdated.finishedAt = new Date();
  } else {
    dataUpdated.status = "em_andamento";
    dataUpdated.finishedAt = null;
  }

  try {
    const result = await studyRepository.updateStudyProgress(dataUpdated, id);

    return result;
  } catch (error) {
    throw error;
  }
}

export const deleteStudyById = async (studyId: string, userId: string) => {
  return await studyRepository.delete(studyId, userId);
};