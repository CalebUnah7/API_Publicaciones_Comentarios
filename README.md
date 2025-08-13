# API_Publicaciones_Comentarios
Desarrollamos una API estilo Blog personal desarrollada con Node.js, Express y MySQL



Requisitos del Proyecto:

# Proyecto: API de Publicaciones y Comentarios (Blog Personal)

## 🧾 Objetivo
Desarrollar una API RESTful utilizando Node.js y Express que permita a los usuarios crear publicaciones tipo blog y comentar en ellas. La API debe incluir autenticación, control de permisos por autor, validaciones, protección contra XSS y estar estructurada bajo el patrón MVC.

---

## ✅ Requisitos Técnicos

- Node.js y Express.
- Base de datos MySQL.
- Autenticación con JWT.
- Encriptación de contraseñas con `bcrypt`.
- Protección de rutas con middlewares.
- Validación de entradas (campos requeridos, tipos de datos).
- Protección contra XSS.
- Patrón de arquitectura MVC.
- Manejo centralizado de errores.
- Variables de entorno con `dotenv`.
- Paginación de publicaciones.
- Documentación de la API.

---

## 🧱 Estructura de Carpetas Sugerida

```
/api
  /controllers
  /models
  /routes
  /middlewares
  /config
  /utils
  /schemas
  /shared
  /mysql-docker
server.js
.env
```

---

## 🔐 Autenticación

- Autenticación basada en JWT.
- `POST /api/auth/register`: Registro de usuario.
- `POST /api/auth/login`: Inicio de sesión.
- Middleware `verifyToken` para proteger rutas privadas.

---

## 🧾 Funcionalidad por Rol

### Usuario
- Registrar e iniciar sesión.
- Crear, ver, actualizar y eliminar sus propias publicaciones.
- Comentar en cualquier publicación pública.
- No puede editar ni eliminar publicaciones de otros usuarios.

---

## 📡 Endpoints Implementados

### Autenticación - Usuarios

| Método | Ruta                   | Descripción           |
|--------|------------------------|------------------------|
| POST   | /api/auth/register     | Registro de usuario    |
| POST   | /api/auth/login        | Inicio de sesión       |

---

### Publicaciones

| Método | Ruta                       | Descripción                                     | Protegido | Observaciones                    |
|--------|----------------------------|--------------------------------------------------|-----------|----------------------------------|
| GET    | /api/publicaciones         | Listar todas las publicaciones con paginación   | No        | Pública                          |
| GET    | /api/publicaciones/search  | Buscar publicaciones de acuerdo a Query         | No        | Título y/o Contenido             |
| GET    | /api/publicaciones/:id     | Ver una publicación específica                  | No        | Pública                          |
| POST   | /api/publicaciones         | Crear una nueva publicación                     | Sí        | Solo usuario autenticado         |
| PUT    | /api/publicaciones/:id     | Editar publicación (solo el autor)              | Sí        | Verificar propiedad              |
| DELETE | /api/publicaciones/:id     | Eliminar publicación (solo el autor)            | Sí        | Verificar propiedad              |

---

### Comentarios

| Método | Ruta                                | Descripción                                 | Protegido | Observaciones                    |
|--------|-------------------------------------|----------------------------------------------|-----------|----------------------------------|
| GET    | /api/publicaciones/:id/comentarios  | Ver todos los comentarios de una publicación | No        | Pública                          |
| POST   | /api/publicaciones/:id/comentarios  | Comentar en una publicación                  | Sí        | Usuario autenticado              |

---

## 🔁 Lógica de Negocio

- Solo el autor de una publicación puede editarla o eliminarla.
- Los comentarios son sanitizados para evitar ataques XSS.
- Los comentarios deben validarse (campos no vacíos, tamaño).
- Las fechas se guardan automáticamente al crear o comentar.

---

## 📋 Buenas Prácticas Esperadas

- Uso correcto de códigos HTTP.
- Validación de entradas en controladores o middleware.
- Middleware centralizado para manejo de errores.
- Estructura clara por módulos (MVC).
- Código organizado, comentado y mantenible.

---

## 🧪 Recomendaciones Adicionales

- Sanitizar los campos de entrada.
- Documentar los endpoints.
- Implementar orden descendente por fecha de publicación.
- Permitir búsquedas por palabra clave en título/contenido.

---

## 🚀 Instalación

* **Clonar el repositorio**
   ```bash
  git clone https://github.com/CalebUnah7/API_Publicaciones_Comentarios.git
   ```

* **Levantar la base de datos**
  Esto iniciará un contenedor MySQL con la base de datos configurada, taablas creadas y ejemplos precargados.
   ```bash
  docker compose up -d
   ```

* **Instalar dependencias**
   Las dependencias principales incluyen: `express`, `mysql2`, `jsonwebtoken`, `bycrypt`, `dotenv`, `cors` y `sanitizeHtml`.
   ```bash
  npm install
   ```

* **Configurar .env**
   Crea un archivo `.env` en la raiz del proyecto y asegúrese de que las variables de la base de datos coincidan con la configuracion de `docker-compose.yml`
   ```bash
  PORT=
  DB_HOST=
  DB_USER=
  DB_PASS=
  DB_NAME=
  JWT_SECRET=
   ```
  > ⚠️ El puerto `3311` se usa para evitar conflictos con instalaciones locales de MySQL.

* **Iniciar el servidor**
   ```bash
  npm run dev
   ```

---

## 🧱 Esquema de la base de datos
 Aqui se detallan las tablas y estructuras usadas en este proyecto:

## Tabla `users`
   | Columna | Tipo de dato | Descripción |
   |---|---|---|
   | `id` | `BINARY(16)` | Clave primaria, identificador único del usuario. |
   | `email` | `VARCHAR(255)` | Correo electrónico, único y no nulo. |
   | `handle` | `VARCHAR(50)` | Nombre de usuario o 'handle', único y no nulo. |
   | `nombre` | `VARCHAR(100)` | Nombre completo del usuario. |
   | `password_hash` | `VARCHAR(255)` | Hash de la contraseña. |
   | `must_change_password` | `BOOLEAN` | Indica si el usuario debe cambiar su contraseña en el próximo inicio de sesión. |
   | `role` | `ENUM('user', 'admin')` | Rol del usuario, por defecto 'user'. |
   | `created_at` | `TIMESTAMP` | Fecha de creación del registro. |

## Tabla `publicaciones`

   | Columna | Tipo de dato | Descripción |
   |---|---|---|
   | `id` | `char(36)` | Clave primaria, identificador único de la publicación. |
   | `titulo` | `varchar(255)` | Título de la publicación. |
   | `contenido` | `text` | Contenido de la publicación. |
   | `autorID` | `BINARY(16)` | ID del usuario autor, clave foránea a la tabla `users`. |
   | `fecha_creacion` | `timestamp` | Fecha de creación de la publicación. |
   | `activo` | `boolean` | Indica si la publicación está activa o no. |
   | `publica` | `boolean` | Indica si la publicación es pública o privada. |

## Tabla `comentariosPublicaciones`

   | Columna | Tipo de dato | Descripción |
   |---|---|---|
   | `id` | `char(36)` | Clave primaria, identificador único del comentario. |
   | `publicacion_id` | `char(36)` | ID de la publicación a la que pertenece el comentario. |
   | `user_id` | `BINARY(16)` | ID del usuario que realizó el comentario. |
   | `comentario` | `TEXT` | Contenido del comentario. |
   | `activo` | `BOOLEAN` | Indica si el comentario está activo o no. |
   | `fecha_creacion` | `TIMESTAMP` | Fecha de creación del comentario. |

---

## 🧪 Datos de Prueba

A continuación, se un ejemplo de insercion de datos que puede utilizar para poblar la base de datos y probar la funcionalidad de la API.

## `users`

```json
{
  "nombre": "Juan Pérez",
  "handle": "juanp",
  "email": "juan@example.com",
  "password_hash": "...bcrypt hash..."
}
