const FireBaseDao = require("./../common/FireBaseDao");

class Productos extends FireBaseDao {
  constructor(Contenedor) {
    super(Contenedor, "productos");
  }
}

module.exports = Productos;
