/* firebase needs to be initialized only once */
const admin = require("firebase-admin");
const options = require("./../config");
const serviceAccount = options.firestore;

class Contenedor {
  constructor() {
    this.init();
  }

  async init() {
    if (!this.firestore) {
      await admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://carbon-nucleus-264418.firebaseio.com",
      });
      this.firestore = admin.firestore();
    }
    console.log("Conectado a la base de datos");
  }

  /**
   * save(Object): ID - Recibe un objeto, lo guarda y
   * devuelve el id asignado.
   */
  async save(collectionName, element) {
    try {
      const document = await this.firestore
        .collection(collectionName)
        .add(element);
      return { data: document._path.segments[1], error: null };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * getById(Number): Object - Recibe un id y devuelve el objeto con ese id,
   * o null si no está.
   */
  async getById(collectionName, id) {
    try {
      const searchResult = await this.firestore
        .collection(collectionName)
        .doc(id)
        .get();
      const data = searchResult.data();
      if (data) {
        return { data };
      } else {
        return { data: null };
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * updateById(Number, Object): - Recibe un id y un objeto. Actualiza el objeto con ese id,
   * retorna true si el objeto con ese id existe, false en caso contrario
   */
  async updateById(collectionName, id, newData) {
    try {
      const match = await this.firestore
        .collection(collectionName)
        .doc(id)
        .get();
      if (match.data()) {
        await this.firestore.collection(collectionName).doc(id).update(newData);
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
   * getAll(): Object[] - Devuelve un array con los objetos presentes en el
   * archivo.
   */
  async getAll(collectionName) {
    try {
      const result = await this.firestore.collection(collectionName).get();
      const data = result.docs.map((doc) => {
        return { _id: doc.id, ...doc.data() };
      });
      return { data };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * deleteById(Number): boolean - Elimina del archivo el objeto con el id
   * buscado.
   */
  async deleteById(collectionName, id) {
    try {
      const match = await this.firestore
        .collection(collectionName)
        .doc(id)
        .get();
      if (match.data()) {
        await this.firestore.collection(collectionName).doc(id).delete();
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
  async deleteAll(collectionName) {
    try {
      await this.firestore
        .collection(collectionName)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });
      return {
        data: true,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = Contenedor;
