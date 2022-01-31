const Contenedor = require("./../../containers/Contenedor_mongo");
const { Schema } = require("mongoose");

class Users extends Contenedor {
  constructor() {
    super(
      "users",
      new Schema(
        {
          email: String,
          username: String,
          password: String,
          name: String,
          address: String,
          age: Number,
          phone: String,
          avatar: String,
          isAdmin: Boolean,
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

module.exports = Users;
