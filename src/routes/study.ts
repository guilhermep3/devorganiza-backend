import { Router } from "express";
import * as studyController from "../controllers/study.js"
import { verifyRole } from "../middlewares/verifyRole.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { createStudySchema } from "../schemas/study.js";
import passport from "passport";

export const studiesRoutes = Router();

studiesRoutes.get('/all',
  passport.authenticate('jwt', { session: false }),
  verifyRole, studyController.getAllStudies
);

studiesRoutes.get('/:studyId',
  passport.authenticate('jwt', { session: false }),
  studyController.getUserStudy
);

studiesRoutes.get('/',
  passport.authenticate('jwt', { session: false }),
  studyController.getStudies
);

studiesRoutes.post('/',
  passport.authenticate('jwt', { session: false }),
  validateSchema(createStudySchema), studyController.createStudy
);

studiesRoutes.put('/:studyId',
  passport.authenticate('jwt', { session: false }),
  studyController.updateStudy
);

studiesRoutes.delete('/:studyId',
  passport.authenticate('jwt', { session: false }),
  studyController.deleteStudy
);