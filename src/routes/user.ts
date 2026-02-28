import { Router } from "express";
import * as userController from "../controllers/user.js";
import { upload } from "../middlewares/imageUpload.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import passport from "passport";

export const userRoutes = Router();

userRoutes.get('/all',
  passport.authenticate('jwt', { session: false }),
  verifyRole, userController.getAllUsers
);

userRoutes.get('/',
  passport.authenticate('jwt', { session: false }),
  userController.getUser
);

userRoutes.put('/image',
  passport.authenticate('jwt', { session: false }),
  upload.single("image"), userController.updateUserImage
);

userRoutes.put('/',
  passport.authenticate('jwt', { session: false }),
  userController.updateUser
);

userRoutes.delete('/',
  passport.authenticate('jwt', { session: false }),
  userController.deleteUser
);
