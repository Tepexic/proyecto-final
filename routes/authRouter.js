const express = require("express");
const { Router } = express;

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const { UsersDao } = require("./../daos");
const { withAsync } = require("./../utils/helpers");

/**
 * Passport configuration
 */
passport.use(
  "login",
  new LocalStrategy(async (username, password, done) => {
    const { error, data } = await withAsync(
      UsersDao.getByProperty,
      UsersDao,
      "username",
      username
    );
    if (error) {
      console.error(error);
      return done(error);
    } else {
      console.log(data);
      const user = data;
      if (!user) {
        console.log("User not found");
        return done(null, false, { message: "Incorrect username." });
      }
      if (!isValidPassword(user, password)) {
        console.log("invalid password");
        return done(null, false, { message: "Incorrect password." });
      }
      console.log(user);
      return done(null, user);
    }
  })
);

passport.use(
  "signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const { error, data } = await withAsync(
        UsersDao.getByProperty,
        UsersDao,
        "username",
        username
      );
      if (error) {
        console.error("Signup error: ", err);
        return done(err);
      } else {
        const user = data;
        if (user) {
          console.log("User already exists");
          return done(null, null, { message: "User already exists" });
        }
        const newUser = {
          username: username,
          password: createHash(password),
          email: req.body.email,
          name: req.body.name,
          address: req.body.address,
          age: req.body.age,
          phone: req.body.phone,
          avatar: req.body.avatar,
          isAdmin: req.body.isAdmin || false,
        };
        const { error: userError, data: userData } = await withAsync(
          UsersDao.save,
          UsersDao,
          newUser,
          false // return whole document, not just id
        );
        console.log(userError, userData);
        if (userError) {
          console.error("Signup error: ", userError);
          return done(userError);
        } else {
          return done(null, userData);
        }
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const { error, data } = await withAsync(UsersDao.getById, UsersDao, id);
  if (error) {
    console.error(error);
    done(error, null);
  } else {
    done(null, data);
  }
  //User.collection.findById(id, done);
});

const authRouter = new Router();

authRouter.post("/login", function (req, res, next) {
  passport.authenticate("login", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ error: info.message, user: user });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ error: null, user: user });
    });
  })(req, res, next);
});

authRouter.post("/signup", function (req, res, next) {
  passport.authenticate("signup", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ error: info.message, user: user });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ error: null, user: user });
    });
  })(req, res, next);
});

// Utils
function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

module.exports = authRouter;
