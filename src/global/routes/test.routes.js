import express from "express";
import awaitHandler from "../middleware/handler.middleware.js";
import TestController from "../../domain/test/controller/test.controller.js";

const matchRouter = express.Router();

matchRouter.post("/token", awaitHandler(TestController.testToken));

export default matchRouter;