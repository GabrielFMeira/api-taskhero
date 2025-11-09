import express from "express";
import AuthController from "../controller/AuthController.js";
import { validateToken } from "../middlewares/Auth.js";

const routes = express.Router();

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);
routes.post('/password/reset', AuthController.resetPassword);
routes.put('/profile', validateToken, AuthController.updateProfile);
routes.get('/stats', validateToken, AuthController.getUserStats);
routes.put('/avatar/select', validateToken, AuthController.selectAvatar);

export default routes;