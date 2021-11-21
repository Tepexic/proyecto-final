const Contenedor = require("./../../containers/Contenedor_mongo");
const { Schema } = require("mongoose");

class Carrito extends Contenedor {
  constructor() {
    super(
      "carrito",
      new Schema(
        {
          timestamp: { type: Date, default: Date.now },
          productos: { type: Array, required: true },
        },
        {
          writeConcern: {
            w: "majority",
            j: true,
            wtimeout: 1000,
          },
        }
      )
    );
  }
}

module.exports = Carrito;
