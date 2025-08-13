import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/usuario.routes.js';
import publicacionRoutes from './routes/publicacion.routes.js'
import comentarioRoutes from './routes/comentario.routes.js'
import Respuestas from './utils/respuestas.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'Bearer'] // Encabezados permitidos
}));

// Rutas de autenticación de usuario
app.use('/api/auth', authRoutes);

// Rutas para publicaciones
app.use('/api/publicaciones', publicacionRoutes)

// Rutas para comentarios de publicaciones
app.use('/api/publicaciones', comentarioRoutes)

app.use((req, res) => {
  const detalles = { ruta: req.url, metodo: req.method }
  return Respuestas.errorNF(res, `Dirección  no encontrada`, detalles)
})


// app.use((req, res) => {
//     res.status(404).json(
//         {
//             message: `${req.url} no encontrada`
//         }
//     )
// })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
