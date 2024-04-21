import {onlineUser} from "./src/domain/repository/Store.js";
import Repository from "./src/domain/repository/Repository.js";
import MiddlewareLoader from "./src/global/loaders/middleware.loader.js";
import TasksLoaders from "./src/global/loaders/tasks.loader.js";
import RoutesLoader from "./src/global/loaders/routes.loader.js";
import ExpressLoader from "./src/global/loaders/express.loader.js";
import Socket from './src/global/socket/socket.js'

const startServer = async () => {
    const {app, server} = ExpressLoader.init();
    RoutesLoader.initRoutes(app, 'v1');
    MiddlewareLoader.init(app);
    Socket.init(server);
    await TasksLoaders.init();

    server.listen(app.get("port"), () => {
        console.log(`🏇${app.get("port")}에서 서버가 실행중입니다!🚴`);
    });
}

startServer()
    .then(() => {});
