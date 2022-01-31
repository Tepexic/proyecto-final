/**
 * El router base '/api/carrito' implementará tres rutas disponibles para usuarios y administradores:
 * - POST: '/' - Crea un carrito y devuelve su id.
 * - DELETE: '/:id' - Vacía un carrito y lo elimina.
 * - GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
 * - POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto
 * - DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto
 * - POST /:id/comprar - Comprar el carrito por su id
 * El carrito de compras tendrá la siguiente estructura:
 * id, timestamp(carrito), producto: { id, timestamp(producto), nombre, descripcion, código, foto (url), precio, stock }
 */

const express = require("express");
const { Router } = express;
const { CartDao } = require("./../daos");
const { ProductsDao } = require("./../daos");
const { AdminDao } = require("./../daos");
const { withAsync } = require("./../utils/helpers");
const { apiAuth } = require("./../middleware/auth");
const logger = require("./../utils/logger");
const transporter = require("../utils/mailer");
const smsClient = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

const carritoRouter = Router();

const errorMsg = {
  error: -3,
  descripcion: "Carrito no encontrado",
};

carritoRouter.post("/", apiAuth, async (req, res) => {
  const carritoNuevo = {
    timestamp: Date.now(),
    productos: [],
  };
  const { error, data } = await withAsync(CartDao.save, CartDao, carritoNuevo);
  if (error) {
    logger.info({ ruta: req.path, metodo: req.method, error: error });
    logger.error({ ruta: req.path, metodo: req.method, error: error });
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

carritoRouter.delete("/:id", apiAuth, async (req, res) => {
  const id = req.params.id;
  // consulta solo si el is es válido
  const { error, data } = await withAsync(CartDao.deleteById, CartDao, id);
  if (error) {
    logger.info({ ruta: req.path, metodo: req.method, error: error });
    logger.error({ ruta: req.path, metodo: req.method, error: error });
    res.status(500).json(error);
  } else {
    if (data) return res.json({ result: "success" });
    // error si no se encontró
    logger.info({ ruta: req.path, metodo: req.method, error: errorMsg });
    logger.error({ ruta: req.path, metodo: req.method, error: errorMsg });
    res.status(404);
    return res.json(errorMsg);
  }
});

carritoRouter.get("/:id/productos", apiAuth, async (req, res) => {
  const id = req.params.id;
  // consulta solo si el is es válido
  const { error, data } = await withAsync(CartDao.getById, CartDao, id);
  if (error) {
    logger.info({ ruta: req.path, metodo: req.method, error: error });
    logger.error({ ruta: req.path, metodo: req.method, error: error });
    res.status(500).json(error);
  } else {
    if (data) return res.json(data.productos);
    // error si no se encontró
    logger.info({ ruta: req.path, metodo: req.method, error: errorMsg });
    logger.error({ ruta: req.path, metodo: req.method, error: errorMsg });
    res.status(404);
    return res.json(errorMsg);
  }
});

carritoRouter.post("/:id/productos/:id_prod", apiAuth, async (req, res) => {
  const id = req.params.id;
  console.log("carrito id ", id);
  // Obtener el carrito en cuestión
  const { error, data } = await withAsync(CartDao.getById, CartDao, id);
  console.log("carrito", data);
  if (error) {
    logger.info({ ruta: req.path, metodo: req.method, error: error });
    logger.error({ ruta: req.path, metodo: req.method, error: error });
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
        logger.info({
          ruta: req.path,
          metodo: req.method,
          error: updateResult.error,
        });
        logger.error({
          ruta: req.path,
          metodo: req.method,
          error: updateResult.error,
        });
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
    logger.info({ ruta: req.path, metodo: req.method, error: errorMsg });
    logger.error({ ruta: req.path, metodo: req.method, error: errorMsg });
    res.status(404);
    return res.json(errorMsg);
  }
});

carritoRouter.delete("/:id/productos/:id_prod", apiAuth, async (req, res) => {
  const id = req.params.id;
  const id_prod =
    process.env.TYPE === "file"
      ? parseInt(req.params.id_prod)
      : req.params.id_prod;
  const { error, data } = await withAsync(CartDao.getById, CartDao, id);
  if (error) {
    logger.info({ ruta: req.path, metodo: req.method, error: error });
    logger.error({ ruta: req.path, metodo: req.method, error: error });
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
          logger.info({
            ruta: req.path,
            metodo: req.method,
            error: updateResult.error,
          });
          logger.error({
            ruta: req.path,
            metodo: req.method,
            error: updateResult.error,
          });
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
      const customError = {
        error: -4,
        descripcion: "Producto no encontrado en carrito",
      };
      logger.info({ ruta: req.path, metodo: req.method, error: customError });
      logger.error({ ruta: req.path, metodo: req.method, error: customError });
      res.status(404);
      return res.json(customError);
    }
  }
  // error si no se encontró
  logger.info({ ruta: req.path, metodo: req.method, error: errorMsg });
  logger.error({ ruta: req.path, metodo: req.method, error: errorMsg });
  res.status(404);
  return res.json(errorMsg);
});

carritoRouter.post("/:id/comprar", apiAuth, async (req, res) => {
  const { error, data } = await withAsync(
    CartDao.getById,
    CartDao,
    req.params.id
  );
  if (error) {
    logger.info({ ruta: req.path, metodo: req.method, error: error });
    logger.error({ ruta: req.path, metodo: req.method, error: error });
    return res.status(500).json(error);
  } else {
    if (data) {
      // Obtener los productos de la base de datos
      const { error, data: productosDB } = await withAsync(
        ProductsDao.getByIds,
        ProductsDao,
        data.productos.map((prod) => prod._id)
      );
      if (error) {
        logger.info({ ruta: req.path, metodo: req.method, error: error });
        logger.error({ ruta: req.path, metodo: req.method, error: error });
        return res.status(500).json(error);
      }
      // Obtener los productos del carrito y mezclarlos con la base de datos
      const productos = [];
      const map = new Map();
      data.productos.forEach((item) => {
        if (!map.has(item["_id"])) {
          map.set(item["_id"], true);
          const index = productosDB.findIndex(
            (p) => p._id.toString() === item._id
          );
          productos.push({ ...productosDB[index], _id: item._id, qty: 1 });
        } else {
          const index = productos.findIndex((p) => p._id === item._id);
          productos[index].qty++;
        }
      });
      // Crear una orden
      const order = {
        products: [...productos],
        total: productos.reduce((acc, curr) => acc + curr.precio * curr.qty, 0),
        user: {
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
          address: req.user.address,
        },
        date: new Date(),
      };
      const { data: adminData } = await withAsync(
        AdminDao.getById,
        AdminDao,
        process.env.ADMIN_ID
      );
      // Mandar correo con los productos
      const mailContent = {
        from: "Ecommerce Proyecto Final",
        to: adminData.email,
        subject: `Nuevo pedido de ${order.user.name} - ${order.user.email}`,
        html: `<h1>Nuevo pedido registrado</h1>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${productos
              .map((producto) => {
                return `<tr>
                <td>${producto.nombre}</td>
                <td style="text-align:right">$ ${producto.precio}</td>
                <td style="text-align:right">${producto.qty}</td>
                <td style="text-align:right">$ ${
                  producto.precio * producto.qty
                }</td>
                </tr>`;
              })
              .join("")}
            <tr>
              <td colspan="3">Total</td>
              <td>$ ${order.total}</td>
            </tr>
          </tbody>
        </table>
        <p>Registrado: ${order.date.toLocaleString()}</p>
        <hr>
        <h3> Datos del cliente: </h3>
        <p>Nombre: ${order.user.name}</p>
        <p>Email: ${order.user.email}</p>
        <p>Teléfono: ${order.user.phone}</p>
        <p>Dirección: ${order.user.address}</p>
        `,
      };
      try {
        const info = await transporter.sendMail(mailContent);
        logger.info({ ruta: req.path, metodo: req.method, info });
      } catch (err) {
        logger.info({ ruta: req.path, metodo: req.method, error: err });
        logger.error({ ruta: req.path, metodo: req.method, error: err });
        return res.status(500).json(err);
      }

      // Mandar whatsapp al administrador

      const options = {
        body: `Nuevo pedido de ${req.user.name} - ${req.user.email}`,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP}`,
        to: `whatsapp:${adminData.phone}`,
      };
      try {
        const whats = await smsClient.messages.create(options);
        logger.info({ ruta: req.path, metodo: req.method, whats });
      } catch (err) {
        logger.info({ ruta: req.path, metodo: req.method, error: err });
        logger.error({ ruta: req.path, metodo: req.method, error: err });
        return res.status(500).json(err);
      }

      // Mandar mensaje de confirmación
      try {
        const message = await smsClient.messages.create({
          body: "Su pedido ha sido recibido y se encuentra en proceso de envío",
          messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE,
          to: req.user.phone,
        });
        logger.info({ ruta: req.path, metodo: req.method, message });
      } catch (err) {
        logger.info({ ruta: req.path, metodo: req.method, error: err });
        logger.error({ ruta: req.path, metodo: req.method, error: err });
        return res.status(500).json(err);
      }

      // Borrar carrito
      const { error: deleteError, data: deleteData } = await withAsync(
        CartDao.deleteById,
        CartDao,
        req.params.id
      );
      if (deleteError) {
        logger.info({ ruta: req.path, metodo: req.method, error: err });
        logger.error({ ruta: req.path, metodo: req.method, error: err });
        return res.status(500).json(err);
      } else {
        return res.status(200).json({
          message: "success",
          data: { data: deleteData },
        });
      }
    }
    // error si no se encontró
    logger.info({ ruta: req.path, metodo: req.method, error: errorMsg });
    logger.error({ ruta: req.path, metodo: req.method, error: errorMsg });
    res.status(404);
  }
});

module.exports = carritoRouter;
