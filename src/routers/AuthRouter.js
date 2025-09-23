import express from "express";
import AuthController from "../controller/AuthController";

const routes = express.Router();

routes.post('/register', AuthController.register);

export default routes;