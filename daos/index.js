const ProductsDAOFile = require("./productos/ProductDAOFile");
const ProductsDAOMongo = require("./productos/ProductDAOMongo");
const CartDAOFile = require("./carrito/CartDAOFile");
const CartDAOMongo = require("./carrito/CartDAOMongo");
const UsersDAOFile = require("./users/UsersDAOFile");
const UsersDAOMongo = require("./users/UsersDAOMongo");
const AdminDAOFile = require("./admin/AdminDaoFile");
const AdminDao = require("./admin/AdminDao");
const MessagesDAOFile = require("./messages/MessagesDAOFile");
const MessagesDAOMongo = require("./messages/MessagesDAOMongo");

class PersistenceFactory {
  constructor() {
    this.persistenceMode = process.env.TYPE || "mongodb";
    this.id = Math.random();
    this.isFileSelected = this.persistenceMode.includes("file");
  }

  getProductsDao() {
    if (this.isFileSelected) {
      return ProductsDAOFile;
    } else {
      return new ProductsDAOMongo();
    }
  }

  getCartDao() {
    if (this.isFileSelected) {
      return CartDAOFile;
    } else {
      return new CartDAOMongo();
    }
  }

  getUsersDao() {
    if (this.isFileSelected) {
      return UsersDAOFile;
    } else {
      return new UsersDAOMongo();
    }
  }

  getAdminDao() {
    if (this.isFileSelected) {
      return AdminDAOFile;
    } else {
      return new AdminDao();
    }
  }

  getMessagesDao() {
    if (this.isFileSelected) {
      return MessagesDAOFile;
    } else {
      return new MessagesDAOMongo();
    }
  }
}

const persistenceFactory = new PersistenceFactory();

module.exports = persistenceFactory;
