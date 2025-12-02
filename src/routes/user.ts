import { Router } from "express";
import { verifyJWT } from "../middlewares/jwt.js";
import * as userController from "../controllers/user.js";
import { upload } from "../middlewares/imageUpload.js";
import { verifyRole } from "../middlewares/verifyRole.js";

export const userRoutes = Router();

userRoutes.get('/all', verifyJWT, verifyRole, userController.getAllUsers);
userRoutes.get('/', verifyJWT, userController.getUser);
userRoutes.put('/', verifyJWT, userController.updateUser);
userRoutes.put('/image', verifyJWT, upload.single("image"), userController.updateUserImage);
userRoutes.delete('/', verifyJWT, userController.deleteUser);