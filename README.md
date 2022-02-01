# Proyecto final

API RESTful de productos y carrito de compras. La persistencia de los datos y sesiones de usuarios se realiza en Mongo Atlas.

## Postman:

- El archivo `ProyectoFinal.postman_collection.json` contiene la colección de postman de todos los endpoints implementados

## Instalación

Para instalar las dependencias: `npm install`

Correr:
`npm run serve`
O bien, en modo desarrollo con nodemon:
`npm run dev`

El archivo `.env` debe contener:

```
# Options: file, mongodb, firebase
TYPE=mongodb
# Mongo DB settings
MONGO_DB_USER=jesus
MONGO_DB_PASSWORD=8dQg6XUWTuRWZV
USERS_DB=pf_users
## Modo cluster
SERVER_MODE=cluster
## Node mailer
EMAIL=bethany.tillman27@ethereal.email
EMAIL_PASSWORD=pQuppmEj5TgFPX7XJM
## Twilio
TWILIO_SID=ACcc05e6c84ed93285de403cae28d4a553
TWILIO_TOKEN=a3928ecd6e86ada7efbba85cd200d60b
TWILIO_MESSAGING_SERVICE=MG65e1e89b327bf36fb96ba78616d87d50
TWILIO_WHATSAPP=+14155238886
```

El proyecto se encuentra desplegado en Heroku (back end) y Netlify (front end).
El front end se encuentra hecho en Vue:

- Repositorio: [Tepexic/proyecto-final-front](https://github.com/Tepexic/proyecto-final-front)
- Proyecto desplegado: [https://proyecto-final-coderhouse.netlify.app/](https://proyecto-final-coderhouse.netlify.app/tienda/productos)

Este es el repositorio para el backend, y se encuentra desplegado en Heroku en: [https://proyecto-final-coderhouse.herokuapp.com/](https://proyecto-final-coderhouse.herokuapp.com/)

Para que pueda enviarse el whatsapp al administrador, debe enviarse primero un mensaje al `+14155238886` con el mensaje `join touch-sets`

Las credenciales del usuario de prueba son:

- correo: `usuario@coder.com`
- contraseña: `coderhouse`

Hay una parte de la consigna (`La imagen se podrá subir al servidor y se guardará en una carpeta pública del mismo a la cual se tenga acceso por url.`) que no es posible hacer en Heroku, debido a que las carpetas publicas dentro de heroku son de solo lectura. Para poder entregar el desafio, decidi utilizar S3 de AWS para guardar las imagenes.

## Rutas

### Usuarios

- POST `/api/auth/login` -> Da acceso al usuario con una sesion de 10 minutos (cookie)
- POST `/api/auth/signup` -> registra al usuario y le da acceso con una sesion de 10 minutos (cookie)

El esquema del usuario es de la forma:

```
{
    "email": String,
    "username": String,
    "password": String,
    "name": String,
    "address": String,
    "age": Number,
    "phone": String,
    "avatar": String,
    "isAdmin": Boolean,
}
```

### Productos

- GET `/api/productos` -> devuelve todos los productos.
- GET `/api/productos/:id` -> devuelve un producto según su id.
- POST `/api/productos` -> recibe y agrega un producto, y lo devuelve con su id asignado (solo para administradores).
- PUT `/api/productos/:id` -> recibe y actualiza un producto según su id (solo para administradores).
- DELETE `/api/productos/:id` -> elimina un producto según su id (solo para administradores).

Cada producto estará representado por un objeto con el siguiente formato:

```
{
    "_id": "Fzo2c2gfcHGZsZ1ncIuk",
    "nombre": "Cinta de reparación",
    "descripcion": "Cinta de reparación de pantalla de 5x200CM",
    "codigo": 1234567890,
    "precio": 4922,
    "foto": "https://ae01.alicdn.com/kf/H1b13e3760cc74dcd9b7e161256820bbdT/Cinta-de-reparaci-n-de-pantalla-de-5x200CM-parche-autoadhesivo-para-puerta-y-ventana-s-per.jpeg_Q90.jpeg_.webp",
    "stock": 10
}
```

### Carrito

Para el carrito, se tienen los siguientes métodos:

- POST: `/` -> Crea un carrito y devuelve su id.
- DELETE: `/:id` -> Vacía un carrito y lo elimina.
- GET: `/:id/productos` -> Me permite listar todos los productos guardados en el carrito
- POST: `/:id/productos` -> Para incorporar productos al carrito por su id de producto
- DELETE: `/:id/productos/:id_prod` -> Eliminar un producto del carrito por su id de carrito y de producto

Cada carrito estará representado por un objeto con el siguiente formato:

```
{
    "_id": "DpStxbzenPh5GlGW7MU4",
    "timestamp": 1635264142953,
    "productos": []
}
```
