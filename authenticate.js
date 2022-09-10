import passport from "passport";
import passportLocal from "passport-local";
import User from "./models/user.js";

const LocalStrategy = passportLocal.Strategy;

export const local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



