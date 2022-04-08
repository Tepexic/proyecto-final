const express = require("express");
const { Router } = express;
const persistenceFactory = require("./../daos");
const AdminDao = persistenceFactory.getAdminDao();
const { withAsync } = require("./../utils/helpers");
const { apiAuth } = require("./../middleware/auth");
const logger = require("./../utils/logger");

const adminRouter = Router();

const adminId = "61f864cdb782df533ef1922f";
const errorMsg = { error: "id no encontrado" };

adminRouter.get("/", apiAuth, async (req, res) => {
  const { error, data } = await withAsync(AdminDao.getById, AdminDao, adminId);
  if (error) {
    logger.info({ ruta: req.path, metodo: req.method, error: error });
    logger.error({ ruta: req.path, metodo: req.method, error: error });
    res.status(500).json(error);
  } else {
    console.log(data);
    if (data) return res.json(data);
    // error si no se encontró
    logger.info({ ruta: req.path, metodo: req.method, error: errorMsg });
    logger.error({ ruta: req.path, metodo: req.method, error: errorMsg });
    res.status(404);
    return res.json(errorMsg);
  }
});

adminRouter.put("/", apiAuth, async (req, res) => {
  const { error, data } = await withAsync(
    AdminDao.updateById,
    AdminDao,
    adminId,
    req.body
  );
  if (error) {
    logger.info({ ruta: req.path, metodo: req.method, error: error });
    logger.error({ ruta: req.path, metodo: req.method, error: error });
    return res.status(500).json(error);
  } else {
    if (data) {
      res.status(201);
      res.send({
        message: "success",
        data: { ...req.body },
      });
      return;
    } else {
      logger.info({ ruta: req.path, metodo: req.method, error: errorMsg });
      logger.error({ ruta: req.path, metodo: req.method, error: errorMsg });
      res.status(404);
      res.send(errorMsg);
      return;
    }
  }
});

module.exports = adminRouter;
