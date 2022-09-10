import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import campsiteRouter from "./routes/campsiteRouter.js";
import promotionRouter from "./routes/promotionRouter.js";
import partnerRouter from "./routes/partnerRouter.js";

import mongoose from "mongoose";

import session from "express-session";
import sessionFileStore from "session-file-store";

var FileStore = sessionFileStore(session);

var app = express();
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
console.log("directory-name 👉️", __dirname);

const url = "mongodb://localhost:27017/nucampsite";
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  () => console.log("Connected correctly to server"),
  (err) => console.log(err)
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//app.use(cookieParser("12345-67890-09876-54321"));

app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

app.use(auth);

app.use("/", indexRouter);
app.use("/users", usersRouter);

function auth(req, res, next) {
  console.log(req.session);

  if (!req.session.user) {
    const err = new Error("You are not authenticated!");
    err.status = 401;
    return next(err);
  } else {
    if (req.session.user === "authenticated") {
      return next();
    } else {
      const err = new Error("You are not authenticated!");
      err.status = 401;
      return next(err);
    }
  }
}


app.use("/campsites", campsiteRouter);
app.use("/promotions", promotionRouter);
app.use("/partners", partnerRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
