import { Router } from "express";
import * as quizController from "../controllers/quiz.js";
import { upload } from "../middlewares/imageUpload.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { validateQuiz } from "../middlewares/validateQuiz.js";
import * as questionsController from "../controllers/question.js";
import * as alternativeController from "../controllers/alternative.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { createQuizSchema, createQuizzesSchema, updateQuizSchema } from "../schemas/quiz.js";
import { createQuestionSchema } from "../schemas/question.js";
import { createManyAlternativesSchema, updateAlternativeSchema } from "../schemas/alternative.js";
import { verifyJWT } from "../middlewares/verifyJwt.js";

export const quizzesRoutes = Router();

quizzesRoutes.get('/all', verifyJWT, quizController.getAllQuizzes);
quizzesRoutes.get('/locked', verifyJWT, quizController.getLockedQuizzes);
quizzesRoutes.get('/attempts', verifyJWT, quizController.getUserAttempts);
quizzesRoutes.get('/', verifyJWT, quizController.getQuizzes);
quizzesRoutes.post('/bulk',
  verifyJWT, verifyRole, validateSchema(createQuizzesSchema),
  quizController.createManyQuiz
);
quizzesRoutes.post('/',
  verifyJWT, verifyRole, validateSchema(createQuizSchema),
  quizController.createQuiz
);

// attempts
quizzesRoutes.get('/:quizId/attempts/last', verifyJWT, validateQuiz, quizController.getLastQuizAttempt);
quizzesRoutes.post('/:quizId/attempts/start', verifyJWT, validateQuiz, quizController.startQuizAttempt);
quizzesRoutes.put('/:quizId/attempts/finish', verifyJWT, validateQuiz, quizController.finishQuizAttempt);
quizzesRoutes.delete('/:quizId/attempts', verifyJWT, validateQuiz, quizController.deleteQuizAttempt);

quizzesRoutes.put('/:quizId/unlock', verifyJWT, validateQuiz, quizController.unlockQuiz);
quizzesRoutes.post('/:quizId/image',
 verifyJWT, validateQuiz, verifyRole, upload.single("image"), quizController.updateQuizImage
);

// questions
quizzesRoutes.post('/:quizId/questions', verifyJWT, validateQuiz, verifyRole,
  validateSchema(createQuestionSchema), questionsController.createQuestion
);
quizzesRoutes.post('/:quizId/questions/bulk',
 verifyJWT, validateQuiz, verifyRole, questionsController.createManyQuestion
);
quizzesRoutes.put('/:quizId/questions/:questionId',
 verifyJWT, verifyRole, questionsController.updateQuestion
);
quizzesRoutes.delete('/:quizId/questions/:questionId',
 verifyJWT, verifyRole, questionsController.deleteQuestion
);

// alternatives
quizzesRoutes.post('/:quizId/questions/alternatives/bulk',
 verifyJWT, verifyRole, validateSchema(createManyAlternativesSchema),
 alternativeController.createManyAlternatives
);
quizzesRoutes.put('/:quizId/questions/:questionId/alternatives/:alternativeId',
 verifyJWT, verifyRole, validateSchema(updateAlternativeSchema), alternativeController.updateAlternative
);
quizzesRoutes.delete('/:quizId/questions/:questionId/alternatives/:alternativeId',
 verifyJWT, verifyRole, alternativeController.deleteAlternative
);

quizzesRoutes.get('/:quizId', verifyJWT, validateQuiz, quizController.getQuiz);
quizzesRoutes.put('/:quizId', verifyJWT, verifyRole, validateQuiz,
  validateSchema(updateQuizSchema), quizController.updateQuiz);
quizzesRoutes.delete('/:quizId', verifyJWT, validateQuiz, verifyRole, quizController.deleteQuiz
);