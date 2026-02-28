import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import {
  createUser, findUserByEmail, findUserByGoogleId, linkUserGoogleAccount
} from "../services/user.js";

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      const googleUser = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
      };

      if (!googleUser.email) {
        return done(null, false);
      }

      let user = await findUserByGoogleId(googleUser.googleId);
      if (user) return done(null, user);

      user = await findUserByEmail(googleUser.email);

      if (user) {
        await linkUserGoogleAccount(user.id, googleUser.googleId);
        return done(null, user);
      }

      const newUser = await createUser({
        googleId: googleUser.googleId,
        name: googleUser.name,
        email: googleUser.email,
        username: `${googleUser.email.split("@")[0]}_${Date.now()}`
      });

      return done(null, newUser);

    } catch (err) {
      return done(err, false);
    }
  }
);