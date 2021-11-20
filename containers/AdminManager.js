fs = require("fs");

class AdminManager {
  constructor(path) {
    this.filePath = path;
    this.encoding = "utf-8";
    this.fileContent = null;
  }

  // Lee el archivo, o crea uno si está vacío o no existe
  async readFile() {
    try {
      this.fileContent = JSON.parse(
        await fs.promises.readFile(this.filePath, this.encoding)
      );
    } catch {
      // el archivo no existe, hay que hacer uno nuevo
      await this.writeFile();
    }
  }

  // Escribe el archivo
  async writeFile(content = this.fileContent) {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(content));
    } catch (error) {
      console.error(error);
    }
  }

  async isAdmin() {
    await this.readFile();
    return this.fileContent;
  }

  async toggleAdmin() {
    await this.readFile();
    this.fileContent.admin = !this.fileContent.admin;
    await this.writeFile();
    return this.fileContent;
  }
}

module.exports = AdminManager;
