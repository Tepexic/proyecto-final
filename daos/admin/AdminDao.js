const Contenedor = require("../../containers/Contenedor_mongo");
const { Schema } = require("mongoose");

class Admin extends Contenedor {
  constructor() {
    super(
      "admin",
      new Schema(
        {
          email: String,
          phone: String,
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

module.exports = Admin;
