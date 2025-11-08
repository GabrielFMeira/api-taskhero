import express from "express";
import AuthController from "../controller/AuthController.js";
import { validateToken } from "../middlewares/Auth.js";

const routes = express.Router();

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);
routes.post('/password/reset', AuthController.resetPassword);
routes.put('/profile', validateToken, AuthController.updateProfile);

export default routes;