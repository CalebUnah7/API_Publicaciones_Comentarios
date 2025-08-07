import zod from 'zod';

const comentarioSchema = zod.object({
    "contenido": zod.string({
        message: "El comentario debe de tener contenido"
    }).min(1, {
        message: "El contenido del comentario debe tener al menos 1 carácter"
    }),
    "publicacionId": zod.string().uuid({ version: "v4" }),
    "autorId": zod.string().uuid({ version: "v4" }),
}).strict()