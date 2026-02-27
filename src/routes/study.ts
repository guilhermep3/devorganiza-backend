import { Router } from "express";
import { verifyJWT } from "../others/oldVerifyJWT.js";
import * as studyController from "../controllers/study.js"
import { verifyRole } from "../middlewares/verifyRole.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { createStudySchema } from "../schemas/study.js";

export const studiesRoutes = Router();

studiesRoutes.get('/all', verifyJWT, verifyRole, studyController.getAllStudies);
studiesRoutes.get('/:studyId', verifyJWT, studyController.getUserStudy);
studiesRoutes.get('/', verifyJWT, studyController.getStudies);
studiesRoutes.post('/', verifyJWT, validateSchema(createStudySchema), studyController.createStudy);
studiesRoutes.put('/:studyId', verifyJWT, studyController.updateStudy);
studiesRoutes.delete('/:studyId', verifyJWT, studyController.deleteStudy);