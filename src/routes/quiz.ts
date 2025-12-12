import { Router } from "express";
import { verifyJWT } from "../middlewares/jwt.js";
import * as quizController from "../controllers/quiz.js"
import { upload } from "../middlewares/imageUpload.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { validateQuiz } from "../middlewares/validateQuiz.js";
import * as questionsController from "../controllers/question.js"
import * as alternativeController from "../controllers/alternative.js"

export const quizRoutes = Router();

quizRoutes.get('/all', verifyJWT, quizController.getAllQuizzes);
quizRoutes.get('/locked', verifyJWT, quizController.getLockedQuizzes);
quizRoutes.get('/:quizId', verifyJWT, validateQuiz, quizController.getQuiz);
quizRoutes.get('/', verifyJWT, quizController.getQuizzes);
quizRoutes.post('/', verifyJWT, verifyRole, quizController.createQuiz);
quizRoutes.post('/many', verifyJWT, verifyRole, quizController.createManyQuiz);
quizRoutes.put('/:quizId', verifyJWT, verifyRole, validateQuiz, quizController.updateQuiz);
quizRoutes.delete('/:quizId', verifyJWT, validateQuiz, verifyRole, quizController.deleteQuiz);
quizRoutes.put('/:quizId/unlock', verifyJWT, validateQuiz, quizController.unlockQuiz);
quizRoutes.post('/:quizId/image',
  verifyJWT, validateQuiz, verifyRole, upload.single("image"), quizController.updateQuizImage
);
quizRoutes.post('/:quizId/start', verifyJWT, validateQuiz, quizController.startQuizAttempt);
quizRoutes.put('/:quizId/finish', verifyJWT, validateQuiz, quizController.finishQuizAttempt);

quizRoutes.get('/:quizId/questions',
  verifyJWT, validateQuiz, questionsController.getQuestions
);
quizRoutes.post('/:quizId/questions',
  verifyJWT, validateQuiz, verifyRole, questionsController.createQuestion
);
quizRoutes.post('/:quizId/questions/many',
  verifyJWT, validateQuiz, verifyRole, questionsController.createManyQuestion
);
quizRoutes.put('/:quizId/questions/:questionId',
  verifyJWT, verifyRole, questionsController.updateQuestion
);
quizRoutes.delete('/:quizId/questions/:questionId',
  verifyJWT, verifyRole, questionsController.deleteQuestion
);

quizRoutes.get('/:quizId/questions/:questionId/alternatives',
  verifyJWT, alternativeController.getAlternatives
);
quizRoutes.post('/:quizId/questions/:questionId/alternatives',
  verifyJWT, verifyRole, alternativeController.createAlternatives
);
quizRoutes.post('/:quizId/questions/alternatives/many',
  verifyJWT, verifyRole, alternativeController.createManyAlternatives
);
quizRoutes.put('/:quizId/questions/:questionId/alternatives/:alternativeId',
  verifyJWT, verifyRole, alternativeController.updateAlternative
);
quizRoutes.delete('/:quizId/questions/:questionId/alternatives/:alternativeId',
  verifyJWT, verifyRole, alternativeController.deleteAlternative
);