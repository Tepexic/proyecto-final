const Api = require("../utils/api");
const withAsync = require("../utils/withAsync");

class ProductosApi extends Api {
  fetchProducts() {
    return this.get("/productos/");
  }
  fetchProductById(id) {
    return this.get(`/productos/${id}`);
  }
  addNewProduct(product) {
    return this.post("/productos", product);
  }
  updateProductById(id, product) {
    return this.put(`/productos/${id}`, product);
  }
  deleteProductById(id) {
    return this.delete(`/productos/${id}`);
  }
}

const productosApi = new ProductosApi();

const executeTest = async (method, ...config) => {
  const { data, error } = await withAsync(
    productosApi[method],
    productosApi,
    ...config
  );
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
};

const main = async () => {
  console.log("======== Pruebas con  cliente http ========");
  console.log("-------------------------------------------");
  console.log("Obtener todos los productos ---------------");
  await executeTest("fetchProducts");
  console.log("-------------------------------------------");
  console.log("Obtener producto por id -------------------");
  await executeTest("fetchProductById", 0);
  console.log("-------------------------------------------");
  console.log("Agregar nuevo producto --------------------");
  await executeTest("addNewProduct", {
    nombre: "Auriculares TRN MT1",
    descripcion:
      "Auriculares intrauditivos TRN MT1 con Monitor dinámico para DJ",
    codigo: 1234567896,
    precio: 3001,
    foto: "https://ae01.alicdn.com/kf/H0964909d8652417fb5a0c318028f1025z/Auriculares-intrauditivos-TRN-MT1-con-Monitor-din-mico-para-DJ-aud-fonos-IEM-HIFI-deportivos-con.jpg_640x640.jpg",
    stock: 36,
  });
  console.log("--------------------------------------------");
  console.log("Actualizar producto por id -----------------");
  await executeTest("updateProductById", 3, {
    nombre: "Auriculares TRN MT1",
    descripcion:
      "Auriculares intrauditivos TRN MT1 con Monitor dinámico para DJ",
    codigo: 1234567896,
    precio: 3001,
    foto: "https://ae01.alicdn.com/kf/H0964909d8652417fb5a0c318028f1025z/Auriculares-intrauditivos-TRN-MT1-con-Monitor-din-mico-para-DJ-aud-fonos-IEM-HIFI-deportivos-con.jpg_640x640.jpg",
    stock: 50,
  });
  console.log("--------------------------------------------");
  console.log("Borrar producto por id ---------------------");
  await executeTest("deleteProductById", 3);
};

main();
