import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import publicacionRoutes from './routes/publicacion.routes.js'
import comentarioRoutes from './routes/comentario.routes.js'

dotenv.config();

const app = express();
app.use(express.json());


app.use('/api/auth', authRoutes);

app.use('/api/publicaciones', publicacionRoutes)

app.use('/api/publicaciones', comentarioRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
