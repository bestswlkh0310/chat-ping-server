import express from "express";
import MatchController from "../../domain/chat/controller/chat.controller.js";
import authHandler from "../middleware/handler.middleware.js";

const matchRouter = express.Router();

matchRouter.post("/:id", authHandler, MatchController.match);

export default matchRouter;