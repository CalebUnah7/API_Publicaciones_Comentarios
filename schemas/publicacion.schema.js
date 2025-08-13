import zod from 'zod';

//Esquema que se encarga de validar los datos de una publicación
//Requisitos: debe haber un título, contenido y la ID del Autor
export const publicacionSchema = zod.object({
    "titulo": zod.string({
        message: "El titulo debería ser añadido"
    }).min(5, {
        message: "El título debe tener al menos 5 caracteres"
    }).max(250),
    "contenido": zod.string({
        message: "El contenido tiene que ser añadido"
    }).min(10, {
        message: "El contenido debe tener al menos 10 caracteres"
    }).max(1000, {
        message: "El contenido ha exedido el límite de 1000 caracteres"
    }),
});

export const validatePublicacion = (publicacion) => {
    return publicacionSchema.safeParse(publicacion)
}