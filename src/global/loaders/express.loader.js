import express from "express";
import cors from "cors";
import http from "http";

class ExpressLoader {
    static init () {
        const app = express();
        app.set('port', process.env.PORT || 3001)
        app.use(express.json());
        app.use(cors());

        const server = http.createServer(app);

        return {app, server};
    }
}

export default ExpressLoader;