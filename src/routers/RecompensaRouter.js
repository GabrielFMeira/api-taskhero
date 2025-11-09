import express from "express";
import RecompensaController from "../controller/RecompensaController.js";
import {validateToken} from "../middlewares/Auth.js";

const routes = express.Router();

routes.use(validateToken);
routes.put('/buy/:recompensaId', RecompensaController.compraAvatar);
routes.get('/list', RecompensaController.listarRecompensas);

export default routes;