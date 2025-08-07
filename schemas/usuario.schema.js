import zod from 'zod';
import { passwordSchema } from './password.schema.js';

//cambiar de ser necesario
const usuarioSchema = zod.object({
    "nombre": zod.string({
        message: "El nombre es obligatorio"
    }).min(3, {
        message: "El nombre no puede ser tan corto (min 3 caracteres)"
    }).max(100, {
        message: "El nombre no puede ser tan largo (max 100 caracteres)"}),
    "email": zod.string().z.email({
        message: "El email debe ser un correo electrónico válido"
    }),
    "handle": zod.string().min(3, {
        message: "El handle del usuario debe tener al menos 3 caracteres"
    }).max(30),
    "password": passwordSchema,
}).strict()

export const validateUsuario = (usuario) => {
    return usuarioSchema.safeParse(usuario)
}