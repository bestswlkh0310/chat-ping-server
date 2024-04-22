import express from "express";
import AuthController from "../../domain/auth/controller/auth.controller.js";
import awaitHandler from "../middleware/handler.middleware.js";

const authRouter = express.Router();
authRouter.post("/login", awaitHandler(AuthController.login));
authRouter.post('/refresh', awaitHandler(AuthController.refresh));

export default authRouter;