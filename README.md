# Desafío Clase 40 - DIVIDIR EN CAPAS NUESTRO PROYECTO

## Consignas:

- Modificar la capa de persistencia incorporando los conceptos de Factory, DAO, y DTO.
- Los DAOs deben presentar la misma interfaz hacia la lógica de negocio de nuestro servidor.
- El DAO seleccionado (por un parámetro en línea de comandos como lo hicimos anteriormente) será devuelto por una Factory para que la capa de negocio opere con el.
- Cada uno de estos casos de persistencia, deberán ser implementados usando el patrón singleton que impida crear nuevas instancias de estos mecanismos de acceso a los datos.
- Comprobar que si llamo a la factory dos veces, con una misma opción elegida, devuelva la misma instancia.
- Implementar el patrón Repository para la persistencia de productos y mensajes.

## Correr localmente el proyecto

- Instalar dependencias: `npm install`
- Modo de desarrollo con `nodemon`: `npm run dev`
- Correr localmente: `npm run start`

## Notas

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
