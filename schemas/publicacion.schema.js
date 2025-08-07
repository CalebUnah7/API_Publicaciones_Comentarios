import zod from 'zod';

const publicacionSchema = zod.object({
    "titulo": zod.string({
        message: "El titulo debería ser añadido"
    }).max(250),
    "contenido": zod.string().min(10, {
        message: "El contenido debe tener al menos 10 caracteres"
    }),
    "autorId": zod.string().uuid({ version: "v4" }),
});

export const validatePublicacion = (publicacion) => {
    return publicacionSchema.safeParse(publicacion)
}