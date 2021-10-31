/**
 * Deberás entregar el estado de avance de tu aplicación eCommerce Backend, que implemente un servidor de
 * aplicación basado en la plataforma Node.js y el middleware express. El servidor implementará dos conjuntos
 * de rutas agrupadas en routers, uno con la url base '/productos' y el otro con '/carrito'. El puerto de
 * escucha será el 8080 para desarrollo y process.env.PORT para producción en glitch.com
 */

const express = require("express");
const productos = require("./routes/productos");
const carrito = require("./routes/carrito");
const admin = require("./routes/admin");

const server = express();

// middleware
server.use(express.json());
server.use(express.urlencoded({ encoded: true }));

// Usar rutas
server.use("/api/productos/", productos);
server.use("/api/carrito/", carrito);
server.use("/api/admin/", admin);

// rutas no definidas
server.use((req, res) => {
  res.status(404);
  res.json({
    error : -2,
    descripcion: `ruta ${req.path} metodo ${req.method} no implementada`
  })
})

server.on("error", (err) => {
  console.error(err);
});

module.exports = server;
