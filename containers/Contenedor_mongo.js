const mongoose = require("mongoose");
const uri = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.foboz.mongodb.net/${process.env.USERS_DB}?retryWrites=true&w=majority`;

class Contenedor {
  constructor(collectionName, schema) {
    this.collection =
      mongoose.models[collectionName] || mongoose.model(collectionName, schema);
    this.init();
  }

  async init() {
    if (this.connection) {
      return;
    }
    this.connection = await mongoose.connect(uri);
  }

  /**
   * save(Object): ID - Recibe un objeto, lo guarda y
   * devuelve el id asignado.
   */
  async save(element, returnIdOnly = true) {
    try {
      const document = await this.collection.create(element);
      if (returnIdOnly) {
        return { data: document._id, error: null };
      } else {
        return { data: document, error: null };
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * getById(Number): Object - Recibe un id y devuelve el objeto con ese id,
   * o null si no está.
   */
  async getById(id) {
    try {
      const searchResult = await this.collection.findOne({ _id: id });
      if (searchResult) {
        if (process.env.TYPE === "file") {
          return { data: searchResult.length ? searchResult : null };
        } else {
          return { data: searchResult };
        }
      }
      return { data: null };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * updateById(Number, Object): - Recibe un id y un objeto. Actualiza el objeto con ese id,
   * retorna true si el objeto con ese id existe, false en caso contrario
   */
  async updateById(id, newData) {
    try {
      const { matchedCount, modifiedCount } = await this.collection.updateOne(
        { _id: id },
        {
          $set: newData,
        }
      );
      if (matchedCount == 0) {
        console.log("No se encontró el elemento en la base de datos");
        return { data: false };
      }
      console.log(
        `${modifiedCount} Elemento${
          modifiedCount === 1 ? "" : "s"
        } actualizado${modifiedCount === 1 ? "" : "s"}`
      );
      return { data: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * getAll(): Object[] - Devuelve un array con los objetos presentes en el
   * archivo.
   */
  async getAll() {
    try {
      const result = await this.collection.find();
      return { data: result };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * deleteById(Number): boolean - Elimina del archivo el objeto con el id
   * buscado.
   */
  async deleteById(id) {
    try {
      const { deletedCount } = await this.collection.deleteOne({ _id: id });
      if (deletedCount > 0) {
        console.log(
          `${deletedCount} Elemento${deletedCount === 1 ? "" : "s"} eliminado${
            deletedCount === 1 ? "" : "s"
          }`
        );
        return { data: true };
      } else {
        console.log("No se encontró el elemento en la base de datos");
        return { data: false };
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * deleteAll(): void - Elimina todos los objetos presentes en el archivo.
   */
  async deleteAll() {
    try {
      const { deletedCount } = await this.collection.deleteMany({});
      if (deletedCount > 0) {
        console.log(
          `${deletedCount} Elemento${deletedCount === 1 ? "" : "s"} eliminado${
            deletedCount === 1 ? "" : "s"
          }`
        );
      } else {
        console.log("No se encontraron elementos para eliminar");
      }
      return {
        data: {
          deletedCount,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getByProperty(property, value) {
    try {
      const searchCriteria = {};
      searchCriteria[property] = value;
      const searchResult = await this.collection.findOne(searchCriteria);
      if (searchResult) {
        if (process.env.TYPE === "file") {
          return { data: searchResult.length ? searchResult : null };
        } else {
          return { data: searchResult };
        }
      }
      return { data: null };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getByIds(ids) {
    try {
      const searchResult = await this.collection.find({ _id: { $in: ids } });
      if (searchResult) {
        if (process.env.TYPE === "file") {
          return { data: searchResult.length ? searchResult : null };
        } else {
          return { data: searchResult.map((doc) => doc.toObject()) };
        }
      }
      return { data: null };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = Contenedor;
