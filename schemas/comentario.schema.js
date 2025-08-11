import zod from 'zod';

//Esquema que se encarga de validar los datos de un comentario
//Requisitos: debe haber contenido, la ID de la publicación y la ID del Autor
const comentarioSchema = zod.object({
    "contenido": zod.string({
        message: "El comentario debe de tener contenido"
    }).min(1, {
        message: "El contenido del comentario debe tener al menos 1 carácter"
    }),
    "publicacionId": zod.string().uuid({ version: "v4" }),
    "autorId": zod.string().uuid({ version: "v4" }),
}).strict()

export const validateComentario = (comentario) => {
    return comentarioSchema.safeParse(comentario)
}