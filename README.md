# Desafío Clase 42 -

## Consigna:

Revisar en forma completa el proyecto entregable que venimos realizando, refactorizando y reformando todo lo necesario para llegar al esquema de servidor API RESTful en capas planteado en esta clase.

Asegurarse de dejar al servidor bien estructurado con su ruteo / controlador, negocio, validaciones, persistencia y configuraciones (preferentemente utilizando en la codificación clases de ECMAScript).

No hace falta realizar un cliente ya que utilizaremos tests para verificar el correcto funcionamiento de las funcionalidades desarrolladas.

- Desarrollar un cliente HTTP de pruebas que utilice Axios para enviar peticiones, y realizar un test de la funcionalidad hacia la API Rest de productos, verificando la correcta lectura de productos disponibles, incorporación de nuevos productos, modificación y borrado.

- Realizar el cliente en un módulo independiente y desde un código aparte generar las peticiones correspondientes, revisando los resultados desde la base de datos y en la respuesta del servidor obtenida en el cliente HTTP.

- Luego, realizar las mismas pruebas, a través de un código de test apropiado, que utilice mocha, chai y Supertest, para probar cada uno de los métodos HTTP de la API Rest de productos.

- Escribir una suite de test para verificar si las respuestas a la lectura, incorporación, modificación y borrado de productos son las apropiadas. Generar un reporte con los resultados obtenidos de la salida del test.

## Correr localmente el proyecto

- Instalar dependencias: `npm install`
- Modo de desarrollo con `nodemon`: `npm run dev`
- Correr localmente: `npm run start`

El modo de persistencia por defecto en estos comandos es de archivo (ver archivo `package.json`), si desea cambiarse por mongo, correr:

```
node server.js mongo
```

o bien:

```
nodemon server.js mongo
```

## Pruebas con cliente

El cliente para probar los servicios dentro de `/productos` se encuentra en `./_test/cliente.js`. Para ejecutar las pruebas con este cliente hay que correr `npm run test:client`

El resultado por consola es:

```
======== Pruebas con  cliente http ========
-------------------------------------------
Obtener todos los productos ---------------
[
  {
    _id: 0,
    nombre: 'Cinta de reparación',
    descripcion: 'Cinta de reparación de pantalla de 5x200CM',
    codigo: 1234567890,
    precio: 4922,
    foto: 'https://ae01.alicdn.com/kf/H1b13e3760cc74dcd9b7e161256820bbdT/Cinta-de-reparaci-n-de-pantalla-de-5x200CM-parche-autoadhesivo-para-puerta-y-ventana-s-per.jpeg_Q90.jpeg_.webp',
    stock: 10
  },
  {
    _id: 1,
    nombre: 'Interruptor Outemu de 3 pines',
    descripcion: 'Interruptor Outemu de 3 pines para teclado mecánico, interruptores táctiles y silenciosos, RGB LED SMD, color azul y marrón, Compatible con interruptor MX',
    codigo: 1234567891,
    precio: 38866,
    foto: 'https://ae01.alicdn.com/kf/H9013370bd7e64d24983d6cea7fbb4724y/Interruptor-Outemu-de-3-pines-para-teclado-mec-nico-interruptores-t-ctiles-y-silenciosos-RGB-LED.jpg_640x640.jpg',
    stock: 15
  },
  {
    _id: 2,
    nombre: 'Cable de Teclado mecánico',
    descripcion: 'Cable de Teclado mecánico personalizado de 1,7 m',
    codigo: 1234567892,
    precio: 4500,
    foto: 'https://ae01.alicdn.com/kf/H777100f369944bb7b003618ae4143030b/Teclado-mec-nico-personalizado-de-1-7-m-cable-usb-c-resorte-en-espiral-mini-interfaz.jpg_Q90.jpg_.webp',
    stock: 0
  }
]
-------------------------------------------
Obtener producto por id -------------------
{
  _id: 0,
  nombre: 'Cinta de reparación',
  descripcion: 'Cinta de reparación de pantalla de 5x200CM',
  codigo: 1234567890,
  precio: 4922,
  foto: 'https://ae01.alicdn.com/kf/H1b13e3760cc74dcd9b7e161256820bbdT/Cinta-de-reparaci-n-de-pantalla-de-5x200CM-parche-autoadhesivo-para-puerta-y-ventana-s-per.jpeg_Q90.jpeg_.webp',
  stock: 10
}
-------------------------------------------
Agregar nuevo producto --------------------
{
  message: 'success',
  data: {
    _id: 3,
    nombre: 'Auriculares TRN MT1',
    descripcion: 'Auriculares intrauditivos TRN MT1 con Monitor dinámico para DJ',
    codigo: 1234567896,
    precio: 3001,
    foto: 'https://ae01.alicdn.com/kf/H0964909d8652417fb5a0c318028f1025z/Auriculares-intrauditivos-TRN-MT1-con-Monitor-din-mico-para-DJ-aud-fonos-IEM-HIFI-deportivos-con.jpg_640x640.jpg',
    stock: 36,
    timestamp: 1645288642335
  }
}
--------------------------------------------
Actualizar producto por id -----------------
{
  message: 'success',
  data: {
    nombre: 'Auriculares TRN MT1',
    descripcion: 'Auriculares intrauditivos TRN MT1 con Monitor dinámico para DJ',
    codigo: 1234567896,
    precio: 3001,
    foto: 'https://ae01.alicdn.com/kf/H0964909d8652417fb5a0c318028f1025z/Auriculares-intrauditivos-TRN-MT1-con-Monitor-din-mico-para-DJ-aud-fonos-IEM-HIFI-deportivos-con.jpg_640x640.jpg',
    stock: 50
  }
}
--------------------------------------------
Borrar producto por id ---------------------
{ result: 'success' }
```

## Pruebas con Mocha, Chai y Supertest

El archivo que contiene las pruebas de los servicios de `/productos` se encuentra en `./test/apiTest.test.js`. Para ejecutar las pruebas con mocha hay que correr `npm run test:mocha`.

El reporte completo se encuentra en [./mochawesome-report/mochawesome.html](/mochawesome-report/mochawesome.html)

## Servicios

API RESTful de productos y carrito de compras.

Incorpora las siguientes rutas:

- GET '/api/productos' -> devuelve todos los productos.
- GET '/api/productos/:id' -> devuelve un producto según su id.
- POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado (solo para administradores).
- PUT '/api/productos/:id' -> recibe y actualiza un producto según su id (solo para administradores).
- DELETE '/api/productos/:id' -> elimina un producto según su id (solo para administradores).

Cada producto estará representado por un objeto con el siguiente formato:

```
{
    "id": 0,
    "nombre": "Cinta de reparación",
    "descripcion": "Cinta de reparación de pantalla de 5x200CM",
    "codigo": 1234567890,
    "precio": 4922,
    "foto": "https://ae01.alicdn.com/kf/H1b13e3760cc74dcd9b7e161256820bbdT/Cinta-de-reparaci-n-de-pantalla-de-5x200CM-parche-autoadhesivo-para-puerta-y-ventana-s-per.jpeg_Q90.jpeg_.webp",
    "stock": 10
}
```

Para el carrito, se tienen los siguientes métodos:

- POST: '/' - Crea un carrito y devuelve su id.
- DELETE: '/:id' - Vacía un carrito y lo elimina.
- GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
- POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto
- DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto

Cada carrito estará representado por un objeto con el siguiente formato:

```
{
    "id": 0,
    "timestamp": 1635264142953,
    "productos": []
}
```
