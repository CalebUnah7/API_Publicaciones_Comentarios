export const errorNF = (res, message) => {
    return res.status(404).json({ message });
};

