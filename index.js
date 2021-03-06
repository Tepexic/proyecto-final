const express = require("express");
const cors = require("cors");
const productos = require("./routes/productos");
const carrito = require("./routes/carrito");
const imageUploader = require("./routes/imageUploader");
const authRouter = require("./routes/authRouter");
const adminRouter = require("./routes/adminManager");
const logger = require("./utils/logger");

const server = express();

// Socket.io
const { Server } = require("socket.io");
const { createServer } = require("http");
const httpServer = createServer(server);
const io = new Server(httpServer, {
  /* options */
});
const persistenceFactory = require("./daos");
const { withAsync } = require("./utils/helpers");

// Session and authentication
const MongoStore = require("connect-mongo");
const passport = require("passport");
const session = require("express-session");

const env = process.env.NODE_ENV || "development";

// middleware
server.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:8081",
      "https://proyecto-final-coderhouse.netlify.app/",
      "https://proyecto-final-coderhouse.netlify.app",
    ],
    credentials: true,
  })
);
server.use(express.json());
server.use(express.urlencoded({ encoded: true }));
server.use(express.static("public"));
server.set("trust proxy", 1);
server.use(
  session({
    store: new MongoStore({
      mongoUrl: `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.foboz.mongodb.net/${process.env.SESSION_DB}?retryWrites=true&w=majority`,
      MongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: "qwertyuiop",
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 10,
      sameSite: env === "production" ? "none" : "lax", // must be 'none' to enable cross-site delivery
      secure: env === "production", // must be true if sameSite='none'
    },
  })
);
server.use(passport.initialize());
server.use(passport.session());

// Usar rutas
server.use("/api/productos/", productos);
server.use("/api/carrito/", carrito);
server.use("/api/upload/", imageUploader);
server.use("/api/auth/", authRouter);
server.use("/api/admin/", adminRouter);

// rutas no definidas
server.use((req, res) => {
  const message = `ruta ${req.path} metodo ${req.method} no implementada`;
  logger.info({ ruta: req.path, metodo: req.method, error: message });
  logger.warn({ ruta: req.path, metodo: req.method, error: message });
  res.status(404);
  res.json({
    error: -2,
    descripcion: message,
  });
});

server.on("error", (err) => {
  logger.error({ ruta: null, metodo: null, error: err });
  logger.info({ ruta: null, metodo: null, error: err });
});

const MessagesDao = persistenceFactory.getMessagesDao();
io.on("connection", async (socket) => {
  logger.info({
    ruta: "socket",
    metodo: null,
    error: "Un cliente se ha conectado",
  });
  socket.emit("messages", await MessagesDao.getAll());
  // A??adir nuevo mensaje y emitir nueva lista
  socket.on("new-message", async (data) => {
    logger.info({
      ruta: "socket new message",
      metodo: null,
      error: `Nuevo mensaje: ${data}`,
    });
    const { error } = await withAsync(MessagesDao.save, MessagesDao, data);
    if (error) {
      logger.error({ ruta: "socket error", metodo: null, error: err });
    } else {
      socket.emit("messages", await MessagesDao.getAll());
    }
  });
});

module.exports = { server, httpServer };
