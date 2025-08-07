export const success = (message, data) => {
    return {

        status: 200,
        message,
        data
    };
}

export const errorNF = (message) => {
    return {

        status: 404,
        message,

    };
}