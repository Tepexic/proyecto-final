# Desafío Clase 42 - REFORMAR PARA USAR GRAPHQL

## Consigna:

- En base al último proyecto entregable de servidor API RESTful, reformar la capa de routeo y el controlador para que los requests puedan ser realizados a través del lenguaje de query GraphQL.

  Si tuviésemos un frontend, reformarlo para soportar GraphQL y poder dialogar apropiadamente con el backend y así realizar las distintas operaciones de pedir, guardar, actualizar y borrar recursos.

  Utilizar GraphiQL para realizar la prueba funcional de los querys y las mutaciones.

## Correr localmente el proyecto

- Instalar dependencias: `npm install`
- Modo de desarrollo con `nodemon`: `npm run dev`
- Correr localmente: `npm run start`

El modo de persistencia por defecto en estos comandos es de archivo (ver archivo `package.json`), si desea cambiarse por mongo, correr:

```
node server.js mongo
```

o bien:

```
nodemon server.js mongo
```

## Serivios disponibles

### Productos

Servicio que implementa GraphQL en la ruta `POST /api/productos/` bajo el siguiente esquema:

```
Product {
    _id: Int!
    nombre: String!
    precio: Float!
    descripcion: String
    codigo: String
    foto: String
    stock: Int
}
```

Consultas:

```
    getProduct(_id: Int): Product
    getProducts: [Product]
```

Mutaciones:

```
  createProduct(nombre: String!, descripcion: String, codigo: Int, precio: Float, foto: String, stock: Int): Product
  updateProduct(_id: Int!, nombre: String, descripcion: String, codigo: Int, precio: Float, foto: String, stock: Int): Product
  deleteProduct(_id: Int!): Product
```

### Carrito

Servicio que implementa GraphQL en la ruta `POST /api/carrito/`. Cada carrito estará representado por un objeto con el siguiente esquema:

```
Cart {
    _id: Int!
    productos: [Int]
  }
```

Consultas:

```
  getCart(_id: Int): Cart
```

Mutaciones:

```
createCart: Cart
deleteCart(_id: Int): Cart
addProductToCart(_id: Int, idProd: Int): Cart
deleteProductFromCart(_id: Int, idProd: Int): Cart
```
