import passport from "passport";
import { createUser, findUserByEmail, findUserByGoogleId, findUserById, linkUserGoogleAccount } from "../services/user";

const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/google/callback",
  passReqToCallback: true
},
  async function (request: any, accessToken: any, refreshToken: any, profile: any, done: any) {
    try {
      const googleUser = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        profileImage: profile.photos[0].value
      };

      if (!googleUser.email) {
        return done(null, false, { message: "Erro ao fazer login com Google." });
      }

      let user = await findUserByGoogleId(googleUser.googleId);

      if (user) {
        return done(null, user);
      }

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
    } catch (error) {
      return done(error, false);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});