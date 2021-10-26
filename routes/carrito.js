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

const Contenedor = require("./../utils/Contenedeor");
const Carrito = new Contenedor("./routes/data/carrito.json");
isIdValid = require("./../utils/helpers");

const carritoRouter = Router();

const errorMsg = { error: "carrito no encontrado" };


carritoRouter.post("/", async (req, res) => {
  const carritoNuevo = {
    timestamp: Date.now(),
    productos: [],
  }
  const newId = await Carrito.save(carritoNuevo);
  res.status(201);
  res.send({
    message: "success",
    data: { id: newId, ...carritoNuevo },
  });
});

carritoRouter.delete("/:id", async (req, res) => {
  // mensaje de error
  const id = parseInt(req.params.id);
  // consulta solo si el is es válido
  if (isIdValid(id)) {
    const result = await Carrito.deleteById(id);
    if (result) return res.json({ result: "success" });
    // error si no se encontró
    res.status(404);
    return res.json(errorMsg);
  }
  // error si no es un id valido
  res.status(404);
  return res.json(errorMsg);
});

carritoRouter.get("/:id/productos", async (req, res) => {
  // mensaje de error
  const id = parseInt(req.params.id);
  // consulta solo si el is es válido
  if (!isNaN(id) && id !== null) {
    const carrito = await Carrito.getById(id);
    if (carrito) return res.json(carrito.productos);
    // error si no se encontró
    res.status(404);
    return res.json(errorMsg);
  }
  // error si no es un id valido
  res.status(404);
  return res.json(errorMsg);
});

carritoRouter.post("/:id/productos", async (req, res) => {
  // mensaje de error
  const id = parseInt(req.params.id);
  // consulta solo si el id es válido
  if (!isNaN(id) && id !== null) {
    const carrito = await Carrito.getById(id);
    if (carrito) {
      const producto = req.body;
      producto.timestamp = Date.now();
      carrito.productos.push(producto);
      await Carrito.updateById(carrito.id, carrito);
      res.status(201);
      return res.send({
        message: "success",
        data: { ...producto },
      });
    }
    // error si no se encontró
    res.status(404);
    return res.json(errorMsg);
  }
  // error si no es un id valido
  res.status(404);
  return res.json(errorMsg);
});

carritoRouter.delete("/:id/productos/:id_prod", async (req, res) => {
  // mensaje de error
  const id = parseInt(req.params.id);
  const id_prod = parseInt(req.params.id_prod);
  // consulta solo si el id es válido
  if (!isNaN(id) && id !== null && !isNaN(id_prod) && id_prod !== null) {
    const carrito = await Carrito.getById(id);
    if (carrito) {
      const producto = carrito.productos.find(prod => prod.id === id_prod);
      if (producto) {
        carrito.productos = carrito.productos.filter(prod => prod.id !== id_prod);
        await Carrito.updateById(carrito.id, carrito);
        res.status(200);
        return res.send({
          message: "success",
          data: { ...producto },
        });
      }
      // error si no se encontró
      res.status(404);
      return res.json(errorMsg);
    }
    // error si no se encontró
    res.status(404);
    return res.json(errorMsg);
  }
  // error si no es un id valido
  res.status(404);
  return res.json(errorMsg);
});

module.exports = carritoRouter;
