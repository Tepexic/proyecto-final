const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const uri = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.foboz.mongodb.net/${process.env.USERS_DB}?retryWrites=true&w=majority`;

const usersSchema = new Schema(
  {
    email: String,
    username: String,
    password: String,
    name: String,
    address: String,
    age: Number,
    phone: String,
    avatar: String,
  },
  {
    writeConcern: {
      w: "majority",
      j: true,
      wtimeout: 1000,
    },
  }
);

const cartSchema = new Schema(
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
);

const userSchema = new Schema(
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
);

class ContenedorMongo {
  constructor() {
    this.collection = mongoose.model("users", usersSchema);
    this.cart = mongoose.model("cart", cartSchema);
    this.products = mongoose.model("products", userSchema);
    this.init();
  }

  async init() {
    if (this.connection) {
      return;
    }
    console.log("Conectando a la base de datos...");
    console.log(uri);
    this.connection = await mongoose.connect(uri);
  }
}

module.exports = ContenedorMongo;
