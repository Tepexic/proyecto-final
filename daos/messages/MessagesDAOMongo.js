const Contenedor = require("./../../containers/Contenedor_mongo");
const { Schema } = require("mongoose");

const messagesSchema = new Schema(
  {
    author: String,
    text: String,
    timestamp: String,
  },
  {
    writeConcern: {
      w: "majority",
      j: true,
      wtimeout: 1000,
    },
  }
);

const Messages = new Contenedor("messages", messagesSchema);

module.exports = Messages;
