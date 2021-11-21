const Contenedor = require("./../../containers/Contenedor_mongo");
const { Schema } = require("mongoose");

class Productos extends Contenedor {
  constructor() {
    super(
      "productos",
      new Schema(
        {
          nombre: { type: String, required: true },
          descripcion: { type: String, required: true },
          codigo: { type: Number, required: true },
          precio: { type: Number, required: true },
          foto: { type: String, required: true },
          stock: { type: Number, required: true },
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

module.exports = Productos;
