import passport from "passport";
import passportLocal from "passport-local";
import User from "./models/user.js";

import passportJwt from "passport-jwt";
import jsonwebtoken from "jsonwebtoken";
import config from "./config.js";
import Campsite from './models/campsite.js';

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const jwt = jsonwebtoken;

export const local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export const getToken = (user) => {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

export const jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT payload:", jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        console.log(
          `Verified User! Username: ${user.username} Admin Status: ${user.admin}`
        );
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);


export const verifyAdmin = 
  (req, res, next) => {
      if (req.user.admin === true) {
        console.log(
          `Username: ${req.user.username} Admin Status: ${req.user.admin}`
        );
        return next();
      } else {
        const err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        console.log(
          `Username: ${req.user.username} Admin Status: ${req.user.admin}`
        );
        return next(err);
      } 
    };

export const verifyAuthor = (req, res, next) => {
  var userId = req.user._id;
  Campsite.findById(req.params.campsiteId)
    .then((campsite) => {
      var authorId = campsite.comments.id(req.params.commentId).author._id;
      if (campsite && campsite.comments.id(req.params.commentId)) {
        console.log(`User id: ${userId}; Author Id: ${authorId}`);
        if (userId.equals(authorId)) {
          console.log("Author verified!");
          return next();
        } else {
          const err = new Error(
            "You are not authorized to perform this operation!"
          );
          err.status = 403;
          console.log(`Username: ${req.user.username} didn't write this!`);
          return next(err);
        }
      }
    })
}


  export const verifyUser = passport.authenticate("jwt", { session: false });
