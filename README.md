# API_Publicaciones_Comentarios
Crearemos una API estilo Blog personal desarrollada con Node.js, Express y MySQL



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

## 📡 Endpoints Requeridos

### Autenticación

| Método | Ruta                   | Descripción           |
|--------|------------------------|------------------------|
| POST   | /api/auth/register     | Registro de usuario    |
| POST   | /api/auth/login        | Inicio de sesión       |

---

### Publicaciones

| Método | Ruta                       | Descripción                                     | Protegido | Observaciones                    |
|--------|----------------------------|--------------------------------------------------|-----------|----------------------------------|
| GET    | /api/publicaciones         | Listar todas las publicaciones con paginación   | No        | Pública                          |
| GET    | /api/publicaciones/:id     | Ver una publicación específica                | No        | Pública                          |
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
- Los comentarios deben ser sanitizados para evitar ataques XSS.
- Los comentarios no requieren aprobación pero deben validarse (campos no vacíos, tamaño).
- Las fechas deben guardarse automáticamente al crear o comentar.

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

* **Instalar dependencias**
   ```bash
  npm install
   ```

* **Configurar .env**
   ```bash
  PORT=
  DB_HOST=
  DB_USER=
  DB_PASS=
  DB_NAME=
  JWT_SECRET=
   ```

* **Iniciar el servidor**
   ```bash
  npm run dev
   ```



