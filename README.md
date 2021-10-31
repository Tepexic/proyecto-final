# Proyecto final

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


## Notas Adicionales:
Hay una ruta adicional con dos métodos:
- GET: '/' - Obtiene si el usuario es admin { admin: true/false }
- POST: '/' - Cambia el estado del usuario de true a false o viceversa


El archivo `ProyectoFinal.postman_collection.json` contiene la colección de postman de todos los endpoints implementados

## Instalación
Con nodemon:

`nodemon server.js`

O bien:

`npm install`

`npm run serve`
