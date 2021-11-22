const FireBaseDao = require("./../common/FireBaseDao");

class Carrito extends FireBaseDao {
  constructor(Contenedor) {
    super(Contenedor, "carrito");
  }
}

module.exports = Carrito;
