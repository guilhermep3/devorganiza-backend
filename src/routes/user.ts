import { Router } from "express";
import * as userController from "../controllers/user.js";
import { upload } from "../middlewares/imageUpload.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { verifyJWT } from "../middlewares/verifyJwt.js";

export const userRoutes = Router();

userRoutes.get('/all', verifyJWT, verifyRole, userController.getAllUsers);
userRoutes.get('/', verifyJWT, userController.getUser);
userRoutes.put('/image', verifyJWT, upload.single("image"), userController.updateUserImage);
userRoutes.put('/', verifyJWT, userController.updateUser);
userRoutes.delete('/', verifyJWT, userController.deleteUser);
