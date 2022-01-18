/**
 * El router base '/api/carrito' implementará tres rutas disponibles para usuarios y administradores:
 * - POST: '/' - Crea un carrito y devuelve su id.
 * - DELETE: '/:id' - Vacía un carrito y lo elimina.
 * - GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
 * - POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto
 * - DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto
 * El carrito de compras tendrá la siguiente estructura:
 * id, timestamp(carrito), producto: { id, timestamp(producto), nombre, descripcion, código, foto (url), precio, stock }
 */

const express = require("express");
const { Router } = express;
const { CartDao } = require("./../daos");
const { withAsync } = require("./../utils/helpers");
const auth = require("./../middleware/auth");

const carritoRouter = Router();

const errorMsg = {
  error: -3,
  descripcion: "Carrito no encontrado",
};

carritoRouter.post("/", auth, async (req, res) => {
  const carritoNuevo = {
    timestamp: Date.now(),
    productos: [],
  };
  const { error, data } = await withAsync(CartDao.save, CartDao, carritoNuevo);
  if (error) {
    res.status(500).json(error);
  } else {
    const newId = data;
    res.status(201);
    res.send({
      message: "success",
      data: { _id: newId, ...carritoNuevo },
    });
  }
});

carritoRouter.delete("/:id", auth, async (req, res) => {
  const id =
    process.env.TYPE === "file" ? parseInt(req.params.id) : req.params.id;
  // consulta solo si el is es válido
  const { error, data } = await withAsync(CartDao.deleteById, CartDao, id);
  if (error) {
    res.status(500).json(error);
  } else {
    if (data) return res.json({ result: "success" });
    // error si no se encontró
    res.status(404);
    return res.json(errorMsg);
  }
});

carritoRouter.get("/:id/productos", auth, async (req, res) => {
  const id =
    process.env.TYPE === "file" ? parseInt(req.params.id) : req.params.id;
  // consulta solo si el is es válido
  const { error, data } = await withAsync(CartDao.getById, CartDao, id);
  if (error) {
    res.status(500).json(error);
  } else {
    if (data) return res.json(data.productos);
    // error si no se encontró
    res.status(404);
    return res.json(errorMsg);
  }
});

carritoRouter.post("/:id/productos/:id_prod", auth, async (req, res) => {
  const id =
    process.env.TYPE === "file" ? parseInt(req.params.id) : req.params.id;
  // Obtener el carrito en cuestión
  const { error, data } = await withAsync(CartDao.getById, CartDao, id);
  if (error) {
    res.status(500).json(error);
  } else {
    if (data) {
      // agregar producto al carrito
      const producto = { _id: req.params.id_prod };
      data.productos.push(producto);
      const updateResult = await withAsync(
        CartDao.updateById,
        CartDao,
        data._id,
        data
      );
      if (updateResult.error) {
        res.status(500).json(updateResult.error);
      } else {
        res.status(201);
        return res.send({
          message: "success",
          data,
        });
      }
    }
    // error si no se encontró
    res.status(404);
    return res.json(errorMsg);
  }
});

carritoRouter.delete("/:id/productos/:id_prod", auth, async (req, res) => {
  const id =
    process.env.TYPE === "file" ? parseInt(req.params.id) : req.params.id;
  const id_prod =
    process.env.TYPE === "file"
      ? parseInt(req.params.id_prod)
      : req.params.id_prod;
  const { error, data } = await withAsync(CartDao.getById, CartDao, id);
  if (error) {
    res.status(500).json(error);
  } else {
    if (data) {
      const producto = data.productos.find((prod) => prod._id == id_prod);
      if (producto) {
        data.productos = data.productos.filter((prod) => prod._id != id_prod);
        const updateResult = await withAsync(
          CartDao.updateById,
          CartDao,
          data._id,
          data
        );
        if (updateResult.error) {
          res.status(500).json(updateResult.error);
        } else {
          res.status(200);
          return res.send({
            message: "success",
            data: { data },
          });
        }
      }
      // error si no se encontró
      res.status(404);
      return res.json({
        error: -4,
        descripcion: "Producto no encontrado en carrito",
      });
    }
  }
  // error si no se encontró
  res.status(404);
  return res.json(errorMsg);
});

module.exports = carritoRouter;
