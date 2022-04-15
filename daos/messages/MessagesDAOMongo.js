const Contenedor = require("./../../containers/Contenedor_mongo");
const { Schema } = require("mongoose");

class Messages extends Contenedor {
  constructor() {
    super(
      "messages",
      new Schema(
        {
          author: String,
          text: String,
          timestamp: String,
          avatar: String,
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

module.exports = Messages;
