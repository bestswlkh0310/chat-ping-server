const log = (req, res, next) => {
    console.log('REQUEST - time:', Date.now());
    console.log('REQUEST - path:', req.path);
    console.log('REQUEST - body:', req.body);
    console.log('REQUEST - authorization:', req.headers.authorization);
    console.log('REQUEST - params:', req.params);

    return next();
};

export default log;