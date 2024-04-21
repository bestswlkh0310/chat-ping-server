import express from "express";
import AuthController from "../../domain/auth/controller/auth.controller.js";

const authRouter = express.Router();
authRouter.post("/login", AuthController.login);

export default authRouter;