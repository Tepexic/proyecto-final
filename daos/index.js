const ProductsDAOFile = require("./productos/ProductDAOFile");
const ProductsDAOMongo = require("./productos/ProductDAOMongo");
const CartDAOFile = require("./carrito/CartDAOFile");
const CartDAOMongo = require("./carrito/CartDAOMongo");

class PersistenceFactory {
  getProductsDAO() {
    if (process.env.TYPE === "file") {
      return ProductsDAOFile;
    } else {
      return new ProductsDAOMongo();
    }
  }

  getCartDAO() {
    if (process.env.TYPE === "file") {
      return CartDAOFile;
    } else {
      return new CartDAOMongo();
    }
  }
}

const persistenceFactory = new PersistenceFactory();

module.exports = persistenceFactory;
