import express from "express";
import authController from "../../domain/auth/controller/auth.controller.js";

const authRouter = express.Router();
authRouter.post("/login", authController.login);

export default authRouter;