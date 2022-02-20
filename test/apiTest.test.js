const request = require("supertest")("http://localhost:8080/api");
const expect = require("chai").expect;

const productoId = "3";

const productoNuevo = {
  nombre: "Auriculares TRN MT1",
  descripcion: "Auriculares intrauditivos TRN MT1 con Monitor dinámico para DJ",
  codigo: 1234567896,
  precio: 3001,
  foto: "https://ae01.alicdn.com/kf/H0964909d8652417fb5a0c318028f1025z/Auriculares-intrauditivos-TRN-MT1-con-Monitor-din-mico-para-DJ-aud-fonos-IEM-HIFI-deportivos-con.jpg_640x640.jpg",
  stock: 36,
};

const productoModificado = {
  nombre: "Auriculares TRN MT1",
  descripcion: "Auriculares intrauditivos TRN MT1 con Monitor dinámico para DJ",
  codigo: 1234567896,
  precio: 3001,
  foto: "https://ae01.alicdn.com/kf/H0964909d8652417fb5a0c318028f1025z/Auriculares-intrauditivos-TRN-MT1-con-Monitor-din-mico-para-DJ-aud-fonos-IEM-HIFI-deportivos-con.jpg_640x640.jpg",
  stock: 50,
};

describe("Probar la api de productos con chai y supertest", () => {
  it("Deberia obtener todos los productos con status 200", async () => {
    const response = await request.get("/productos");
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });

  it("Deberia obtener un producto por su id", async () => {
    const response = await request.get(`/productos/0`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("object");
    expect(response.body).to.include.keys(
      "_id",
      "nombre",
      "descripcion",
      "codigo",
      "precio",
      "foto",
      "stock"
    );
  });

  it("Debería crear un nuevo producto", async () => {
    const response = await request.post("/productos").send(productoNuevo);
    expect(response.status).to.equal(201);
    expect(response.body.data).to.include.keys(
      "_id",
      "nombre",
      "descripcion",
      "codigo",
      "precio",
      "foto",
      "stock"
    );
    expect(response.body.data).to.eql({
      _id: response.body.data._id,
      timestamp: response.body.data.timestamp,
      ...productoNuevo,
    });
  });

  it("Debería actualizar un  producto con su id", async () => {
    const response = await request
      .put(`/productos/${productoId}`)
      .send(productoModificado);
    expect(response.status).to.equal(201);
    const query = await request.get(`/productos/${productoId}`);
    expect(query.body).to.eql({
      _id: query.body._id,
      ...productoModificado,
    });
  });

  it("Deberia borrar un producto por su id", async () => {
    const response = await request.delete(`/productos/${productoId}`);
    expect(response.status).to.eql(200);
    const query = await request.get(`/productos/${productoId}`);
    expect(query.status).to.equal(404);
  });
});
