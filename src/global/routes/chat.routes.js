import express from "express";
import MatchController from "../../domain/chat/controller/chat.controller.js";
import awaitHandler from "../middleware/handler.middleware.js";
import auth from "../middleware/auth.middleware.js";

const chatRouter = express.Router();

chatRouter.post("/", auth, awaitHandler(MatchController.match));
chatRouter.post('/flow', auth, awaitHandler(MatchController.getFlow));
chatRouter.post('/finish', auth, awaitHandler(MatchController.finishChat));
chatRouter.post('/send-message', auth, awaitHandler(MatchController.sendMessage));
chatRouter.get('/chat', auth, awaitHandler(MatchController.getChatList));

export default chatRouter;