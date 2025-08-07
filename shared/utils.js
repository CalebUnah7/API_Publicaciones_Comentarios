export const success = (message, data) => {
    return {

        status: 200,
        message,
        data
    };
}

export const error = (message) => {
    return {

        status: 404,
        message,

    };
}