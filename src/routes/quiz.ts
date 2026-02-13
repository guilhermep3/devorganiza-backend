import { Router } from "express";
import { verifyJWT } from "../middlewares/jwt.js";
import * as quizController from "../controllers/quiz.js";
import { upload } from "../middlewares/imageUpload.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { validateQuiz } from "../middlewares/validateQuiz.js";
import * as questionsController from "../controllers/question.js";
import * as alternativeController from "../controllers/alternative.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { createQuizSchema, createQuizzesSchema, updateQuizSchema } from "../schemas/quiz.js";

export const quizRoutes = Router();

quizRoutes.get('/all', verifyJWT, quizController.getAllQuizzes);
quizRoutes.get('/locked', verifyJWT, quizController.getLockedQuizzes);
quizRoutes.get('/attempts', verifyJWT, quizController.getUserAttempts);
quizRoutes.get('/', verifyJWT, quizController.getQuizzes);
quizRoutes.post('/many', verifyJWT, verifyRole, validateSchema(createQuizzesSchema), quizController.createManyQuiz);
quizRoutes.post('/', verifyJWT, verifyRole, validateSchema(createQuizSchema), quizController.createQuiz);

// attempts
quizRoutes.get('/:quizId/attempts/last', verifyJWT, validateQuiz, quizController.getLastQuizAttempt);
quizRoutes.post('/:quizId/attempts/start', verifyJWT, validateQuiz, quizController.startQuizAttempt);
quizRoutes.put('/:quizId/attempts/finish', verifyJWT, validateQuiz, quizController.finishQuizAttempt);
quizRoutes.delete('/:quizId/attempts/delete', verifyJWT, validateQuiz, quizController.deleteQuizAttempt);

quizRoutes.put('/:quizId/unlock', verifyJWT, validateQuiz, quizController.unlockQuiz);
quizRoutes.post('/:quizId/image',
  verifyJWT, validateQuiz, verifyRole, upload.single("image"), quizController.updateQuizImage);

// questions
quizRoutes.post('/:quizId/questions',
  verifyJWT, validateQuiz, verifyRole, questionsController.createQuestion);
quizRoutes.post('/:quizId/questions/many',
  verifyJWT, validateQuiz, verifyRole, questionsController.createManyQuestion);
quizRoutes.put('/:quizId/questions/:questionId',
  verifyJWT, verifyRole, questionsController.updateQuestion);
quizRoutes.delete('/:quizId/questions/:questionId',
  verifyJWT, verifyRole, questionsController.deleteQuestion);

// alternatives
quizRoutes.post('/:quizId/questions/alternatives',
  verifyJWT, verifyRole, alternativeController.createManyAlternatives);
quizRoutes.put('/:quizId/questions/:questionId/alternatives/:alternativeId',
  verifyJWT, verifyRole, alternativeController.updateAlternative);
quizRoutes.delete('/:quizId/questions/:questionId/alternatives/:alternativeId',
  verifyJWT, verifyRole, alternativeController.deleteAlternative);

quizRoutes.get('/:quizId', verifyJWT, validateQuiz, quizController.getQuiz);
quizRoutes.put('/:quizId', verifyJWT, verifyRole, validateQuiz,
  validateSchema(updateQuizSchema), quizController.updateQuiz);
quizRoutes.delete('/:quizId', verifyJWT, validateQuiz, verifyRole, quizController.deleteQuiz);
