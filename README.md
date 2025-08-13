# API_Publicaciones_Comentarios
Desarrollamos una API estilo Blog personal desarrollada con Node.js, Express y MySQL


# Proyecto: API de Publicaciones y Comentarios (Blog Personal)

## 🧾 Objetivo del Proyecto
Desarrollar una API RESTful utilizando Node.js y Express que permita a los usuarios crear publicaciones tipo blog y comentar en ellas. La API debe incluir autenticación, control de permisos por autor, validaciones, protección contra XSS y estar estructurada bajo el patrón MVC.

---

## ✅ Características Técnicos

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

## 🧱 Estructura de Carpetas
```
/api
   /config
   /controllers
   /middlewares
   /models
   /mysql-docker
   /routes
   /schemas
   /shared
   /utils
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

## Sistema de Middlewares
- Se ha implementado un sistema de múltiples Middlewares con la intención de comprabar diferentes datos y reducir la repetición de código.

### **1. Middleware de Autenticación**  
**verifyToken**  
- Extrae el token del header `Authorization` en formato `Bearer <token>`  
- Verifica la firma usando la clave secreta de entorno  
- Decodifica y asigna `{ id, rol }` a `req.user`  
- Responde con **401 Unauthorized** si el token es inválido, expirado o ausente  

### **2. Middlewares de Validación de Esquemas**  
**validateSchemaPublicaciones**  
- Utiliza Zod para validar:  
  - `title`: 5–250 caracteres  
  - `content`: mínimo 10 caracteres  
- Responde con **400 Bad Request** y mensajes específicos de validación  

**validateSchemaComentarios**  
- Utiliza Zod para validar:  
  - `content`: mínimo 1 carácter  
- Responde con **400 Bad Request** si el contenido está vacío  

### **3. Middleware de Validación de Identificadores**  
**validateUUID**  
- Emplea la librería `uuid` para comprobar que `id` sea un UUID válido  
- Responde con **400 Bad Request** si el formato no es un UUID  

### **4. Middleware de Verificación de Recursos**  
**checkPublicacionExists**  
- Consulta la base de datos por el `id` de la publicación  
- Si no existe, responde con **404 Not Found**  
- Si existe pero fue eliminada lógicamente, responde con **410 Gone**  
- Almacena la entidad encontrada en `req.publicacion` para uso en el controlador  

### **5. Middleware de Manejo de Errores**  
- Centraliza respuestas de error mediante la clase **Respuestas**  
- Cada error lanzado con `AppError` o generado por un middleware  
- Middleware global captura y envía un JSON con las claves:  
  - `status` (código HTTP)  
  - `estado` (etiqueta lógica: `success` / `fail` / `error`)  
  - `message`  
  - `detalles` (información adicional)  

### **6. Flujo de Ejecución de Middlewares**  
1. **validateUUID**  
2. **checkPublicacionExists**  
3. **verifyToken** (solo en rutas protegidas)  
4. Validaciones de esquema: **validateSchemaPublicaciones** / **validateSchemaComentarios**  
5. Controlador  
6. Middleware global de manejo de errores  

---

## 🚀 Instalación

* **Clonar el repositorio**
   ```bash
  git clone https://github.com/CalebUnah7/API_Publicaciones_Comentarios.git
   ```

* **Levantar la base de datos**
  Desde la carpeta mysql-docker donde se encuentra el archivo docker-compose.yml, ejecuta:
  
  ```bash
  docker compose up -d
   ```
   Esto iniciará un contenedor MySQL con la base de datos configurada, tablas creadas y ejemplos precargados.
   

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

   Se puede referir al archivo appi.http para algunas pruebas comunes