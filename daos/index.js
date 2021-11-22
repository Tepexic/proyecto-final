const ProductsDAOFile = require("./productos/ProductDAOFile");
const CartDAOFile = require("./carrito/CartDAOFile");

const ProductsDAOMongo = require("./productos/ProductDAOMongo");
const CartDAOMongo = require("./carrito/CartDAOMongo");

const ContenedorFirebase = require("./../containers/Contenedor_firebase");
const ProductsDAOFirebase = require("./productos/ProductDAOFirebase");
const CartDAOFirebase = require("./carrito/CartDAOFirebase");

if (process.env.TYPE === "mongodb") {
  module.exports = {
    ProductsDao: new ProductsDAOMongo(),
    CartDao: new CartDAOMongo(),
  };
} else if (process.env.TYPE === "file") {
  module.exports = {
    ProductsDao: ProductsDAOFile,
    CartDao: CartDAOFile,
  };
} else if (process.env.TYPE === "firebase") {
  const Contenedor = new ContenedorFirebase();
  module.exports = {
    ProductsDao: new ProductsDAOFirebase(Contenedor),
    CartDao: new CartDAOFirebase(Contenedor),
  };
} else {
  console.log("TYPE: ", process.env.TYPE);
  throw new Error(
    "No se ha especificado el tipo de base de datos o no es valido"
  );
}
