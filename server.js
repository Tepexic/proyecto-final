require("dotenv").config();

const cluster = require("cluster");
const app = require("./index");
const PORT = process.env.PORT || 8080; // PORT is provided by Heroku
const isCluster = process.env.SERVER_MODE === "cluster";

const logger = require("./utils/logger");

if (isCluster && cluster.isMaster) {
  const numCPUs = require("os").cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    logger.info({
      ruta: null,
      metodo: null,
      mensaje: `El worker ${worker.process.pid} ha finalizado`,
    });
  });
} else {
  app.listen(PORT, () =>
    logger.info({
      ruta: null,
      metodo: null,
      mensaje: `server starting on port ${PORT}`,
    })
  );
}
