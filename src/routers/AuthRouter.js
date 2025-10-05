import express from "express";
import AuthController from "../controller/AuthController.js";

const routes = express.Router();

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);
routes.post('/password/reset', AuthController.resetPassword);

export default routes;