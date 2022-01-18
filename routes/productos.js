/**
 * El router base '/api/productos' implementará cuatro funcionalidades:
 * - GET: '/:id?' - Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores)
 * - POST: '/' - Para incorporar productos al listado (disponible para administradores)
 * - PUT: '/:id' - Actualiza un producto por su id (disponible para administradores)
 * - DELETE: '/:id' - Borra un producto por su id (disponible para administradores)
 */
const express = require("express");
const { Router } = express;

const { ProductsDao } = require("./../daos");
const { withAsync } = require("./../utils/helpers");
const isAdmin = require("./../middleware/isAdmin");
const { apiAuth } = require("./../middleware/auth");

const productosRouter = Router();

const errorMsg = { error: "producto no encontrado" };

productosRouter.get("/", apiAuth, async (req, res) => {
  const { error, data } = await withAsync(ProductsDao.getAll, ProductsDao);
  if (error) {
    return res.status(500).json(error);
  } else {
    return res.json(data);
  }
});

productosRouter.get("/:id", apiAuth, async (req, res) => {
  const id =
    process.env.TYPE === "file" ? parseInt(req.params.id) : req.params.id;
  const { error, data } = await withAsync(ProductsDao.getById, ProductsDao, id);
  if (error) {
    return res.status(500).json(error);
  } else {
    if (data) return res.json(data);
    // error si no se encontró
    res.status(404);
    return res.json(errorMsg);
  }
});

productosRouter.post("/", apiAuth, isAdmin, async (req, res) => {
  const productoNuevo = req.body;
  productoNuevo.timestamp = Date.now();
  const { error, data } = await withAsync(
    ProductsDao.save,
    ProductsDao,
    productoNuevo
  );
  if (error) {
    return res.status(500).json(error);
  } else {
    res.status(201);
    res.send({
      message: "success",
      data: { _id: data, ...productoNuevo },
    });
  }
});

productosRouter.put("/:id", apiAuth, isAdmin, async (req, res) => {
  const id =
    process.env.TYPE === "file" ? parseInt(req.params.id) : req.params.id;
  const { error, data } = await withAsync(
    ProductsDao.updateById,
    ProductsDao,
    id,
    req.body
  );
  if (error) {
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
      res.status(404);
      res.send(errorMsg);
      return;
    }
  }
});

productosRouter.delete("/:id", apiAuth, isAdmin, async (req, res) => {
  const id =
    process.env.TYPE === "file" ? parseInt(req.params.id) : req.params.id;
  const { error, data } = await withAsync(
    ProductsDao.deleteById,
    ProductsDao,
    id
  );
  if (error) {
    return res.status(500).json(error);
  } else {
    if (data) return res.json({ result: "success" });
    // error si no se encontró
    res.status(404);
    return res.json(errorMsg);
  }
});

module.exports = productosRouter;
