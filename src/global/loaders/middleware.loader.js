import ApiException from "../execption/api.exception.js";
import errorMiddleware from "../middleware/error.middleware.js";

class MiddlewareLoader {
    static init (app){
        app.all('*', (req, res, next) => {
            const err = new ApiException('invalid endpoint exception', 404);
            next(err);
        });

        app.use(errorMiddleware);
    }
}

export default MiddlewareLoader;