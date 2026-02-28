import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { findUserById } from "../services/user.js";

export const jwtStrategy = new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
}, async (payload, done) => {
  try {
    const user = await findUserById(payload.id);

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
})