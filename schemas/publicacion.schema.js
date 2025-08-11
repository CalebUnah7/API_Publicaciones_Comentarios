import zod from 'zod';

//Esquema que se encarga de validar los datos de una publicación
//Requisitos: debe haber un título, contenido y la ID del Autor
const publicacionSchema = zod.object({
    "titulo": zod.string({
        message: "El titulo debería ser añadido"
    }).max(250),
    "contenido": zod.string().min(10, {
        message: "El contenido debe tener al menos 10 caracteres"
    })
});

export const validatePublicacion = (publicacion) => {
    return publicacionSchema.safeParse(publicacion)
}