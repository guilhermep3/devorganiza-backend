import { Router } from "express";
import * as userController from "../controllers/user.js";
import { upload } from "../middlewares/imageUpload.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { verifyJWT } from "../middlewares/verifyJwt.js";

export const usersRoutes = Router();

usersRoutes.get('/all', verifyJWT, verifyRole, userController.getAllUsers);
usersRoutes.get('/', verifyJWT, userController.getUser);
usersRoutes.put('/image', verifyJWT, upload.single("image"), userController.updateUserImage);
usersRoutes.put('/', verifyJWT, userController.updateUser);
usersRoutes.delete('/', verifyJWT, userController.deleteUser);
