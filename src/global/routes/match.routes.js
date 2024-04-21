import express from "express";
import MatchController from "../../domain/match/controller/match.controller.js";

const matchRouter = express.Router();

matchRouter.post("/:id", MatchController.match);

export default matchRouter;