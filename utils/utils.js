export const errorNF = (res, message) => {
    return res.status(404).json({ message });
};
//ejemplo; errorNF(res, "no encontrado");

//TODO: ¿Implementar?