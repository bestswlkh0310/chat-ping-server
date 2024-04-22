import MiddlewareLoader from "./src/global/loaders/middleware.loader.js";
import TasksLoaders from "./src/global/loaders/tasks.loader.js";
import RoutesLoader from "./src/global/loaders/routes.loader.js";
import ExpressLoader from "./src/global/loaders/express.loader.js";
import SocketClient from './src/global/socket/SocketClient.js'

const startServer = async () => {
    const {app, server} = ExpressLoader.init();
    RoutesLoader.initRoutes(app, 'v1');
    MiddlewareLoader.init(app);
    await TasksLoaders.init();
    SocketClient.init(server);

    server.listen(app.get("port"), () => {
        console.log(`🏇${app.get("port")}에서 서버가 실행중입니다!🚴`);
    });
}

startServer()
    .then(() => {});
