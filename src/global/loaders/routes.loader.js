import authRouter from "../routes/auth.routes.js";
import chatRouter from "../routes/chat.routes.js";
import log from "../middleware/log.middleware.js";
import testRoutes from "../routes/test.routes.js";

class RoutesLoader {
    static initRoutes (app, version) {
        app.use('/*', log);
        app.use(`/api/${version}/auth`, authRouter);
        app.use(`/api/${version}/match`, chatRouter);
        app.use(`/api/${version}/test`, testRoutes);
    }
}

export default RoutesLoader;