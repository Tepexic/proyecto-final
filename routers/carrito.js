const graphqlHTTP = require("express-graphql").graphqlHTTP;
const buildSchema = require("graphql").buildSchema;
const persistenceFactory = require("./../daos");
const CartDao = persistenceFactory.getCartDAO();

const cartSchema = buildSchema(`
  type Cart {
    _id: Int!
    productos: [Int]
  }
  type Query {
    getCart(_id: Int): Cart
  }
  type Mutation {
    createCart: Cart
    deleteCart(_id: Int): Cart
    addProductToCart(_id: Int, idProd: Int): Cart
    deleteProductFromCart(_id: Int, idProd: Int): Cart
  }
`);

carritoRouter = graphqlHTTP({
  schema: cartSchema,
  rootValue: {
    getCart: async ({ _id }) => {
      const cart = await CartDao.getById(_id);
      return cart.data;
    },
    createCart: async () => {
      const carritoNuevo = {
        productos: [],
      };
      const newId = await CartDao.save(carritoNuevo);
      return newId.data;
    },
    deleteCart: async ({ _id }) => {
      const cart = await CartDao.getById(_id);
      const deleteResult = await CartDao.deleteById(_id);
      if (deleteResult.data) {
        return cart.data;
      } else {
        throw new Error("Carrito no encontrado");
      }
    },
    addProductToCart: async ({ _id, idProd }) => {
      const cart = await CartDao.getById(_id);
      cart.data.productos.push(idProd);
      const updateResult = await CartDao.updateById(_id, cart.data);
      console.log(cart.data);
      if (updateResult.data) {
        return cart.data;
      } else {
        throw new Error("Carrito no encontrado");
      }
    },
    deleteProductFromCart: async ({ _id, idProd }) => {
      const cart = await CartDao.getById(_id);
      const index = cart.data.productos.indexOf(idProd);
      cart.data.productos.splice(index, 1);
      const updateResult = await CartDao.updateById(_id, cart.data);
      if (updateResult.data) {
        return cart.data;
      } else {
        throw new Error("Carrito no encontrado");
      }
    },
  },
  graphiql: true,
});

module.exports = carritoRouter;
