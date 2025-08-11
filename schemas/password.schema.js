import zod from 'zod';

//Esquema que se encarga de validar las contraseñas
//Requisitos: entre 7 y 20 caracteres, al menos una mayúscula y un número
export const passwordSchema = 
    zod.string().min(7, { 
        message: "La contraseña debe tener al menos 7 caracteres"
    }).max(20, { 
        message: "La contraseña sólo puede tener un máximo de 20 caracteres"
    })
    .refine((password) => /[A-Z]/.test(password), {
        message: "La contraseña debe contener al menos una letra mayúscula",
    })
    .refine((password) => /[0-9]/.test(password), { 
        message: "La contraseña debe contener al menos un número", 
    });