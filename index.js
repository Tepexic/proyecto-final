const express = require("express");
const cors = require("cors");
const productos = require("./routes/productos");
const carrito = require("./routes/carrito");
const admin = require("./routes/admin");
const imageUploader = require("./routes/imageUploader");
const authRouter = require("./routes/authRouter");

const server = express();

// Session and authentication
const MongoStore = require("connect-mongo");
const passport = require("passport");
const session = require("express-session");
// const auth = require("./middleware/auth");

// middleware
server.use(express.json());
server.use(express.urlencoded({ encoded: true }));
server.use(cors());
server.use(express.static("public"));
server.use(
  session({
    store: new MongoStore({
      mongoUrl: `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.foboz.mongodb.net/${process.env.SESSION_DB}?retryWrites=true&w=majority`,
      MongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: "qwertyuiop",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 10,
    },
  })
);
server.use(passport.initialize());
server.use(passport.session());

// Usar rutas
server.use("/api/productos/", productos);
server.use("/api/carrito/", carrito);
server.use("/api/admin/", admin);
server.use("/api/upload/", imageUploader);
server.use("/api/auth/", authRouter);

// rutas no definidas
server.use((req, res) => {
  res.status(404);
  res.json({
    error: -2,
    descripcion: `ruta ${req.path} metodo ${req.method} no implementada`,
  });
});

server.on("error", (err) => {
  console.error(err);
});

module.exports = server;
