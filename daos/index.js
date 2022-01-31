const ProductsDAOMongo = require("./productos/ProductDAOMongo");
const CartDAOMongo = require("./carrito/CartDAOMongo");
const UsersDAOMongo = require("./users/UsersDAOMongo");
const AdminDao = require("./admin/AdminDao");

module.exports = {
  ProductsDao: new ProductsDAOMongo(),
  CartDao: new CartDAOMongo(),
  UsersDao: new UsersDAOMongo(),
  AdminDao: new AdminDao(),
};
