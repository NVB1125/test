var mongoose = require("mongoose");
var router = require("express").Router();
var passport = require("passport");
var User = mongoose.model("User");
var ResetToken = mongoose.model("ResetToken");
var auth = require("../auth");
var crypto = require("crypto");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

router.post("/users/login", function (req, res, next) {
  if (!req.body.user.email) {
    return res.status(422).json({
      errors: {
        email: "can't be blank",
      },
    });
  }

  if (!req.body.user.password) {
    return res.status(422).json({
      errors: {
        password: "can't be blank",
      },
    });
  }

  passport.authenticate(
    "local",
    {
      session: false,
    },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      console.log("error:", err)
      console.log("user:", user)
      console.log("info:", info)

      if (user) {
        if (user.emailVerified) {
          user.token = user.generateJWT();
          return res.json({
            user: user.toAuthJSON(),
          });
        } else {
          return res.status(422).json({
            errors: {
              password: "Email is not verifed",
            },
          });
        }
      } else {
        return res.status(422).json(info);
      }
    }
  )(req, res, next);
});

router.post("/users", function (req, res, next) {
  var user = new User();
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  user
    .save()
    .then(function () {
      var resettoken = new ResetToken();
      resettoken._userId = user._id;
      let token = crypto.randomBytes(16).toString("hex");
      resettoken.resettoken = token;
      resettoken.type = "email";
      resettoken.save(function (err, resettokenres) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        var mailOptions = {
          to: user.email,
          from: {
            email: "elias@holamicasa.com",
            name: 'Elias'
          },
          subject: "Elias Register Verify",
          text: "http://3.14.248.227/auth/verify-email/?token=" + resettoken.resettoken,
        };
        sgMail.send(mailOptions, function (error, info) {
          if (error) {
            return res.status(500).send({
              error: {
                message: "Something went wrong",
              },
            });
          }
          return res.status(200).send({
            user: user.toAuthJSON()
          });
        });
      });
    })
    .catch(next);
});

router.get("/create-admin", function (req, res, next) {
  var user = new User();
  user.username = "admin";
  user.role = "admin";
  user.email = "elias@holamicasa.com";
  user.setPassword("Elias");
  user.emailVerified = true;
  user.save().then(function (user, err) {
    if (err) {
      return res.status(500).json({ message: "Email is required" });
    }
    return res.json({
      message: "Admin user created",
    });
  });
});

router.post("/send-reset-password-link", function (req, res, next) {
  try {
    if (!req.body.email) {
      return res.status(500).json({ message: "Email is required" });
    }
    User.findOne({
      email: req.body.email,
    }).then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }
      var resettoken = new ResetToken();
      resettoken._userId = user._id;
      resettoken.type = "password";
      let token = crypto.randomBytes(16).toString("hex");
      resettoken.resettoken = token;
      resettoken.save(function (err, resettokenres) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        var mailOptions = {
          to: user.email,
          from: {
            email: "elias@holamicasa.com",
            name: 'Elias'
          },
          subject: "Elias Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://3.14.248.227/auth/reset-password/?token=" +
            resettoken.resettoken +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        sgMail.send(mailOptions, function (error, info) {
          if (error) {
            return res.status(500).send({
              error: {
                message: "Something went wrong",
              },
            });
          }
          return res.status(200).send({
            status: true,
            message: "Email Send Successfully.",
          });
        });
      });
    });
  } catch (err) {
    return res.status(500).send({
      error: {
        message: "Something went wrong",
      },
    });
  }
});

router.post("/verif-email", function (req, res, next) {
  if (!req.body.resettoken) {
    return res.status(500).json({ message: "Token is required" });
  }
  ResetToken.findOne({
    resettoken: req.body.resettoken,
    type: "email",
  }).then(function (token, err) {
    if (err || !token) {
      return res.status(409).json({ message: "Invalid URL" });
    }
    User.findOne(
      {
        _id: token._userId,
      },
      function (err, userEmail, next) {
        if (!userEmail) {
          return res.status(409).json({ message: "User does not exist" });
        }
        userEmail.emailVerified = true;
        return userEmail.save(function (err) {
          if (err) {
            return res.status(400).json({ message: "Somthing wrong" });
          }
          token.remove().then(function (r, er) {
            if (er) {
              return res.status(400).json({ message: "Somthing wrong" });
            }
            return res.json({
              user: userEmail.toAuthJSON()
            });
          });
        });
      }
    );
  });
});

router.post("/verif-token", function (req, res, next) {
  if (!req.body.resettoken) {
    return res.status(500).json({ message: "Token is required" });
  }
  ResetToken.findOne({
    resettoken: req.body.resettoken,
    type: "password",
  }).then(function (token, err) {
    if (err || !token) {
      return res.status(409).json({ message: "Invalid URL" });
    }
    return res.status(200).send({
      status: true,
      message: "Token verified successfully.",
    });
  });
});

router.post("/new-password", function (req, res, next) {
  ResetToken.findOne(
    { resettoken: req.body.resettoken, type: "password" },
    function (err, userToken, next) {
      if (!userToken) {
        return res.status(409).json({ message: "Token has expired" });
      }

      User.findOne(
        {
          _id: userToken._userId,
        },
        function (err, userEmail, next) {
          if (!userEmail) {
            return res.status(409).json({ message: "User does not exist" });
          }
          userEmail.setPassword(req.body.password);
          return userEmail.save(function (err) {
            if (err) {
              return res
                .status(400)
                .json({ message: "Password can not reset." });
            }
            userToken.remove().then(function (r, er) {
              if (er) {
                return res
                  .status(400)
                  .json({ message: "Password can not reset." });
              }
              return res
                .status(201)
                .json({ message: "Password reset successfully" });
            });
          });
        }
      );
    }
  );
});

router.get("/getUserInfo", auth.required, function (req, res, next) {
  console.log("getUserInfo: ", req.payload)
  User.findById(req.payload._id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return res.json({
        user
      });
    })
    .catch(next);
});

module.exports = router;
