const path = require("path");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const errorhandler = require("errorhandler");
const mongoose = require("mongoose");

const isProduction = process.env.NODE_ENV === "production";

// Create global app object
const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));

// Normal express config defaults
app.use(require("morgan")("dev"));
app.use(require("method-override")());

app.use(
  session({
    secret: "conduit",
    cookie: {
      maxAge: 60000,
    },
    resave: false,
    saveUninitialized: false,
  })
);

if (!isProduction) {
  app.use(errorhandler());
}

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect("mongodb://localhost/EliasDB", (err) => {
    if (err) {
      console.log("database connection failed");
    } else {
      console.log("database connected");
    }
  });
  mongoose.set("debug", true);
}

require("./models/User");
require("./models/ResetToken");
require("./models/Post");
require("./config/passport");

app.use(require("./routes"));

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// will print stacktrace
if (!isProduction) {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });    
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
  
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + server.address().port);
});

module.exports = app;
