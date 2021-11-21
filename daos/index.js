const ProductsDAOFile = require("./productos/ProductDAOFile");
const ProductsDAOMongo = require("./productos/ProductDAOMongo");
const CartDAOFile = require("./carrito/CartDAOFile");
const CartDAOMongo = require("./carrito/CartDAOMongo");

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
} else {
  console.log("TYPE: ", process.env.TYPE);
  throw new Error(
    "No se ha especificado el tipo de base de datos o no es valido"
  );
}
