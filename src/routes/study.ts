import { Router } from "express";
import { verifyJWT } from "../middlewares/jwt.js";
import * as studyController from "../controllers/study.js"
import { verifyRole } from "../middlewares/verifyRole.js";

export const studiesRoutes = Router();

studiesRoutes.get('/all', verifyJWT, verifyRole, studyController.getAllStudies);
studiesRoutes.get('/', verifyJWT, studyController.getStudies);
studiesRoutes.post('/', verifyJWT, studyController.createStudy);
studiesRoutes.put('/:studyId', verifyJWT, studyController.updateStudy);
studiesRoutes.delete('/:studyId', verifyJWT, studyController.deleteStudy);