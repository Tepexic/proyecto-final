const persistenceFactory = require("./../daos");
const persistenceFactoryCopia = require("./../daos");

console.log("Comparacion entre ambas factories");
console.log(
  "Con tiple igual: ",
  persistenceFactory === persistenceFactoryCopia
);
console.log(
  "Con Object.is():",
  Object.is(persistenceFactory, persistenceFactoryCopia)
);
console.log("Comparar id de las factories");
console.log("Factory 1: ", persistenceFactory.id);
console.log("Factory 2: ", persistenceFactoryCopia.id);

const carrito1 = persistenceFactory.getCartDAO();
const carrito2 = persistenceFactoryCopia.getCartDAO();
console.log("Comparacion entre ambos carritos");
console.log("Con tiple igual: ", carrito1 === carrito2);
console.log("Con Object.is():", Object.is(carrito1, carrito2));
