const graphqlHTTP = require("express-graphql").graphqlHTTP;
const buildSchema = require("graphql").buildSchema;

const persistenceFactory = require("./../daos");
const ProductsDao = persistenceFactory.getProductsDAO();

const productSchema = buildSchema(`
  type Product {
    _id: Int!
    nombre: String!
    precio: Float!
    descripcion: String
    codigo: String
    foto: String
    stock: Int
  }
  type Query {
    getProduct(_id: Int): Product
    getProducts: [Product]
  } 
  type Mutation {
    createProduct(nombre: String!, descripcion: String, codigo: Int, precio: Float, foto: String, stock: Int): Product
    updateProduct(_id: Int!, nombre: String, descripcion: String, codigo: Int, precio: Float, foto: String, stock: Int): Product
    deleteProduct(_id: Int!): Product
  }
`);

const productosRouter = graphqlHTTP({
  schema: productSchema,
  rootValue: {
    getProduct: async ({ _id }) => {
      const product = await ProductsDao.getById(_id);
      return product.data;
    },
    getProducts: async () => {
      const products = await ProductsDao.getAll();
      return products.data;
    },
    createProduct: async (data) => {
      const product = await ProductsDao.save(data);
      return product.data;
    },
    updateProduct: async (data) => {
      const product = await ProductsDao.getById(_id);
      const updateResult = await ProductsDao.updateById(data._id, data);
      if (updateResult.data) {
        return product.data;
      } else {
        throw new Error("producto no encontrado");
      }
    },
    deleteProduct: async ({ _id }) => {
      const product = await ProductsDao.getById(_id);
      const deleteResult = await ProductsDao.deleteById(_id);
      if (deleteResult.data) {
        return product.data;
      } else {
        throw new Error("producto no encontrado");
      }
    },
  },
  graphiql: true,
});

module.exports = productosRouter;
