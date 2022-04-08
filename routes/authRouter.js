const express = require("express");
const { Router } = express;
const transporter = require("../utils/mailer");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const logger = require("./../utils/logger");
const { apiAuth } = require("./../middleware/auth");

const persistenceFactory = require("./../daos");
const AdminDao = persistenceFactory.getAdminDao();
const UsersDao = persistenceFactory.getUsersDao();
// const { UsersDao } = require("./../daos");
// const { AdminDao } = require("./../daos");
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
      logger.info({ ruta: "/auth/login", metodo: "POST", error: error });
      logger.error({ ruta: "/auth/login", metodo: "POST", error: error });
      return done(error);
    } else {
      const user = data;
      if (!user) {
        const errorMessage = "User not found";
        logger.info({
          ruta: "/auth/login",
          metodo: "POST",
          error: errorMessage,
        });
        logger.warn({
          ruta: "/auth/login",
          metodo: "POST",
          error: errorMessage,
        });
        return done(null, false, { message: errorMessage });
      }
      if (!isValidPassword(user, password)) {
        const errorMessage = "Invalid password";
        logger.info({
          ruta: "/auth/login",
          metodo: "POST",
          error: errorMessage,
        });
        logger.warn({
          ruta: "/auth/login",
          metodo: "POST",
          error: errorMessage,
        });
        return done(null, false, { message: errorMessage });
      }
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
        logger.info({ ruta: req.path, metodo: req.method, error: err });
        logger.error({ ruta: req.path, metodo: req.method, error: err });
        return done(err);
      } else {
        const user = data;
        if (user) {
          const errorMessage = "User already exists";
          logger.info({
            ruta: req.path,
            metodo: req.method,
            error: errorMessage,
          });
          logger.warn({
            ruta: req.path,
            metodo: req.method,
            error: errorMessage,
          });
          return done(null, null, { message: errorMessage });
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
        if (userError) {
          logger.info({ ruta: req.path, metodo: req.method, error: userError });
          logger.error({
            ruta: req.path,
            metodo: req.method,
            error: userError,
          });
          return done(userError);
        } else {
          const { data } = await withAsync(
            AdminDao.getById,
            AdminDao,
            process.env.ADMIN_ID
          );
          const mailContent = {
            from: "Ecommerce Proyecto Final",
            to: data.email,
            subject: "Nuevo registro",
            html: `<h1>Nuevo usuario registrado</h1>
            <ul>
            <li>Nombre: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Dirección: ${req.body.address}</li>
            <li>Edad: ${req.body.age}</li>
            <li>Teléfono: ${req.body.phone}</li>
            <li>Avatar: ${req.body.avatar}</li>
            <li>Admin: ${req.body.isAdmin}</li>
            <ul>
            <p>Registrado: ${new Date().toLocaleString()}</p>
            `,
          };
          try {
            const info = await transporter.sendMail(mailContent);
            logger.info({ ruta: req.path, metodo: req.method, info });
          } catch (err) {
            logger.info({ ruta: req.path, metodo: req.method, error: err });
            logger.error({ ruta: req.path, metodo: req.method, error: err });
            return done(err);
          }
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
    logger.info({ ruta: req.path, metodo: req.method, error });
    logger.error({ ruta: req.path, metodo: req.method, error });
    done(error, null);
  } else {
    done(null, data);
  }
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

authRouter.post("/logout", apiAuth, function (req, res) {
  req.logout();
  res.status(200).json({ error: null, data: "Succesfully logged out" });
});

authRouter.get("/account", apiAuth, function (req, res) {
  res.status(200).json({
    error: null,
    data: req.user,
  });
});

// Utils
function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

module.exports = authRouter;
