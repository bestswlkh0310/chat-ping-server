import express from "express";
import MatchController from "../../domain/chat/controller/chat.controller.js";
import awaitHandler from "../middleware/handler.middleware.js";
import auth from "../middleware/auth.middleware.js";

const matchRouter = express.Router();

matchRouter.post("/", auth, awaitHandler(MatchController.match));

export default matchRouter;