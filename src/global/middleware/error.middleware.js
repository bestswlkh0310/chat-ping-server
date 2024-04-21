import ApiException from "../execption/api.exception.js";

const errorMiddleware = (err, req, res, next) => {
    console.log('errorMiddleware -', req.path);
    if (err.status === 500 || !err.message) new ApiException('Internal server error', 500);
    let { message, state, status } = err;

    const errorResponse = {
        status,
        message,
        state
    };

    console.log('errorResponse', errorResponse);
    res.status(status).send(errorResponse);
}

export default errorMiddleware;