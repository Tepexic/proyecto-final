const ProductsDAOFile = require("./productos/ProductDAOFile");
const ProductsDAOMongo = require("./productos/ProductDAOMongo");
const CartDAOFile = require("./carrito/CartDAOFile");
const CartDAOMongo = require("./carrito/CartDAOMongo");

class PersistenceFactory {
  constructor() {
    this.argsv = process.argv.slice(2);
    this.persistenceMode = this.argsv[0] || "file";
    this.id = Math.random();
  }

  getProductsDAO() {
    if (this.persistenceMode.includes("file")) {
      return ProductsDAOFile;
    } else {
      return new ProductsDAOMongo();
    }
  }

  getCartDAO() {
    if (this.persistenceMode.includes("file")) {
      return CartDAOFile;
    } else {
      return new CartDAOMongo();
    }
  }
}

const persistenceFactory = new PersistenceFactory();

module.exports = persistenceFactory;
