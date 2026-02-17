import { Strategy as LocalStrategy } from "passport-local";
import { findUserByEmail } from "../services/user.js";
import { compare } from "bcrypt-ts";

export const localStrategy = new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
}, async (email, password, done) => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return done(null, false);
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err)
  }
})