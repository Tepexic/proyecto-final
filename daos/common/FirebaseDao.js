class FireBaseDao {
  constructor(Contenedor, collectionName) {
    this.collectionName = collectionName;
    this.Contenedor = Contenedor;
  }

  async save(element) {
    return await this.Contenedor.save(this.collectionName, element);
  }

  async getById(id) {
    return await this.Contenedor.getById(this.collectionName, id);
  }

  async getAll() {
    return await this.Contenedor.getAll(this.collectionName);
  }

  async updateById(id, newData) {
    return await this.Contenedor.updateById(this.collectionName, id, newData);
  }

  async deleteById(id) {
    return await this.Contenedor.deleteById(this.collectionName, id);
  }

  async deleteAll() {
    return await this.Contenedor.deleteAll(this.collectionName);
  }
}

module.exports = FireBaseDao;
