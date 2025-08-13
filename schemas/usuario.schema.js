import zod from 'zod';
import { passwordSchema } from './password.schema.js';

//Esquema que se encarga de validar los datos de un usuario
//Requisitos: debe haber un nombre, email, handle(@...) y contraseña
const usuarioSchema = zod.object({
    "nombre": zod.string({
        message: "El nombre es obligatorio"
    }).min(4, {
        message: "El nombre no puede ser tan corto (min 4 caracteres)"
    }).max(100, {
        message: "El nombre no puede ser tan largo (max 100 caracteres)"}),
    "email": zod.string().email({
        message: "El email debe ser un correo electrónico válido"
    }),
    "handle": zod.string().min(3, {
        message: "El handle del usuario debe tener al menos 3 caracteres"
    }).max(20, {
        message: "El handle del usuario no puede tener más de 20 caracteres"
    }),
    "password": passwordSchema,
    "role": zod.enum(['user', 'admin'], {
        message: "El rol debe ser 'user' o 'admin'"
    }).default('user') // Por defecto, el rol es 'user'
}).strict()

export const validateUsuario = (usuario) => {
    return usuarioSchema.safeParse(usuario)
}