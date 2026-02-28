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
import passport from "passport";

export const quizRoutes = Router();

quizRoutes.get('/all',
  passport.authenticate('jwt', { session: false }),
  quizController.getAllQuizzes
);

quizRoutes.get('/locked',
  passport.authenticate('jwt', { session: false }),
  quizController.getLockedQuizzes
);

quizRoutes.get('/attempts',
  passport.authenticate('jwt', { session: false }),
  quizController.getUserAttempts
);

quizRoutes.get('/',
  passport.authenticate('jwt', { session: false }),
  quizController.getQuizzes
);

quizRoutes.post('/many',
  passport.authenticate('jwt', { session: false }),
  verifyRole, validateSchema(createQuizzesSchema), quizController.createManyQuiz
);

quizRoutes.post('/',
  passport.authenticate('jwt', { session: false }),
  verifyRole, validateSchema(createQuizSchema), quizController.createQuiz
);


// attempts
quizRoutes.get('/:quizId/attempts/last',
  passport.authenticate('jwt', { session: false }),
  validateQuiz, quizController.getLastQuizAttempt
);

quizRoutes.post('/:quizId/attempts/start',
  passport.authenticate('jwt', { session: false }),
  validateQuiz, quizController.startQuizAttempt
);

quizRoutes.put('/:quizId/attempts/finish',
  passport.authenticate('jwt', { session: false }),
  validateQuiz, quizController.finishQuizAttempt
);

quizRoutes.delete('/:quizId/attempts/delete',
  passport.authenticate('jwt', { session: false }),
  validateQuiz, quizController.deleteQuizAttempt
);


quizRoutes.put('/:quizId/unlock',
  passport.authenticate('jwt', { session: false }),
  validateQuiz, quizController.unlockQuiz
);

quizRoutes.post('/:quizId/image',

  passport.authenticate('jwt', { session: false }),
  validateQuiz, verifyRole, upload.single("image"), quizController.updateQuizImage
);


// questions
quizRoutes.post('/:quizId/questions',
  passport.authenticate('jwt', { session: false }),
  validateQuiz, verifyRole,
  validateSchema(createQuestionSchema), questionsController.createQuestion
);

quizRoutes.post('/:quizId/questions/many',

  passport.authenticate('jwt', { session: false }),
  validateQuiz, verifyRole, questionsController.createManyQuestion
);

quizRoutes.put('/:quizId/questions/:questionId',

  passport.authenticate('jwt', { session: false }),
  verifyRole, questionsController.updateQuestion
);

quizRoutes.delete('/:quizId/questions/:questionId',

  passport.authenticate('jwt', { session: false }),
  verifyRole, questionsController.deleteQuestion
);


// alternatives
quizRoutes.post('/:quizId/questions/alternatives',

  passport.authenticate('jwt', { session: false }),
  verifyRole, validateSchema(createManyAlternativesSchema), alternativeController.createManyAlternatives
);

quizRoutes.put('/:quizId/questions/:questionId/alternatives/:alternativeId',

  passport.authenticate('jwt', { session: false }),
  verifyRole, validateSchema(updateAlternativeSchema), alternativeController.updateAlternative
);

quizRoutes.delete('/:quizId/questions/:questionId/alternatives/:alternativeId',

  passport.authenticate('jwt', { session: false }),
  verifyRole, alternativeController.deleteAlternative
);


quizRoutes.get('/:quizId',
  passport.authenticate('jwt', { session: false }),
  validateQuiz, quizController.getQuiz
);

quizRoutes.put('/:quizId',
  passport.authenticate('jwt', { session: false }),
  verifyRole, validateQuiz,
  validateSchema(updateQuizSchema), quizController.updateQuiz
);

quizRoutes.delete('/:quizId',
  passport.authenticate('jwt', { session: false }),
  validateQuiz, verifyRole, quizController.deleteQuiz
);